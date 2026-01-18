/**
 * 统一的间距和布局常量
 * 用于保持整个应用的视觉一致性
 */

// 间距系统 (基于 8px 网格)
export const SPACING = {
  // 基础间距
  xs: '4px',   // 0.25rem
  sm: '8px',   // 0.5rem  
  md: '16px',  // 1rem
  lg: '24px',  // 1.5rem
  xl: '32px',  // 2rem
  xxl: '48px', // 3rem

  // 特殊间距
  container: '16px',     // 容器左右间距
  section: '20px',      // 区块间距
  component: '16px',    // 组件间距
  element: '8px',       // 元素间距
}

// 圆角系统
export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px', 
  lg: '16px',
  xl: '24px',
  round: '9999px',
}

// 阴影系统
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
}

// 字体大小
export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
}

// 行高
export const LINE_HEIGHTS = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
}

// 断点
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

// 组件特定尺寸
export const COMPONENT_SIZES = {
  // 按钮尺寸
  button: {
    sm: { height: '32px', padding: '0 12px' },
    md: { height: '40px', padding: '0 16px' },
    lg: { height: '48px', padding: '0 24px' },
  },
  
  // 输入框尺寸
  input: {
    sm: { height: '32px', padding: '0 8px' },
    md: { height: '40px', padding: '0 12px' },
    lg: { height: '48px', padding: '0 16px' },
  },

  // 头像尺寸
  avatar: {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
  },

  // 图标尺寸
  icon: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '28px',
    xl: '32px',
  },
}

// 动画时长
export const DURATIONS = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
}