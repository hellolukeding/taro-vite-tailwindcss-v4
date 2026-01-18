import Taro from "@tarojs/taro";

const BASE_URL = "http://localhost:8000/api/v1/miniprogram";

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

  // 检查响应状态
  if (response.statusCode !== 200) {
    throw new Error(`API Error: ${response.statusCode}`);
  }

  // 检查数据格式
  if (!response.data || !response.data.success || !response.data.data) {
    throw new Error("Invalid response format");
  }

  return response.data.data;
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
  return response.data.data;
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
  return response.data.data;
}

/**
 * 点赞/取消点赞作品（已废弃，请使用 likePrompt/unlikePrompt）
 * @deprecated 使用 likePrompt/unlikePrompt 替代
 */
export async function toggleLikeWork(taskId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/square/work/${taskId}/like`,
    method: "POST",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
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
  return response.data.data;
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
  return response.data.data;
}

/**
 * 收藏/取消收藏作品（已废弃，请使用 favoritePrompt/unfavoritePrompt）
 * @deprecated 使用 favoritePrompt/unfavoritePrompt 替代
 */
export async function toggleFavoriteWork(taskId: string) {
  const token = Taro.getStorageSync("token");
  const response = await Taro.request({
    url: `${BASE_URL}/studio/prompts/${taskId}/favorite`,
    method: "POST",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
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
  offset = 0
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
  return response.data.data;
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
  parentId?: string
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
  return response.data.data;
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
  return response.data.data;
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
  return response.data;
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
