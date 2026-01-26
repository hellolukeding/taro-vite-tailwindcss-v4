import { Clock, ChatOutlined, Arrow } from '@taroify/icons'
import { Text, View } from '@tarojs/components'
import { TicketStatusBadge } from '../TicketStatusBadge'
import { TicketPriorityBadge } from '../TicketPriorityBadge'
import type { Ticket } from '@/api/tickets'

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
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

  return (
    <View
      className='flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm active:bg-gray-50 transition-colors'
      onClick={onClick}
    >
      {/* Header: Title and Status */}
      <View className='flex justify-between items-start gap-2'>
        <Text className='flex-1 text-base font-bold text-black leading-tight' numberOfLines={2}>
          {ticket.title}
        </Text>
        <TicketStatusBadge status={ticket.status as any} />
      </View>

      {/* Description */}
      <Text className='text-sm text-gray-500 leading-relaxed' numberOfLines={2}>
        {ticket.description}
      </Text>

      {/* Footer: Priority, Time, Unread */}
      <View className='flex items-center justify-between gap-2'>
        <View className='flex items-center gap-2'>
          <TicketPriorityBadge priority={ticket.priority as any} />
        </View>

        <View className='flex items-center gap-3'>
          {/* Time */}
          <View className='flex items-center gap-1'>
            <Clock size={14} color='#9CA3AF' />
            <Text className='text-xs text-gray-400'>{formatTime(ticket.created_at)}</Text>
          </View>

          {/* Unread Badge */}
          {ticket.unread_count > 0 && (
            <View className='flex items-center gap-1'>
              <ChatOutlined size={14} color='#3B82F6' />
              <Text className='text-xs font-medium text-blue-500'>
                {ticket.unread_count > 99 ? '99+' : ticket.unread_count}
              </Text>
            </View>
          )}

          {/* Arrow */}
          <Arrow size={16} color='#D1D5DB' />
        </View>
      </View>
    </View>
  )
}
