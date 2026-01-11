import { View, Image, Text } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { MockWork } from '@/mock/square'

interface WorkCardProps {
  work: MockWork
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <View className='mb-4 break-inside-avoid'>
      <View className='relative rounded-2xl overflow-hidden shadow-sm border border-gray-100'>
        {/* 图片 */}
        <Image
          src={work.imageUrl}
          className='w-full aspect-[3/4]'
          mode='aspectFill'
          lazyLoad
        />

        {/* VIP标识 */}
        {work.isVIP && (
          <View className='absolute top-2.5 right-2.5 bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm'>
            VIP
          </View>
        )}
      </View>

      {/* Prompt文本 */}
      <View className='mt-2 px-1'>
        <Text className='text-sm text-gray-800 line-clamp-2'>{work.prompt}</Text>
      </View>

      {/* 底部信息 */}
      <View className='flex items-center justify-between mt-2 px-1'>
        <View className='flex items-center gap-1'>
          <Image
            src={work.creator.avatar}
            className='w-5 h-5 rounded-full'
            mode='aspectFill'
          />
          <Text className='text-xs text-gray-500'>{work.creator.name}</Text>
        </View>
        <View className='flex items-center gap-0.5'>
          <Icon name='favorite' size={14} filled color='#F43F5E' />
          <Text className='text-xs text-gray-500'>{work.likes}</Text>
        </View>
      </View>
    </View>
  )
}
