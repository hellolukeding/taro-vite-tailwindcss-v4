import { View, Text } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'

type TabType = 'square' | 'create' | 'message' | 'profile'

interface BottomNavProps {
  activeTab: TabType
}

export function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <View className='fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-8 pt-2 px-6 rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.03)] z-50'>
      <View className='max-w-md mx-auto grid grid-cols-4 gap-1'>
        {/* 广场 */}
        <View className='flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-black transition-colors group'>
          <Icon
            name='grid_view'
            size={26}
            filled={activeTab === 'square'}
            className='group-hover:scale-110 transition-transform font-light'
          />
          <Text className={`text-[10px] font-medium ${activeTab === 'square' ? 'text-black' : ''}`}>
            广场
          </Text>
        </View>

        {/* 创作 - 浮动按钮样式 */}
        <View className='flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-black transition-colors group'>
          <View className='w-12 h-8 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors'>
            <Icon name='add_photo_alternate' size={24} className='transition-transform' />
          </View>
          <Text className='text-[10px] font-medium'>创作</Text>
        </View>

        {/* 消息 */}
        <View className='flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-black transition-colors group'>
          <Icon
            name='chat_bubble_outline'
            size={26}
            className='group-hover:scale-110 transition-transform font-light'
          />
          <Text className='text-[10px] font-medium'>消息</Text>
        </View>

        {/* 我的 */}
        <View className='flex flex-col items-center gap-1 py-2 text-black transition-colors group relative'>
          <Icon
            name='person'
            size={26}
            filled={activeTab === 'profile'}
            className='group-hover:scale-110 transition-transform'
          />
          <Text className={`text-[10px] font-bold ${activeTab === 'profile' ? 'text-black' : ''}`}>
            我的
          </Text>
          {activeTab === 'profile' && (
            <View className='absolute top-2 right-4 w-1.5 h-1.5 bg-red-500 rounded-full border border-white' />
          )}
        </View>
      </View>
    </View>
  )
}
