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
    <View className='flex flex-col gap-3'>
      {/* Header */}
      <View className='flex items-center justify-between'>
        <View className='flex items-center gap-2'>
          <View className='w-1 h-5 bg-blue-600 rounded-full' />
          <Text className='text-lg font-bold text-gray-900'>提示词</Text>
        </View>
        <Button
          onClick={handleCopy}
          size='mini'
          variant='outlined'
          color='default'
          className='rounded-full!'
        >
          <Icon name='content_copy' size={16} />
          <Text>复制</Text>
        </Button>
      </View>

      {/* Content */}
      <View className='relative'>
        <View className='bg-white rounded-xl p-4 border border-gray-100'>
          <Text
            className={`text-gray-600 text-base font-normal leading-relaxed break-words ${
              !isExpanded ? 'line-clamp-4' : ''
            }`}
          >
            {prompt}{' '}
            {params && (
              <Text className='text-blue-600 font-medium'>{params}</Text>
            )}
          </Text>
        </View>

        {/* Expand Button */}
        {!isExpanded && (
          <View className='absolute bottom-px left-px right-px h-16 rounded-b-xl bg-gradient-to-t from-white via-white to-transparent flex items-end justify-center pb-2'>
            <Button
              onClick={() => setIsExpanded(true)}
              size='small'
              variant='text'
              color='primary'
              className='rounded-full! bg-white/50 backdrop-blur-sm'
            >
              <Text>点击展开</Text>
              <Icon name='expand_more' size={18} />
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}
