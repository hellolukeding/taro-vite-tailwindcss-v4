import { View, Text } from '@tarojs/components'

interface TicketStatusBadgeProps {
  status: 'pending' | 'processing' | 'resolved' | 'closed'
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusConfig = {
    pending: {
      text: '待处理',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      dotColor: 'bg-orange-500'
    },
    processing: {
      text: '处理中',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      dotColor: 'bg-blue-500'
    },
    resolved: {
      text: '已解决',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      dotColor: 'bg-green-500'
    },
    closed: {
      text: '已关闭',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      dotColor: 'bg-gray-400'
    }
  }

  const config = statusConfig[status]

  return (
    <View className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor}`}>
      <View className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <Text className={`text-xs font-medium ${config.textColor}`}>
        {config.text}
      </Text>
    </View>
  )
}
