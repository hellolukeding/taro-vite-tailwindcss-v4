import { View } from '@tarojs/components'
import { CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  filled?: boolean
  color?: string
  className?: string
}

export function Icon({
  name,
  size = 24,
  filled = false,
  color = '#000000',
  className = '',
}: IconProps) {
  const style: CSSProperties = {
    fontSize: `${size}px`,
    fontVariationSettings: filled
      ? `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`
      : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    color,
    userSelect: 'none',
  }

  return (
    <View className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </View>
  )
}
