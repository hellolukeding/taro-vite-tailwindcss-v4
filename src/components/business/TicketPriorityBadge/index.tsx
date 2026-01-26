import { View, Text } from '@tarojs/components'

interface TicketPriorityBadgeProps {
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5'
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const priorityConfig = {
    P1: {
      text: 'P1 紧急',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50'
    },
    P2: {
      text: 'P2 高',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50'
    },
    P3: {
      text: 'P3 中',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50'
    },
    P4: {
      text: 'P4 低',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50'
    },
    P5: {
      text: 'P5 极低',
      textColor: 'text-gray-500',
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-50'
    }
  }

  const config = priorityConfig[priority]

  return (
    <View className={`inline-flex items-center px-2 py-0.5 rounded border ${config.borderColor} ${config.bgColor}`}>
      <Text className={`text-xs font-bold ${config.textColor}`}>
        {config.text}
      </Text>
    </View>
  )
}
