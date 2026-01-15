import { View } from '@tarojs/components'
import './index.scss'

export const LogoIcon: React.FC = () => {
  return (
    <View className='logo-icon-wrapper'>
      {/* 使用 SVG 绘制画笔 + 矩形组合图标 */}
      <svg
        width='64'
        height='64'
        viewBox='0 0 64 64'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* 矩形画布 */}
        <rect
          x='12'
          y='20'
          width='40'
          height='32'
          rx='4'
          fill='#000000'
        />

        {/* 画笔笔触 */}
        <path
          d='M24 12 L28 20 L20 20 Z'
          fill='#000000'
        />

        {/* 画笔杆 */}
        <rect
          x='22'
          y='4'
          width='4'
          height='12'
          fill='#000000'
        />
      </svg>
    </View>
  )
}
