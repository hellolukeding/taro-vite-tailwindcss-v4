import { View } from '@tarojs/components'
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

  const handleSubmit = () => {
    if (!value.trim()) {
      Toast.show({ message: '请输入评论内容', type: 'fail' })
      return
    }

    onSubmit?.(value)
    setValue('')
    Toast.show({ message: '评论已提交', type: 'success' })
  }

  return (
    <View className='fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 p-3 pb-8 z-40'>
      <View className='flex items-center gap-3'>
        <Field
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          className='flex-1 bg-white! border border-gray-200 rounded-full'
          style={{ borderRadius: '9999px', background: '#fff' }}
        />
        <Button
          onClick={handleSubmit}
          color='primary'
          shape='round'
          className='w-11! h-11!'
        >
          <Icon name='send' size={20} color='white' />
        </Button>
      </View>
    </View>
  )
}
