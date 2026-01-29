/**
 * 时间格式化工具
 * 提供相对时间格式化功能，类似微信的时间显示
 */

/**
 * 格式化相对时间（类似微信）
 * @param isoString ISO格式时间字符串
 * @returns 相对时间字符串
 *
 * @example
 * formatRelativeTime("2024-01-19T10:30:00Z") // "2小时前"（假设当前时间2小时后）
 * formatRelativeTime("2024-01-19T08:30:00Z") // "刚刚"
 */
export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const past = new Date(isoString).getTime();
  const diff = now - past;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

/**
 * 格式化友好的日期时间（用于注册时间等需要显示具体日期的场景）
 * @param isoString ISO格式时间字符串
 * @returns 格式化的日期字符串
 *
 * @example
 * formatFriendlyDate("2024-01-19T10:30:00Z") // "2024年1月19日"
 */
export function formatFriendlyDate(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}

/**
 * 格式化完整的日期时间（包含年月日时分）
 * @param isoString ISO格式时间字符串
 * @returns 格式化的日期时间字符串
 *
 * @example
 * formatFullDateTime("2024-01-19T10:30:00Z") // "2024年01月19日 10:30"
 */
export function formatFullDateTime(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}
