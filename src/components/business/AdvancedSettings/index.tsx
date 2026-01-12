import { View, Text, Slider } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { useState } from 'react'

interface AdvancedSettingsProps {
  steps?: number
  cfg?: number
  onStepsChange?: (value: number) => void
  onCfgChange?: (value: number) => void
}

export function AdvancedSettings({
  steps = 30,
  cfg = 7.5,
  onStepsChange,
  onCfgChange,
}: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View className='mt-10 pb-8'>
      <View className='bg-white rounded-2xl border-2 border-gray-100 overflow-hidden'>
        {/* Header */}
        <View
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex justify-between items-center p-4 active:bg-gray-50'
        >
          <View className='flex items-center gap-2'>
            <Icon name='tune' size={20} />
            <Text className='font-bold text-sm'>高级设置</Text>
          </View>
          <View
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <Icon name='expand_more' size={20} color='#9CA3AF' />
          </View>
        </View>

        {/* Content */}
        {isExpanded && (
          <View className='px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50'>
            <View className='mt-2 space-y-6'>
              {/* Steps Slider */}
              <View>
                <View className='flex justify-between mb-2'>
                  <Text className='text-xs font-bold text-gray-500 uppercase'>步数</Text>
                  <Text className='text-xs font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-200'>
                    {steps}
                  </Text>
                </View>
                <Slider
                  value={steps}
                  min={10}
                  max={50}
                  showValue={false}
                  activeColor='#000000'
                  backgroundColor='#E5E7EB'
                  blockSize={16}
                  onChange={(e) => onStepsChange?.(e.detail.value)}
                  className='w-full'
                />
              </View>

              {/* CFG Slider */}
              <View>
                <View className='flex justify-between mb-2'>
                  <Text className='text-xs font-bold text-gray-500 uppercase'>提示词引导 (CFG)</Text>
                  <Text className='text-xs font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-200'>
                    {cfg}
                  </Text>
                </View>
                <Slider
                  value={cfg}
                  min={1}
                  max={20}
                  step={0.5}
                  showValue={false}
                  activeColor='#000000'
                  backgroundColor='#E5E7EB'
                  blockSize={16}
                  onChange={(e) => onCfgChange?.(e.detail.value)}
                  className='w-full'
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
