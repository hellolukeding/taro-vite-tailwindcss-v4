import { Text, View } from '@tarojs/components'
import { RatioButton } from '../RatioButton'

export type ImageRatio = 'auto' | '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | '21:9' | '3:2' | '2:3' | '5:4' | '4:5'

interface RatioSelectorProps {
  selectedRatio: ImageRatio
  onSelect: (ratio: ImageRatio) => void
}

const ratios: ImageRatio[] = ['auto', '1:1', '3:4', '4:3', '16:9', '9:16', '21:9', '3:2', '2:3', '5:4', '4:5']

export function RatioSelector({ selectedRatio, onSelect }: RatioSelectorProps) {
  return (
    <View className='mt-10'>
      {/* Section Header */}
      <Text className='text-lg font-bold mb-5 flex items-center gap-2'>
        <View className='w-1.5 h-6 bg-black rounded-full'></View>
        图片比例
      </Text>

      {/* Ratio Buttons Grid */}
      <View className='grid grid-cols-4 gap-3'>
        {ratios.map((ratio) => (
          <RatioButton
            key={ratio}
            ratio={ratio}
            isSelected={selectedRatio === ratio}
            onPress={() => onSelect(ratio)}
          />
        ))}
      </View>
    </View>
  )
}
