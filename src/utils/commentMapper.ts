/**
 * 评论数据映射工具
 * 将后端API返回的评论数据格式转换为前端组件期望的格式
 */

import { normalizeUrl } from "./url";
import { formatRelativeTime } from "./timeFormat";

/**
 * 后端API返回的评论数据格式
 */
export interface ApiComment {
  comment_id: string;
  user_nickname: string;
  user_avatar: string;
  created_at: string;
  content: string;
  likes_count: number;
}

/**
 * 前端组件使用的评论数据格式
 */
export interface Comment {
  id: string;
  username: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
}

/**
 * 将单个API评论数据映射为前端格式
 * @param apiComment 后端API返回的评论数据
 * @returns 前端组件使用的评论数据
 */
export function mapCommentFromApi(apiComment: ApiComment): Comment {
  return {
    id: apiComment.comment_id,
    username: apiComment.user_nickname,
    avatar: normalizeUrl(apiComment.user_avatar),
    time: formatRelativeTime(apiComment.created_at),
    content: apiComment.content,
    likes: apiComment.likes_count,
  };
}

/**
 * 批量映射评论列表
 * @param apiComments 后端API返回的评论列表
 * @returns 前端组件使用的评论列表
 */
export function mapCommentListFromApi(apiComments: ApiComment[]): Comment[] {
  return apiComments.map(mapCommentFromApi);
}
