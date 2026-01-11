import * as TaroifyIcons from '@taroify/icons'
import { View } from '@tarojs/components'
import { CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  color?: string
  className?: string
}

// 图标名称映射到 Taroify 图标组件
const iconMap: Record<string, keyof typeof TaroifyIcons> = {
  // 导航相关
  expand_more: 'ArrowDown',
  expand_less: 'ArrowUp',
  arrow_back_ios: 'ArrowLeft',
  chevron_right: 'ArrowRight',
  home: 'HomePage',

  // 操作相关
  add: 'Add',
  close: 'Cross',
  check: 'Success',
  delete: 'Delete',
  edit: 'Edit',
  search: 'Search',
  share: 'Share',
  settings: 'Setting',

  // 内容相关
  favorite: 'GoodJob',
  bookmark: 'Like',
  thumb_up: 'GoodJob',
  notifications: 'Bell',
  info: 'Info',
  warning: 'Warning',

  // 文件相关
  file: 'Folder',
  image: 'Photo',
  video: 'Video',
  download: 'Down',
  upload: 'Up',

  // 编辑相关
  copy: 'Copy',
  cut: 'Cut',
  paste: 'Paste',
  content_copy: 'Copy',
  edit_note: 'Edit',

  // 用户相关
  user: 'User',
  users: 'Friends',
  person: 'User',
  account_circle: 'User',

  // 媒体控制
  play_arrow: 'Play',
  pause: 'Pause',
  stop: 'Stop',
  skip_next: 'Speed',
  skip_previous: 'Rewind',

  // 状态相关
  lock: 'Lock',
  lock_open: 'Unlock',
  public: 'Globe',
  broken_image: 'PhotoFail',
  check_circle: 'Check',

  // 其他
  bolt: 'Bolt',
  casino: 'Shuffle',
  translate: 'Chat',
  filter_list: 'Filter',
  history: 'Clock',
  tune: 'Setting',
  auto_awesome: 'Star',
  location_on: 'Location',
  calendar_today: 'Calendar',
  access_time: 'Clock',
  phone: 'Phone',
  mail: 'Chat',
  link: 'Link',
  visibility: 'Eye',
  visibility_off: 'ClosedEye',
  keyboard_arrow_down: 'ArrowDown',
  keyboard_arrow_up: 'ArrowUp',
  keyboard_arrow_left: 'ArrowLeft',
  keyboard_arrow_right: 'ArrowRight',
}

export function Icon({
  name,
  size = 24,
  color = '#000000',
  className = '',
}: IconProps) {
  // 获取对应的 Taroify 图标组件名称
  const taroifyIconName = iconMap[name] || name

  // 动态获取图标组件
  const TaroifyIcon = TaroifyIcons[taroifyIconName as keyof typeof TaroifyIcons] as React.ComponentType<{ className?: string; style?: CSSProperties }>

  const style: CSSProperties = {
    fontSize: `${size}px`,
    color,
    display: 'inline-block',
  }

  if (!TaroifyIcon) {
    // 如果找不到对应的图标，显示文本占位
    console.warn(`Icon "${name}" not found in Taroify icons`)
    return <View className={className} style={style}>?</View>
  }

  return <TaroifyIcon className={className} style={style} />
}
