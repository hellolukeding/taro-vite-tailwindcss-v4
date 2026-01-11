import { Text, View } from '@tarojs/components'
import React from 'react'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'medium',
  block = false,
  loading = false,
  disabled = false,
  onClick,
  children,
  className = ''
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all active:scale-95'

  const typeClasses = {
    primary: 'bg-theme-primary text-white hover:bg-opacity-90',
    secondary: 'bg-theme-secondary text-white hover:bg-opacity-90',
    outline: 'border-2 border-theme-primary text-theme-primary bg-transparent'
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3.5 text-base'
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : 'cursor-pointer'
  const blockClasses = block ? 'w-full' : 'inline-flex'
  const loadingClasses = loading ? 'pointer-events-none' : ''

  return (
    <View
      className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${blockClasses} ${disabledClasses} ${loadingClasses} ${className}`}
      onClick={disabled || loading ? undefined : onClick}
    >
      {loading ? (
        <View className='flex items-center justify-center gap-2'>
          <View className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></View>
          <Text>加载中...</Text>
        </View>
      ) : (
        children
      )}
    </View>
  )
}

export default Button
