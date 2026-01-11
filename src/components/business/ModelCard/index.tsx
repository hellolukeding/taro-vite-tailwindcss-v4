import { View, Image, Text } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { MockModel } from '@/mock/studio'

interface ModelCardProps {
  model: MockModel
  onPress: () => void
}

export function ModelCard({ model, onPress }: ModelCardProps) {
  return (
    <View className='flex-shrink-0 w-32 relative group cursor-pointer' onClick={onPress}>
      {/* VIP Badge */}
      {model.isVIP && (
        <View className='absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10'>
          VIP
        </View>
      )}

      {/* 模型卡片 */}
      <View
        className={`w-32 h-44 rounded-2xl overflow-hidden border-4 transition relative ${
          model.isSelected
            ? 'border-black shadow-lg'
            : 'border-transparent hover:border-gray-300'
        }`}
      >
        {/* 图片 */}
        <Image
          src={model.imageUrl}
          className='w-full h-full object-cover'
          mode='aspectFill'
        />

        {/* 渐变遮罩 */}
        <View className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />

        {/* 选中图标 */}
        {model.isSelected && (
          <View className='absolute bottom-3 left-0 right-0 text-center'>
            <Icon name='check_circle' size={24} color='white' filled />
          </View>
        )}
      </View>

      {/* 模型名称 */}
      <Text
        className={`text-center text-xs font-bold mt-2 uppercase tracking-wide ${
          model.isSelected ? 'text-black' : 'text-gray-500'
        }`}
      >
        {model.name}
      </Text>
    </View>
  )
}
