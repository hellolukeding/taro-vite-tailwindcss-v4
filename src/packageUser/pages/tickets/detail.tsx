import { ticketsApi } from '@/api'
import CommonWarp from '@/components/CommonWarp'
import { useAuth } from '@/hooks/useAuth'
import { TicketMessageItem } from '@/components/business/TicketMessageItem'
import { TicketStatusBadge } from '@/components/business/TicketStatusBadge'
import { TicketPriorityBadge } from '@/components/business/TicketPriorityBadge'
import type { TicketDetail as TicketDetailType } from '@/api/tickets'
import { ArrowLeft, Share } from '@taroify/icons'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
import './detail.scss'

interface DetailProps {}

const TicketDetail: React.FC<DetailProps> = () => {
  const { requireLoginRedirect } = useAuth()
  const router = useRouter()
  const { id: ticketId } = router.params

  const [detail, setDetail] = useState<TicketDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const scrollViewRef = useRef<any>(null)

  useDidShow(() => {
    requireLoginRedirect()
    if (ticketId) {
      loadTicketDetail()
    }
  })

  useEffect(() => {
    if (detail && detail.messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ top: 99999, animated: true })
      }, 100)
    }
  }, [detail])

  // 加载工单详情
  const loadTicketDetail = async () => {
    if (!ticketId) return

    setLoading(true)
    try {
      const data = await ticketsApi.getTicketDetail(ticketId)
      setDetail(data)
    } catch (error) {
      console.error('加载工单详情失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 发送消息
  const handleSend = async () => {
    if (!message.trim()) {
      Taro.showToast({ title: '请输入消息内容', icon: 'none' })
      return
    }

    if (!ticketId) return

    setSending(true)
    try {
      await ticketsApi.sendMessage(ticketId, {
        content: message.trim(),
        is_internal: false,
      })

      setMessage('')
      await loadTicketDetail()
    } catch (error) {
      console.error('发送消息失败:', error)
      Taro.showToast({ title: '发送失败', icon: 'none' })
    } finally {
      setSending(false)
    }
  }

  // 格式化时间
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading || !detail) {
    return (
      <CommonWarp>
        <View className='ticket-detail-page'>
          <View className='flex items-center justify-center h-screen'>
            <Text className='text-gray-400'>加载中...</Text>
          </View>
        </View>
      </CommonWarp>
    )
  }

  const { ticket } = detail

  return (
    <CommonWarp withHeader={false}>
      <View className='ticket-detail-page'>
        {/* Header */}
        <View className='bg-black pt-20 pb-8 px-4 rounded-b-4xl shadow-xl'>
          <View className='flex items-center gap-3 mb-4'>
            <View
              className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center'
              onClick={() => Taro.navigateBack()}
            >
              <ArrowLeft size={20} color='#fff' />
            </View>
            <Text className='text-white text-xl font-bold'>工单详情</Text>
          </View>

          {/* Ticket ID */}
          <View className='ml-11 mb-3'>
            <Text className='text-gray-400 text-xs'>工单编号</Text>
            <Text className='text-white text-sm font-mono'>{ticket.ticket_id}</Text>
          </View>

          {/* Title and Status */}
          <View className='ml-11'>
            <Text className='text-white text-lg font-semibold mb-2 block'>{ticket.title}</Text>
            <View className='flex items-center gap-2'>
              <TicketStatusBadge status={ticket.status as any} />
              <TicketPriorityBadge priority={ticket.priority as any} />
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView scrollY className='h-full pb-32' ref={scrollViewRef} enhanced showScrollbar={false}>
          <View className='px-4 py-4 space-y-4'>
            {/* Ticket Info Card */}
            <View className='bg-white p-4 rounded-2xl shadow-sm'>
              <View className='space-y-3'>
                <View className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <Text className='text-sm text-gray-500'>工单类型</Text>
                  <Text className='text-sm font-medium text-black'>{ticket.type}</Text>
                </View>

                {ticket.related_order_id && (
                  <View className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <Text className='text-sm text-gray-500'>关联订单</Text>
                    <Text className='text-sm font-medium text-black'>{ticket.related_order_id}</Text>
                  </View>
                )}

                {ticket.related_task_id && (
                  <View className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <Text className='text-sm text-gray-500'>关联任务</Text>
                    <Text className='text-sm font-medium text-black'>{ticket.related_task_id}</Text>
                  </View>
                )}

                <View className='flex justify-between items-center'>
                  <Text className='text-sm text-gray-500'>创建时间</Text>
                  <Text className='text-sm font-medium text-black'>{formatTime(ticket.created_at)}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className='bg-white p-4 rounded-2xl shadow-sm'>
              <Text className='text-sm font-bold text-black mb-2 block'>问题描述</Text>
              <Text className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>
                {ticket.description}
              </Text>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <View className='mt-3'>
                  <Text className='text-xs font-medium text-gray-500 mb-2 block'>附件截图</Text>
                  <View className='flex flex-wrap gap-2'>
                    {ticket.attachments.map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        className='w-24 h-24 rounded-lg'
                        mode='aspectFill'
                        lazyLoad
                        onClick={() => {
                          Taro.previewImage({
                            current: url,
                            urls: ticket.attachments || []
                          })
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Messages */}
            <View className='bg-white p-4 rounded-2xl shadow-sm'>
              <Text className='text-sm font-bold text-black mb-4 block'>消息记录</Text>

              {detail.messages.length === 0 ? (
                <View className='text-center py-8'>
                  <Text className='text-gray-400 text-sm'>暂无消息</Text>
                </View>
              ) : (
                <View className='space-y-2'>
                  {detail.messages.map((msg) => (
                    <TicketMessageItem key={msg.id} message={msg} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        {ticket.status !== 'closed' && (
          <View className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-bottom'>
            <View className='flex items-center gap-3'>
              <Input
                className='flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm'
                placeholder='输入消息...'
                value={message}
                onInput={(e) => setMessage(e.detail.value)}
                confirmType='send'
                onConfirm={handleSend}
              />
              <View
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  message.trim() ? 'bg-black' : 'bg-gray-200'
                }`}
                onClick={handleSend}
              >
                <Share size={18} color={message.trim() ? '#fff' : '#9CA3AF'} />
              </View>
            </View>
          </View>
        )}
      </View>
    </CommonWarp>
  )
}

export default TicketDetail
