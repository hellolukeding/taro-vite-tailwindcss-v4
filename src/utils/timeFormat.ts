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
