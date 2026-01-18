import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { Button, Toast } from '@taroify/core'
import { Icon } from '@/components/common/Icon'

interface PromptSectionProps {
  prompt: string
  params?: string
}

export function PromptSection({ prompt, params }: PromptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = () => {
    const fullText = params ? `${prompt} ${params}` : prompt
    Taro.setClipboardData({
      data: fullText,
    })
    Toast.show({ message: '已复制', type: 'success' })
  }

  return (
    <View className='flex flex-col space-y-4'>
      {/* Header */}
      <View className='flex items-center justify-between px-5 pt-5'>
        <View className='flex items-center gap-2'>
          <View className='w-1 h-5 bg-black rounded-full' />
          <Text className='text-base font-bold text-gray-900'>提示词</Text>
        </View>
        <Button
          onClick={handleCopy}
          size='small'
          color='black'
          shape='round'
          className='rounded-full transition-all duration-200 active:scale-95'
          style={{ 
            padding: '6px 12px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Icon name='content_copy' size={14} />
          <Text className='ml-1'>复制</Text>
        </Button>
      </View>

      {/* Content */}
      <View className='relative px-5 pb-5'>
        <View 
          className='bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 border border-gray-100 shadow-sm'
          style={{ position: 'relative' }}
        >
          <Text
            className={`text-gray-700 text-sm leading-relaxed break-words transition-all duration-300 ${
              !isExpanded ? 'line-clamp-4' : ''
            }`}
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            {prompt}{' '}
            {params && (
              <Text className='text-gray-900 font-semibold' style={{ fontSize: '15px' }}>{params}</Text>
            )}
          </Text>

          {/* 展开按钮渐变背景 */}
          {!isExpanded && (
            <View 
              className='absolute bottom-0 left-0 right-0 flex items-end justify-center'
              style={{ 
                height: '60px',
                background: 'linear-gradient(to top, rgb(249 250 251), transparent)',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                paddingBottom: '8px'
              }}
            >
              <Button
                onClick={() => setIsExpanded(true)}
                size='small'
                variant='text'
                color='primary'
                className='transition-all duration-200 active:scale-95 flex items-center'
                style={{ fontSize: '13px' }}
              >
                <Text>展开全部</Text>
                <Icon name='expand_more' size={16} className='ml-1' />
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

// Trigger recompilation - updated at 2026-01-18
