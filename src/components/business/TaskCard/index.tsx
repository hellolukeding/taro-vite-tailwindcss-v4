import { Icon } from '@/components/common/Icon'
import { MockTask } from '@/mock/tasks'
import { Button } from '@taroify/core'
import { Image, Text, View } from '@tarojs/components'

interface TaskCardProps {
  task: MockTask
}

export function TaskCard({ task }: TaskCardProps) {
  // 私有状态
  if (task.status === 'private') {
    return (
      <View className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
        <View className='relative aspect-[3/4] bg-gray-100 overflow-hidden'>
          <Image
            src={task.imageUrl!}
            className='w-full h-full object-cover'
            mode='aspectFill'
          />
          <View className='absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md w-7 h-7 flex items-center justify-center rounded-full'>
            <Icon name='lock' size={14} color='white' filled />
          </View>
        </View>
        <View className='p-3'>
          <View className='flex justify-between items-center mb-3'>
            <Text className='text-[10px] text-gray-500 font-medium bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded'>
              {task.category}
            </Text>
            <Text className='text-[10px] text-gray-300'>{task.time}</Text>
          </View>
          <Button
            shape="round"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            去公开
          </Button>
        </View>
      </View>
    )
  }

  // 公开状态
  if (task.status === 'public') {
    return (
      <View className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
        <View className='relative aspect-[3/4] bg-gray-100 overflow-hidden'>
          <Image
            src={task.imageUrl!}
            className='w-full h-full object-cover'
            mode='aspectFill'
          />
          <View className='absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md w-7 h-7 flex items-center justify-center rounded-full shadow-sm'>
            <Icon name='public' size={14} color='black' />
          </View>
        </View>
        <View className='p-3'>
          <View className='flex justify-between items-center mb-3'>
            <Text className='text-[10px] text-gray-500 font-medium bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded'>
              {task.category}
            </Text>
            <View className='flex items-center gap-0.5 text-gray-400'>
              <Icon name='favorite' size={12} color='#EC4899' filled />
              <Text className='text-[10px]'>{task.likes}</Text>
            </View>
          </View>
          <Button
            shape="round"
            variant="outlined"
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            查看详情
          </Button>
        </View>
      </View>
    )
  }

  // 失败状态
  if (task.status === 'failed') {
    return (
      <View className='bg-gray-50 rounded-2xl border border-dashed border-gray-300 overflow-hidden flex flex-col'>
        <View className='flex-1 flex flex-col items-center justify-center p-4 text-gray-400 min-h-[140px]'>
          <View className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2'>
            <Icon name='broken_image' size={20} color='#9CA3AF' />
          </View>
          <Text className='text-xs font-medium text-gray-500'>生成失败</Text>
          <Text className='text-[10px] text-gray-400 mt-1'>网络连接超时</Text>
        </View>
        <View className='p-3 bg-white border-t border-gray-100'>
          <Button
            shape="round"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            <View className="flex items-center justify-center gap-1.5">
              <Icon name='refresh' size={14} />
              <Text>重试</Text>
            </View>
          </Button>
        </View>
      </View>
    )
  }

  // 生成中状态
  if (task.status === 'processing') {
    return (
      <View className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        <View className='relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden'>
          <Image
            src={task.imageUrl!}
            className='w-full h-full opacity-20 grayscale blur-sm scale-110'
            mode='aspectFill'
          />
          <View className='absolute inset-0 flex flex-col items-center justify-center z-10'>
            <View className='w-8 h-8 border-[3px] border-black/10 border-t-black rounded-full animate-spin mb-3' />
            <Text className='text-[10px] text-white font-medium bg-black px-2.5 py-1 rounded-full'>
              生成中 {task.progress}%
            </Text>
          </View>
        </View>
        <View className='p-3'>
          <View className='h-4 w-16 bg-gray-100 rounded animate-pulse mb-3' />
          <View className='h-8 w-full bg-gray-100 rounded-xl animate-pulse' />
        </View>
      </View>
    )
  }

  return null
}
