import { API_BASE_URL } from "@/utils/constants";
import Taro from "@tarojs/taro";

const BASE_URL = `${API_BASE_URL}/miniprogram`;

/**
 * 统一响应处理 - 兼容新旧两种格式
 *
 * 旧格式: {success: true, data: {...}}
 * 新格式: 直接返回数据 {...}
 * 错误格式: {detail: "错误信息"}
 */
function unwrapResponse(response: any, errorMessage = "Invalid response format") {
  if (!response.data) {
    throw new Error(`${errorMessage}: response.data is empty`);
  }

  // FastAPI错误响应格式
  if (response.data.detail) {
    throw new Error(response.data.detail);
  }

  // 优先检查旧格式：{success: true, data: {...}}
  // 必须先检查这个，因为 response.data.success 也是truthy
  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  // 新格式：直接返回数据（已解包）
  // 检查是否有业务数据字段（根据具体接口调整）
  // 注意：排除 success 字段，避免与旧格式冲突
  if (
    !response.data.success &&  // 确保不是旧格式
    (response.data.prompt_id ||
     response.data.title ||
     response.data.cover_image ||
     response.data.likes_count !== undefined ||
     response.data.favorites_count !== undefined ||
     Array.isArray(response.data.items) ||
     Array.isArray(response.data.comments))
  ) {
    return response.data;
  }

  // 都不是，抛出错误
  console.error("❌ Invalid response format:", response.data);
  throw new Error(errorMessage);
}

/**
 * 获取提示词详情
 * @param promptId 提示词ID
 */
export async function getPromptDetail(promptId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/square/prompt/${promptId}`,
    method: "GET",
    header: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(`API Error: ${response.statusCode}`);
  }

  return unwrapResponse(response, "Failed to load detail");
}

/**
 * 获取作品详情（已废弃，请使用 getPromptDetail）
 * @deprecated 使用 getPromptDetail 替代
 */
export async function getWorkDetail(taskId: string) {
  return getPromptDetail(taskId);
}

/**
 * 点赞提示词
 * @param promptId 提示词ID
 * @returns { likes_count: number }
 */
export async function likePrompt(promptId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/studio/prompts/${promptId}/like`,
    method: "POST",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to like prompt");
}

/**
 * 取消点赞提示词
 * @param promptId 提示词ID
 * @returns { likes_count: number }
 */
export async function unlikePrompt(promptId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/studio/prompts/${promptId}/like`,
    method: "DELETE",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to unlike prompt");
}

/**
 * 点赞/取消点赞作品（已废弃，请使用 likePrompt/unlikePrompt）
 * @deprecated 使用 likePrompt/unlikePrompt 替代
 */
export async function toggleLikeWork(taskId: string) {
  return likePrompt(taskId);
}

/**
 * 收藏提示词
 * @param promptId 提示词ID
 * @returns { favorites_count: number }
 */
export async function favoritePrompt(promptId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/studio/prompts/${promptId}/favorite`,
    method: "POST",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to favorite prompt");
}

/**
 * 取消收藏提示词
 * @param promptId 提示词ID
 * @returns { favorites_count: number }
 */
export async function unfavoritePrompt(promptId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/studio/prompts/${promptId}/favorite`,
    method: "DELETE",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to unfavorite prompt");
}

/**
 * 收藏/取消收藏作品（已废弃，请使用 favoritePrompt/unfavoritePrompt）
 * @deprecated 使用 favoritePrompt/unfavoritePrompt 替代
 */
export async function toggleFavoriteWork(taskId: string) {
  return favoritePrompt(taskId);
}

/**
 * 获取评论列表
 * @param taskId 作品ID
 * @param limit 每页数量
 * @param offset 偏移量
 * @returns { total: number, items: Array }
 */
export async function getComments(
  targetType: "task" | "prompt",
  targetId: string,
  limit = 20,
  offset = 0,
) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/comments`,
    method: "GET",
    data: { target_type: targetType, target_id: targetId, limit, offset },
    header: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return unwrapResponse(response, "Failed to load comments");
}

/**
 * 发表评论
 * @param targetType 目标类型 (task 或 prompt)
 * @param targetId 目标ID (任务ID或提示词ID)
 * @param content 评论内容
 * @param parentId 父评论ID（可选，用于回复）
 */
export async function createComment(
  targetType: "task" | "prompt",
  targetId: string,
  content: string,
  parentId?: string,
) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/comments`,
    method: "POST",
    data: {
      target_type: targetType,
      target_id: targetId,
      content: content,
      parent_id: parentId,
    },
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to create comment");
}

/**
 * 点赞/取消点赞评论
 * @param commentId 评论ID
 * @returns { is_liked: boolean, likes_count: number }
 */
export async function toggleLikeComment(commentId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/comments/${commentId}/like`,
    method: "POST",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to like comment");
}

/**
 * 记录分享行为
 * @param taskId 作品ID
 */
export async function shareWork(taskId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/square/work/${taskId}/share`,
    method: "POST",
    data: {}, // 传递空对象，后端需要请求体
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return unwrapResponse(response, "Failed to share work");
}

/**
 * 数据映射：后端字段 → 前端字段
 *
 * 后端字段 -> 前端字段：
 * task_id -> id
 * user_nickname -> nickname
 * user_avatar -> avatar
 * is_liked -> liked
 * is_favorited -> bookmarked
 * likes_count -> likes
 * favorites_count -> bookmarks
 */
