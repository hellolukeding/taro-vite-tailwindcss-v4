import { Input as TaroInput, Text, View } from '@tarojs/components'
import React from 'react'

export interface InputProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  disabled?: boolean
  type?: 'text' | 'number' | 'digit' | 'idcard' | 'phone'
  maxLength?: number
  className?: string
  label?: string
  required?: boolean
  error?: string
}

const Input: React.FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  type = 'text',
  maxLength,
  className = '',
  label,
  required = false,
  error
}) => {
  return (
    <View className={`w-full ${className}`}>
      {label && (
        <View className='mb-2 flex items-center'>
          <Text className='text-sm font-medium text-gray-700'>{label}</Text>
          {required && <Text className='text-theme-primary ml-1'>*</Text>}
        </View>
      )}
      <View className={`relative ${label ? '' : ''}`}>
        <TaroInput
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onInput={(e) => onChange?.(e.detail.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          type={type === 'phone' ? 'text' : type === 'idcard' ? 'text' : type}
          maxlength={maxLength}
          className={`w-full px-4 py-3 rounded-lg border transition-all ${error
            ? 'border-red-500 bg-red-50 focus:border-red-600'
            : 'border-gray-200 bg-white focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20'
            } ${disabled ? 'opacity-50 bg-gray-50' : ''} text-gray-800 text-sm placeholder:text-gray-400`}
        />
      </View>
      {error && (
        <Text className='text-xs text-red-500 mt-1 ml-1'>{error}</Text>
      )}
    </View>
  )
}

export default Input
