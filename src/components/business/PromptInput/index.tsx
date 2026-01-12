import { Textarea, View, Text } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { useState } from 'react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onTranslate?: () => void
  onRandom?: () => void
}

export function PromptInput({ value, onChange, onTranslate, onRandom }: PromptInputProps) {
  const handleTranslate = () => {
    onTranslate?.()
  }

  const handleRandom = () => {
    onRandom?.()
  }

  return (
    <View className='bg-white rounded-2xl p-5 shadow-lg border border-gray-100'>
      {/* Header */}
      <View className='flex justify-between items-center mb-3'>
        <Text className='text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1'>
          <Icon name='edit_note' size={16} />
          提示词
        </Text>
        <View
          onClick={handleTranslate}
          className='flex items-center gap-1 text-xs font-bold text-white bg-black px-3 py-1.5 rounded-lg'
        >
          <Icon name='translate' size={12} />
          中译英
        </View>
      </View>

      {/* Textarea */}
      <Textarea
        value={value}
        onInput={(e) => onChange(e.detail.value)}
        placeholder='描述你想生成的图片... (例如: 一个未来城市的街道，霓虹灯光，8k分辨率)'
        className='bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm placeholder-gray-400 text-gray-800'
        style={{ resize: 'none', width: '100%', maxWidth: '100%', minHeight: '96px', maxHeight: '200px', boxSizing: 'border-box' }}
        maxlength={500}
        autoHeight
      />

      {/* Random Button */}
      <View className='flex justify-end mt-3'>
        <View
          onClick={handleRandom}
          className='text-xs font-semibold text-black flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-full'
        >
          <Icon name='casino' size={14} />
          随机
        </View>
      </View>
    </View>
  )
}
