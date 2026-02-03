import { paymentApi } from "@/api"
import CommonWarp from "@/components/CommonWarp"
import { useAuth } from "@/hooks/useAuth"
import { formatRelativeTime } from "@/utils/timeFormat"
import { Cell, Tabs } from "@taroify/core"
import { AddOutlined, Description, Minus } from "@taroify/icons"
import { ScrollView, Text, View } from "@tarojs/components"
import Taro, { usePullDownRefresh, useReachBottom } from "@tarojs/taro"
import { useCallback, useEffect, useState } from "react"

interface OrderProps { }

type TabType = "all" | "recharge" | "consume"

const Orders: React.FC<OrderProps> = () => {
  const { requireLoginRedirect } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    requireLoginRedirect()
  }, [])

  // 加载订单列表
  const loadOrders = useCallback(async (loadMore = false) => {
    if (loading) return

    setLoading(true)
    try {
      const currentPage = loadMore ? page + 1 : 1
      const result = await paymentApi.getOrders({
        page: currentPage,
        page_size: 20,
        type: activeTab === 'all' ? undefined : activeTab
      })

      if (loadMore) {
        setOrders(prev => [...prev, ...result.items])
        setPage(currentPage)
      } else {
        setOrders(result.items)
        setPage(1)
      }

      setHasMore(result.has_more)
    } catch (error: any) {
      console.error("Load orders error:", error)
      // 提取详细的错误信息
      let errorMsg = "加载失败"
      if (error?.message && typeof error.message === 'string') {
        errorMsg = error.message
      } else if (error?.errMsg && typeof error.errMsg === 'string') {
        errorMsg = error.errMsg
      } else if (typeof error === 'string') {
        errorMsg = error
      } else {
        // 最后的保险措施：确保总是字符串
        errorMsg = String(errorMsg)
      }
      Taro.showToast({ title: errorMsg, icon: "none" })
    } finally {
      setLoading(false)
    }
  }, [activeTab, loading, page])

  // 切换标签时重新加载
  useEffect(() => {
    loadOrders(false)
  }, [activeTab])

  // 下拉刷新
  usePullDownRefresh(() => {
    loadOrders(false).then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  // 上拉加载更多
  useReachBottom(() => {
    if (hasMore && !loading) {
      loadOrders(true)
    }
  })

  // 格式化金额显示
  const formatAmount = (amount: number, type: string) => {
    const isRecharge = type === 'recharge'
    return `${isRecharge ? '+' : ''}${Math.abs(amount)}`
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '进行中',
      paid: '已支付',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消',
      Success: '成功',
      Pending: '进行中',
      Failed: '失败'
    }
    return statusMap[status] || status
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#f59e0b',
      paid: '#10b981',
      completed: '#10b981',
      failed: '#ef4444',
      cancelled: '#9ca3af',
      Success: '#10b981',
      Pending: '#f59e0b',
      Failed: '#ef4444'
    }
    return colorMap[status] || '#6b7280'
  }

  // 获取详细描述
  const getDetailDescription = (item: any) => {
    if (item.type === 'recharge') {
      const parts = []
      if (item.credits) parts.push(`${item.credits} 积分`)
      if (item.bonus > 0) parts.push(`赠送 ${item.bonus} 积分`)
      if (item.is_vip && item.vip_days > 0) parts.push(`${item.vip_days}天VIP`)
      if (item.amount_rmb) parts.push(`¥${item.amount_rmb}`)
      return parts.join(' + ')
    } else {
      return item.description
    }
  }

  return (
    <CommonWarp title="订单记录" withHeader>
      {/* 标签栏 */}
      <View className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <Tabs
          value={activeTab}
          onChange={(tab: any) => setActiveTab(tab)}
          className="w-full"
        >
          <Tabs.TabPane value="all" title="全部" />
          <Tabs.TabPane value="recharge" title="充值" />
          <Tabs.TabPane value="consume" title="消费" />
        </Tabs>
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="h-[calc(100vh-100px)] bg-gray-50">
        <View className="px-4">
          {orders.length === 0 && !loading ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Description size={48} color="#d1d5db" />
              <Text className="mt-4 text-base text-gray-400">暂无订单记录</Text>
            </View>
          ) : (
            <View>
              {orders.map((order) => (
                <View
                  key={order.id}
                  className="bg-white my-3 rounded-xl p-4 shadow-sm w-full"
                  onClick={() => {
                    // 可以添加点击查看详情的功能
                  }}
                >
                  <View className="flex justify-between items-center mb-3">
                    <View className="flex items-center gap-2 flex-1 min-w-0">
                      {order.type === 'recharge' ? (
                        <AddOutlined size={20} color="#10b981" />
                      ) : (
                        <Minus size={20} color="#f59e0b" />
                      )}
                      <Text className="text-base font-semibold text-gray-800 flex-1 truncate">
                        {order.type === 'recharge' ? (order.package_name || '充值') : order.description}
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-medium ml-2 flex-shrink-0"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </Text>
                  </View>

                  <View className="flex justify-between items-center mb-2">
                    <Text
                      className={`text-xl font-bold flex-shrink-0 ${order.type === 'recharge' ? 'text-green-500' : 'text-amber-500'}`}
                    >
                      {formatAmount(order.amount, order.type)} 积分
                    </Text>
                    <Text className="text-sm text-gray-400 flex-shrink-0">
                      {formatRelativeTime(order.created_at)}
                    </Text>
                  </View>

                  {/* 详细信息 */}
                  {(order.type === 'recharge' && (order.bonus > 0 || order.is_vip)) ||
                   (order.type === 'consume' && order.task_info) ? (
                    <View className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                      {order.type === 'recharge' && (
                        <>
                          {order.bonus > 0 && (
                            <Text className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full flex-shrink">
                              赠送 {order.bonus} 积分
                            </Text>
                          )}
                          {order.is_vip && order.vip_days > 0 && (
                            <Text className="text-xs px-2.5 py-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white rounded-full flex-shrink">
                              VIP {order.vip_days} 天
                            </Text>
                          )}
                          {order.amount_rmb && (
                            <Text className="text-sm font-semibold text-amber-500 ml-auto flex-shrink-0">
                              ¥{order.amount_rmb}
                            </Text>
                          )}
                        </>
                      )}
                      {order.type === 'consume' && order.task_info && (
                        <Text className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full flex-shrink">
                          任务ID: {order.task_info.task_id?.substring(0, 8)}...
                        </Text>
                      )}
                    </View>
                  ) : null}

                  {order.balance_after !== undefined && (
                    <View className="mt-2 pt-2 border-t border-gray-100">
                      <Text className="text-sm text-gray-600 flex-shrink">
                        余额: {order.balance_after} 积分
                      </Text>
                      {order.type === 'recharge' && order.paid_at && (
                        <Text className="text-xs text-gray-400 flex-shrink">
                          支付于 {formatRelativeTime(order.paid_at)}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {loading && (
          <View className="flex justify-center py-5 text-sm text-gray-400">
            <Text>加载中...</Text>
          </View>
        )}

        {!hasMore && orders.length > 0 && (
          <View className="flex justify-center py-5 text-sm text-gray-400">
            <Text>没有更多了</Text>
          </View>
        )}
      </ScrollView>
    </CommonWarp>
  )
}

export default Orders

