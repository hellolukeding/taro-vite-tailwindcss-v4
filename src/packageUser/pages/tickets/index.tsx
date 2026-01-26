import { ticketsApi } from '@/api'
import type { Ticket } from '@/api/tickets'
import { TicketCard } from '@/components/business/TicketCard'
import CommonHeader from '@/components/CommonHeader'
import CommonWarp from '@/components/CommonWarp'
import { useAuth } from '@/hooks/useAuth'
import { Plus } from '@taroify/icons'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.scss'

interface TicketsProps { }

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' },
  { key: 'closed', label: '已关闭' },
] as const

const Tickets: React.FC<TicketsProps> = () => {
  const { requireLoginRedirect } = useAuth()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useDidShow(() => {
    requireLoginRedirect()
    loadTickets(true)
  })

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadTickets(true)
    Taro.stopPullDownRefresh()
  })

  // 触底加载更多
  useReachBottom(() => {
    if (hasMore && !loading) {
      loadTickets(false)
    }
  })

  // 加载工单列表
  const loadTickets = async (refresh: boolean = false) => {
    if (loading) return

    if (refresh) {
      setPage(1)
      setHasMore(true)
    }

    setLoading(true)
    try {
      const currentPage = refresh ? 1 : page
      const statusKey = TABS[activeTab].key
      const { total: newTotal, tickets: newTickets } = await ticketsApi.getTickets({
        status: statusKey === 'all' ? undefined : statusKey,
        page: currentPage,
        page_size: 20,
      })

      if (refresh) {
        setTickets(newTickets)
      } else {
        setTickets([...tickets, ...newTickets])
      }

      setTotal(newTotal)
      setHasMore(newTickets.length === 20)
      setPage(currentPage + 1)
    } catch (error) {
      console.error('加载工单列表失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 切换标签
  const handleTabChange = (index: number) => {
    if (activeTab === index) return
    setActiveTab(index)
    setPage(1)
  }

  // 监听标签变化，重新加载数据
  useEffect(() => {
    loadTickets(true)
  }, [activeTab])

  // 跳转到详情页
  const goToDetail = (ticketId: string) => {
    Taro.navigateTo({
      url: `/packageUser/pages/tickets/detail?id=${ticketId}`,
    })
  }

  // 跳转到创建页
  const goToCreate = () => {
    Taro.navigateTo({
      url: '/packageUser/pages/tickets/create',
    })
  }

  return (
    <CommonWarp title='我的工单' withHeader={false}>
      <View className='tickets-page'>
        {/* Header */}
        {/* <View className='bg-black pt-20 pb-8 px-4 rounded-b-4xl shadow-xl'>
          <View className='flex justify-between items-center mb-2'>
            <Text className='text-white text-2xl font-bold'>我的工单</Text>
            <Text className='text-gray-400 text-sm'>共 {total} 条</Text>
          </View>
        </View> */}

        <CommonHeader title='我的工单' withBack >

          {/* Tabs */}
          <View className='sticky top-0 z-50 bg-white border-b border-gray-100'>
            <View className='px-4 py-4'>
              <View className='flex p-1 w-full bg-gray-100 rounded-xl relative'>
                {TABS.map((tab, index) => {
                  return (
                    <View
                      key={tab.key}
                      className={`flex-1 py-2 text-sm font-bold text-center rounded-lg transition-colors ${activeTab === index ? 'text-white bg-black' : 'text-gray-500'
                        }`}
                      onClick={() => handleTabChange(index)}
                    >
                      <Text>{tab.label}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </CommonHeader>

        {/* Ticket List */}
        <ScrollView scrollY className='h-full pb-32' enhanced showScrollbar={false}>
          <View className='px-4 py-4 space-y-3'>
            {tickets.length === 0 && !loading ? (
              <View className='flex flex-col items-center justify-center py-16'>
                <Text className='text-6xl mb-4'>💬</Text>
                <Text className='text-gray-400 text-base mb-2'>暂无工单</Text>
                <Text className='text-gray-300 text-sm'>遇到问题可以随时提交工单</Text>
              </View>
            ) : (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.ticket_id}
                  ticket={ticket}
                  onClick={() => goToDetail(ticket.ticket_id)}
                />
              ))
            )}

            {/* Loading indicator */}
            {loading && tickets.length > 0 && (
              <View className='flex items-center justify-center py-4'>
                <Text className='text-gray-400 text-sm'>加载中...</Text>
              </View>
            )}

            {/* No more data */}
            {!hasMore && tickets.length > 0 && (
              <View className='flex items-center justify-center py-4'>
                <Text className='text-gray-300 text-sm'>没有更多了</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Create Button */}
        <View
          className='fixed bottom-24 right-4 w-14 h-14 bg-black rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50'
          onClick={goToCreate}
        >
          <Plus size={24} color='#fff' />
        </View>
      </View>
    </CommonWarp>
  )
}

export default Tickets
