/**
 * URL工具函数
 */

import { BASE_URL } from './constants'

/**
 * 智能拼接URL
 *
 * 如果URL已经是完整的（以http开头），直接返回；
 * 否则添加BASE_URL前缀
 *
 * @param url - 原始URL（可能是相对路径或完整URL）
 * @returns 完整的可访问URL
 *
 * @example
 * ```ts
 * normalizeUrl('/minio/images/test.png') // 'https://xxx.com/minio/images/test.png'
 * normalizeUrl('http://localhost:9000/test.png') // 'http://localhost:9000/test.png'
 * normalizeUrl(undefined) // ''
 * ```
 */
export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return ''

  // 如果URL已经是完整的（以http开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 否则添加BASE_URL
  return `${BASE_URL}${url}`
}

/**
 * 批量处理URL数组
 *
 * @param urls - URL数组
 * @returns 处理后的URL数组
 *
 * @example
 * ```ts
 * normalizeUrls(['/img1.png', 'http://example.com/img2.png'])
 * // ['https://xxx.com/img1.png', 'http://example.com/img2.png']
 * ```
 */
export function normalizeUrls(urls: (string | undefined | null)[]): string[] {
  return urls.map(url => normalizeUrl(url))
}
