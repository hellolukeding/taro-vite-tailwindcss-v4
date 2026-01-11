import { View, Text } from '@tarojs/components'
import { CSSProperties } from 'react'

type ImageRatio = '1:1' | '3:4' | '16:9' | '9:16'

interface RatioButtonProps {
  ratio: ImageRatio
  isSelected: boolean
  onPress: () => void
}

const ratioIcons: Record<ImageRatio, JSX.Element> = {
  '1:1': (
    <View className='w-6 h-6 border-2 border-white dark:border-black bg-white/20 rounded-sm' />
  ),
  '3:4': (
    <View className='w-5 h-7 border-2 border-white dark:border-black bg-white/20 rounded-sm' />
  ),
  '16:9': (
    <View className='w-8 h-[18px] border-2 border-white dark:border-black bg-white/20 rounded-sm' />
  ),
  '9:16': (
    <View className='w-[18px] h-8 border-2 border-white dark:border-black bg-white/20 rounded-sm' />
  ),
}

export function RatioButton({ ratio, isSelected, onPress }: RatioButtonProps) {
  return (
    <View
      onClick={onPress}
      className={`p-3 flex flex-col items-center justify-center gap-2 rounded-xl transition ${
        isSelected
          ? 'bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-lg'
          : 'bg-white border-2 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {ratioIcons[ratio]}
      <Text className={`text-xs font-bold ${isSelected ? 'text-white dark:text-black' : 'text-gray-500'}`}>
        {ratio}
      </Text>
    </View>
  )
}
