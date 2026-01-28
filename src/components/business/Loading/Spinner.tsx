import { Text, View } from '@tarojs/components'
import { FC } from 'react'

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  color?: string
}

/**
 * Spinner 旋转加载图标
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 'medium',
  text,
  color = 'black'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-4'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  const colorClass = color === 'white' ? 'border-white' : 'border-black'

  return (
    <View className='flex flex-col items-center justify-center gap-2'>
      <View
        className={`
          ${sizeClasses[size]}
          ${colorClass}
          border-transparent border-t-current rounded-full animate-spin
        `}
      />
      {text && (
        <Text className={`${textSizeClasses[size]} text-gray-600`}>
          {text}
        </Text>
      )}
    </View>
  )
}
