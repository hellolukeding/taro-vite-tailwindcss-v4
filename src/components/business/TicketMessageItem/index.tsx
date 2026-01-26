import { View, Text, Image } from '@tarojs/components'
import type { TicketMessage } from '@/api/tickets'

interface TicketMessageItemProps {
  message: TicketMessage
}

export function TicketMessageItem({ message }: TicketMessageItemProps) {
  // 格式化时间
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return minutes === 0 ? '刚刚' : `${minutes}分钟前`
      }
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  const isUser = message.sender_type === 'user'

  return (
    <View className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <View className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-black' : 'bg-gray-200'
      }`}>
        <Text className={`text-xs font-bold ${isUser ? 'text-white' : 'text-gray-600'}`}>
          {message.sender_name?.[0] || (isUser ? '我' : '客')}
        </Text>
      </View>

      {/* Message Content */}
      <View className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender Name and Time */}
        <View className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <Text className='text-xs text-gray-400'>{formatTime(message.created_at)}</Text>
          <Text className='text-xs font-medium text-gray-600'>
            {message.sender_name || (isUser ? '我' : '客服')}
          </Text>
        </View>

        {/* Content Bubble */}
        {message.content && (
          <View className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
            isUser
              ? 'bg-black text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}>
            <Text className='text-sm leading-relaxed whitespace-pre-wrap'>
              {message.content}
            </Text>
          </View>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <View className='flex flex-wrap gap-2 mt-2'>
            {message.attachments.map((url, index) => (
              <Image
                key={index}
                src={url}
                className='w-24 h-24 rounded-lg'
                mode='aspectFill'
                lazyLoad
              />
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
