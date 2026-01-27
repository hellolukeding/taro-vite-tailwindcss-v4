/**
 * 创作工作台相关API
 */
import type { ModelInfo, TaskStatus, TaskSubmitParams } from "@/types";
import Taro from "@tarojs/taro";
import { API_BASE_URL } from "@/utils/constants";
import { normalizeUrl } from "@/utils/url";
import client from "./client";

const BASE_URL = API_BASE_URL;

export interface RandomPrompt {
  prompt: string;
  category?: string;
}

export interface TaskEstimate {
  estimated_cost: number;
  estimated_time: number;
  user_credits: number;
  can_afford: boolean;
}

export const studioApi = {
  /**
   * 获取可用模型列表
   */
  async getModels(isActive?: boolean): Promise<ModelInfo[]> {
    return client.get("/miniprogram/studio/models", { is_active: isActive });
  },

  /**
   * 获取随机提示词灵感
   */
  async getRandomPrompt(category?: string): Promise<RandomPrompt> {
    return client.get("/miniprogram/studio/random-prompt", { category });
  },

  /**
   * 提示词翻译
   * @param prompt 待翻译文本
   * @param source 源语言: auto=自动检测, zh=中文, en=英文, ja=日文
   * @param target 目标语言: zh=中文, en=英文, ja=日文
   * @param withSuggestions 是否返回优化建议
   */
  async translate(
    prompt: string,
    source: string = "auto",
    target: string = "en",
    withSuggestions: boolean = false,
  ): Promise<{
    success: boolean;
    original_text: string;
    translated_text: string;
    source_language: string;
    target_language: string;
    suggestions?: Array<{
      type: string;
      label: string;
      prompt: string;
    }>;
  }> {
    return client.post("/miniprogram/studio/translate", {
      prompt,
      source,
      target,
      with_suggestions: withSuggestions,
    });
  },

  /**
   * 估算任务成本
   */
  async estimate(params: {
    model_id: string;
    prompt: string;
    parameters: {
      width: number;
      height: number;
      steps?: number;
    };
  }): Promise<TaskEstimate> {
    return client.post("/miniprogram/studio/estimate", params);
  },

  /**
   * 提交生图任务
   */
  async submitTask(params: TaskSubmitParams): Promise<{
    task_id: string;
    status: string;
    message: string;
  }> {
    return client.post("/miniprogram/studio/submit", params);
  },

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    return client.get(`/miniprogram/studio/task/${taskId}`);
  },

  /**
   * 获取提示词标签分类列表
   */
  async getCategories(): Promise<string[]> {
    const response = await client.get<{items: string[]; total: number}>(
      "/miniprogram/studio/categories",
      {},
      { skipAuth: true }
    );
    console.log('[getCategories] Response:', response);
    console.log('[getCategories] Items:', response?.items);
    const items = response?.items || [];
    console.log('[getCategories] Returning items:', items);
    return items;
  },

  /**
   * 获取提示词列表
   */
  async getPrompts(params?: {
    tag?: string;
    keyword?: string;
    page?: number;
    page_size?: number;
  }): Promise<{
    items: Array<{
      id: string;
      title: string;
      cover_image: string | null;
      tags: string[];
      model: string;
      description: string | null;
      views_count: number;
      likes_count: number;
      favorites_count: number;
      creator: {
        user_id: string;
        nickname: string | null;
        avatar_url: string | null;
      };
    }>;
    total: number;
    page: number;
    page_size: number;
    has_more: boolean;
  }> {
    const response = await client.get<{
      items: Array<any>;
      total: number;
      page: number;
      page_size: number;
      has_more: boolean;
    }>(
      "/miniprogram/studio/prompts",
      params,
      {
        skipAuth: true,
      }
    );
    return {
      items: response.items || [],
      total: response.total || 0,
      page: response.page || 1,
      page_size: response.page_size || 20,
      has_more: response.has_more || false,
    };
  },

  /**
   * 上传图片到服务器
   */
  async uploadImage(
    filePath: string,
    token: string,
  ): Promise<{
    url: string;
    id?: string;
    filename?: string;
  }> {
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: `${BASE_URL}/upload`,
        filePath,
        name: "file",
        header: {
          Authorization: `Bearer ${token}`,
        },
        formData: {
          token,
          r18: "0",
        },
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              console.log('[uploadImage] Raw response:', res.data);
              // 兼容不同环境：res.data 可能是字符串或对象
              const response = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
              console.log('[uploadImage] Parsed response:', response);

              // 检查统一响应格式 {success: true, data: {...}}
              if (response.success && response.data) {
                // 检查 data.status
                if (response.data.status === 'success') {
                  // 注意：后端返回了两层嵌套的 data: { success, data: { status, data: { url_direct } } }
                  const innerData = response.data.data;

                  if (!innerData) {
                    console.error('[uploadImage] No inner data found in response:', response.data);
                    reject(new Error('响应中缺少图片数据'));
                    return;
                  }

                  // 优先使用 url_direct，其次 url_preview
                  const imageUrl = innerData.url_direct || innerData.url_preview;

                  if (!imageUrl) {
                    console.error('[uploadImage] No URL found in response:', innerData);
                    reject(new Error('响应中缺少图片URL'));
                    return;
                  }

                  // 使用 normalizeUrl 处理相对路径
                  const fullUrl = normalizeUrl(imageUrl);
                  console.log('[uploadImage] Upload successful, URL:', fullUrl);
                  resolve({
                    url: fullUrl,
                    id: innerData.id,
                    filename: innerData.filename,
                  });
                } else {
                  console.error('[uploadImage] Upload failed with status:', response.data);
                  reject(new Error(response.data.message || '上传失败'));
                }
              } else {
                console.error('[uploadImage] Invalid response format:', response);
                reject(new Error('响应格式错误'));
              }
            } catch (e) {
              console.error('[uploadImage] Parse error:', res.data, e);
              reject(new Error("解析响应失败"));
            }
          } else {
            console.error('[uploadImage] HTTP error:', res.statusCode);
            reject(new Error(`上传失败: ${res.statusCode}`));
          }
        },
        fail: (error) => {
          console.error('[uploadImage] Upload failed:', error);
          reject(error);
        },
      });
    });
  },
};
