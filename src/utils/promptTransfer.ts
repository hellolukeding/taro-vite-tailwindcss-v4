/**
 * 智能提示词传输工具
 *
 * 功能：
 * - 自动检测提示词大小，选择最佳传输方式
 * - 小提示词（<5KB）: 使用本地存储（快速）
 * - 大提示词（≥5KB）: 使用后端 Redis 暂存（可靠）
 * - 自动降级：本地存储失败时自动使用后端接口
 *
 * 优势：
 * - 支持长文本和复杂 JSON 结构
 * - 无大小限制
 * - 自动容错处理
 */

import { API_BASE_URL } from "./constants";
import Taro from "@tarojs/taro";

// 本地存储键
const STORAGE_KEY = "prompt_from_detail";
const DRAFT_ID_KEY = "prompt_draft_id";

// 大小阈值（2KB = 2048 bytes）- 降低阈值以更多地使用后端接口
// 后端接口更可靠，支持复杂数据结构，且无大小限制
const SIZE_THRESHOLD = 2 * 1024;

/**
 * 计算数据大小（bytes）
 * 兼容小程序环境（不支持Blob）
 */
function getDataSize(data: any): number {
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);

    // 小程序环境兼容：使用字符串长度作为近似值
    // 对于UTF-8编码，英文1字节，中文3字节
    // 这里使用简单的估算方法
    let size = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode < 0x80) {
        size += 1; // ASCII: 1 byte
      } else if (charCode < 0x800) {
        size += 2; // 2 bytes
      } else {
        size += 3; // 中文等: 3 bytes
      }
    }

    return size;
  } catch (error) {
    console.error('[PromptTransfer] Failed to calculate data size:', error);
    return 0;
  }
}

/**
 * 创建提示词草稿（后端接口）
 */
async function createDraftPrompt(content: any): Promise<string | null> {
  try {
    const token = Taro.getStorageSync("token");
    const response = await Taro.request({
      url: `${API_BASE_URL}/miniprogram/studio/draft-prompts`,
      method: "POST",
      header: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      data: {
        content,
        metadata: {
          timestamp: new Date().toISOString(),
          source: "prompt-detail",
        },
      },
    });

    console.log("[PromptTransfer] Draft prompt response:", response);
    console.log("  - statusCode:", response.statusCode);
    console.log("  - data:", response.data);

    if (response.statusCode !== 200) {
      // 处理HTTP错误
      const errorMsg = response.data?.detail || response.data?.message || `HTTP ${response.statusCode}`;
      throw new Error(errorMsg);
    }

    if (!response.data?.success) {
      // 处理业务错误
      throw new Error(response.data?.message || "创建草稿失败");
    }

    const draftId = response.data.data?.draft_id;
    if (!draftId) {
      throw new Error("响应中缺少 draft_id");
    }

    console.log("[PromptTransfer] ✅ Created draft prompt:", draftId);

    // 存储 draft_id 到本地（用于跳转后获取）
    Taro.setStorageSync(DRAFT_ID_KEY, draftId);

    return draftId;
  } catch (error) {
    console.error("[PromptTransfer] Failed to create draft prompt:", error);
    return null;
  }
}

/**
 * 使用本地存储传输
 */
function transferViaLocalStorage(content: any): boolean {
  try {
    const dataStr = typeof content === 'string' ? content : JSON.stringify(content);
    Taro.setStorageSync(STORAGE_KEY, dataStr);
    console.log("[PromptTransfer] ✅ Stored to local storage, size:", getDataSize(content), "bytes");
    return true;
  } catch (error) {
    console.error("[PromptTransfer] Failed to store to local storage:", error);
    return false;
  }
}

/**
 * 智能传输提示词到 Studio 页面
 *
 * @param content 提示词内容（支持字符串或复杂JSON对象）
 * @param options 选项
 * @returns 是否成功传输
 */
export async function transferPromptToStudio(
  content: any,
  options: {
    forceBackend?: boolean;  // 强制使用后端接口
    onSuccess?: (method: "local" | "backend") => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<boolean> {
  const { forceBackend = false, onSuccess, onError } = options;

  console.log("=== [PromptTransfer] Starting prompt transfer ===");
  console.log("[PromptTransfer] Content type:", typeof content);
  console.log("[PromptTransfer] Content size:", getDataSize(content), "bytes");

  try {
    // 1. 如果强制使用后端，直接调用接口
    if (forceBackend) {
      console.log("[PromptTransfer] Using backend (forced)");
      const draftId = await createDraftPrompt(content);
      if (!draftId) {
        throw new Error("Failed to create draft prompt");
      }
      onSuccess?.("backend");
      return true;
    }

    // 2. 如果数据大小超过阈值，使用后端接口
    const size = getDataSize(content);
    if (size >= SIZE_THRESHOLD) {
      console.log("[PromptTransfer] Using backend (large content, size:", size, "bytes)");
      const draftId = await createDraftPrompt(content);
      if (!draftId) {
        throw new Error("Failed to create draft prompt for large content");
      }
      onSuccess?.("backend");
      return true;
    }

    // 3. 小数据：尝试本地存储
    console.log("[PromptTransfer] Trying local storage (small content, size:", size, "bytes)");
    const localSuccess = transferViaLocalStorage(content);

    if (localSuccess) {
      // 验证：读取回来确认数据完整
      const verification = Taro.getStorageSync(STORAGE_KEY);
      const verified = parseLocalData(verification);

      console.log("[PromptTransfer] ✅ Local storage verification:");
      console.log("  - Original type:", typeof content, Array.isArray(content) ? "array" : "");
      console.log("  - Verified type:", typeof verified, Array.isArray(verified) ? "array" : "");

      // 类型检查：确保读取的数据与原始数据类型一致
      const typeMatch =
        (typeof content === 'string' && typeof verified === 'string') ||
        (Array.isArray(content) && Array.isArray(verified)) ||
        (typeof content === 'object' && typeof verified === 'object' && content !== null && verified !== null);

      if (!typeMatch) {
        console.warn("[PromptTransfer] ⚠️ Type mismatch detected, falling back to backend");
        Taro.removeStorageSync(STORAGE_KEY);
      } else {
        onSuccess?.("local");
        return true;
      }
    }

    // 4. 本地存储失败或类型不匹配，自动降级到后端接口
    console.log("[PromptTransfer] Local storage failed, falling back to backend");
    const draftId = await createDraftPrompt(content);
    if (!draftId) {
      throw new Error("Both local storage and backend failed");
    }
    onSuccess?.("backend");
    return true;

  } catch (error) {
    console.error("[PromptTransfer] ❌ Transfer failed:", error);
    onError?.(error as Error);
    return false;
  }
}

/**
 * 智能解析本地存储的数据
 * 尝试 JSON.parse，如果失败则返回原始字符串
 */
function parseLocalData(dataStr: string): any {
  try {
    // 尝试解析为 JSON
    const parsed = JSON.parse(dataStr);

    // 如果解析成功，检查是否是数组或对象
    if (Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null)) {
      console.log("[PromptTransfer] 📦 Parsed as JSON:", typeof parsed, Array.isArray(parsed) ? 'array' : 'object');
      return parsed;
    }

    // 如果是简单值（数字、布尔、null），直接返回
    return parsed;
  } catch (error) {
    // JSON.parse 失败，说明是普通字符串，直接返回
    console.log("[PromptTransfer] 📝 Plain string detected");
    return dataStr;
  }
}

/**
 * 从 Studio 页面接收提示词
 *
 * @returns 提示词内容，如果不存在则返回 null
 */
export async function receivePromptFromTransfer(): Promise<any> {
  console.log("=== [PromptTransfer] Receiving prompt ===");

  try {
    // 1. 优先检查是否有 draft_id（后端接口）
    const draftId = Taro.getStorageSync(DRAFT_ID_KEY);
    if (draftId) {
      console.log("[PromptTransfer] Found draft_id:", draftId);

      const token = Taro.getStorageSync("token");
      const response = await Taro.request({
        url: `${API_BASE_URL}/miniprogram/studio/draft-prompts/${draftId}`,
        method: "GET",
        header: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.statusCode === 200 && response.data?.success && response.data?.data) {
        const content = response.data.data.content;
        console.log("[PromptTransfer] ✅ Retrieved from backend, type:", typeof content);

        // 清除 draft_id
        Taro.removeStorageSync(DRAFT_ID_KEY);

        return content;
      } else {
        console.warn("[PromptTransfer] Draft not found or expired");
        Taro.removeStorageSync(DRAFT_ID_KEY);
      }
    }

    // 2. 回退到本地存储
    const localData = Taro.getStorageSync(STORAGE_KEY);
    if (localData) {
      console.log("[PromptTransfer] ✅ Retrieved from local storage, raw type:", typeof localData);

      // 智能解析：尝试 JSON.parse，如果失败则返回原始字符串
      const parsed = parseLocalData(localData);

      console.log("[PromptTransfer] ✅ Parsed local data, final type:", typeof parsed, Array.isArray(parsed) ? 'array' : '');

      Taro.removeStorageSync(STORAGE_KEY);
      return parsed;
    }

    console.log("[PromptTransfer] No prompt found");
    return null;

  } catch (error) {
    console.error("[PromptTransfer] ❌ Receive failed:", error);
    return null;
  }
}

/**
 * 清除传输的提示词（如果需要）
 */
export function clearTransferredPrompt(): void {
  try {
    Taro.removeStorageSync(STORAGE_KEY);
    Taro.removeStorageSync(DRAFT_ID_KEY);
    console.log("[PromptTransfer] Cleared transferred prompt");
  } catch (error) {
    console.error("[PromptTransfer] Failed to clear:", error);
  }
}
