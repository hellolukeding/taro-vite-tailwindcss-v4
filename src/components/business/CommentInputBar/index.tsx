import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button, Field, Toast } from '@taroify/core'
import { Icon } from '@/components/common/Icon'

interface CommentInputBarProps {
  placeholder?: string
  onSubmit?: (text: string) => void
}

export function CommentInputBar({
  placeholder = '说点什么...',
  onSubmit,
}: CommentInputBarProps) {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!value.trim()) {
      Toast.show({ message: '请输入评论内容', type: 'fail' })
      return
    }

    setSubmitting(true)
    try {
      await onSubmit?.(value)
      setValue('')
      Toast.show({ message: '评论已提交', type: 'success' })
    } catch (error) {
      Toast.show({ message: '评论失败', type: 'fail' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className='fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 p-3 pb-8 z-40'>
      <View className='flex items-center gap-3'>
        <View className='flex-1 relative'>
          <Field
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            maxLength={500}
            className='bg-white border border-gray-300 rounded-full px-4'
            style={{ borderRadius: '9999px' }}
          />
          {/* 字数统计 */}
          {value.length > 0 && (
            <Text className='text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2'>
              {value.length}/500
            </Text>
          )}
        </View>
        <Button
          onClick={handleSubmit}
          color='black'
          shape='round'
          loading={submitting}
          disabled={!value.trim() || submitting}
          className='w-11! h-11!'
        >
          <Icon name='send' size={20} color='white' />
        </Button>
      </View>
    </View>
  )
}
