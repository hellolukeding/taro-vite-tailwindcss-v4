import { Text, View } from '@tarojs/components'
import React from 'react'

export interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  padding?: string
  onClick?: () => void
  bordered?: boolean
  shadow?: boolean
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  padding = 'p-4',
  onClick,
  bordered = true,
  shadow = true
}) => {
  return (
    <View
      className={`bg-white rounded-xl ${padding} ${bordered ? 'border border-gray-100' : ''} ${shadow ? 'shadow-sm' : ''} ${onClick ? 'active:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <View className='mb-3'>
          <Text className='text-lg font-bold text-gray-800'>{title}</Text>
          {subtitle && (
            <Text className='text-sm text-gray-500 mt-1 block'>{subtitle}</Text>
          )}
        </View>
      )}
      {children}
    </View>
  )
}

export default Card
