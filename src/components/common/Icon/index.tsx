import { View, Text } from "@tarojs/components";
import { CSSProperties } from "react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// 使用 emoji 和 Unicode 符号替代图标库
const iconSymbols: Record<string, string> = {
  // 导航相关
  expand_more: "▼",
  expand_less: "▲",
  arrow_back: "←",
  arrow_back_ios: "←",
  arrow_back_ios_new: "←",
  chevron_right: "→",
  home: "⌂",
  more_horiz: "⋯",

  // 操作相关
  add: "+",
  close: "×",
  check: "✓",
  delete: "🗑",
  edit: "✎",
  search: "🔍",
  share: "↗",
  settings: "⚙",
  fullscreen: "⛶",

  // 内容相关
  favorite: "♥",
  bookmark: "★",
  thumb_up: "👍",
  notifications: "🔔",
  info: "ℹ",
  warning: "⚠",

  // 文件相关
  file: "📄",
  image: "🖼",
  video: "🎬",
  camera: "📷",
  download: "⬇",
  upload: "⬆",

  // 编辑相关
  copy: "📋",
  cut: "✂",
  paste: "📋",

  // 用户相关
  user: "👤",
  users: "👥",
  person: "👤",
  account_circle: "👤",

  // 媒体控制
  play_arrow: "▶",
  pause: "⏸",
  stop: "⏹",

  // 状态相关
  lock: "🔒",
  lock_open: "🔓",
  public: "🌐",
  broken_image: "🖼",
  image_not_supported: "🖼",

  // 沟通相关
  chat_bubble: "💬",
  send: "➤",

  // 其他
  location_on: "📍",
  calendar_today: "📅",
  phone: "📞",
  mail: "✉",
  visibility: "👁",
  visibility_off: "🚫",
  keyboard_arrow_down: "↓",
  keyboard_arrow_up: "↑",
  keyboard_arrow_left: "←",
  keyboard_arrow_right: "→",

  // 新增图标
  gender: "⚥",
  briefcase: "💼",
  chevron_left: "←",
};

export function Icon({
  name,
  size = 24,
  color = "#000000",
  className = "",
}: IconProps) {
  // 获取对应的符号
  const symbol = iconSymbols[name];

  const style: CSSProperties = {
    fontSize: `${size}px`,
    color,
    display: "inline-block",
    lineHeight: "1",
  };

  // 如果找不到对应的符号，显示问号
  const displaySymbol = symbol || "?";

  return (
    <View className={className} style={style}>
      <Text>{displaySymbol}</Text>
    </View>
  );
}
