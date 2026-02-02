import { paymentApi } from "@/api"
import CommonWarp from "@/components/CommonWarp"
import { useAuth } from "@/hooks/useAuth"
import { Cell, Tabs } from "@taroify/core"
import { ArrowDown, Description, AddOutlined, Minus } from "@taroify/icons"
import { ScrollView, Text, View } from "@tarojs/components"
import Taro, { usePullDownRefresh, useReachBottom } from "@tarojs/taro"
import { useCallback, useEffect, useState } from "react"
import { formatRelativeTime } from "@/utils/timeFormat"
import "./index.scss"

interface OrderProps {}

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
    } catch (error) {
      console.error("Load orders error:", error)
      Taro.showToast({ title: "加载失败", icon: "none" })
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
      <View className="orders-tabs">
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
      <ScrollView scrollY className="orders-list">
        {orders.length === 0 && !loading ? (
          <View className="empty-state">
            <Description size={48} color="#d1d5db" />
            <Text className="empty-text">暂无订单记录</Text>
          </View>
        ) : (
          <Cell.Group inset={false}>
            {orders.map((order) => (
              <Cell
                key={order.id}
                className="order-cell"
                onClick={() => {
                  // 可以添加点击查看详情的功能
                }}
              >
                <View className="order-item">
                  <View className="order-header">
                    <View className="order-type">
                      {order.type === 'recharge' ? (
                        <AddOutlined size={20} color="#10b981" />
                      ) : (
                        <Minus size={20} color="#f59e0b" />
                      )}
                      <Text className="order-type-text">
                        {order.type === 'recharge' ? (order.package_name || '充值') : order.description}
                      </Text>
                    </View>
                    <Text
                      className="order-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </Text>
                  </View>

                  <View className="order-body">
                    <Text
                      className={`order-amount ${order.type === 'recharge' ? 'amount-positive' : 'amount-negative'}`}
                    >
                      {formatAmount(order.amount, order.type)} 积分
                    </Text>
                    <Text className="order-time">
                      {formatRelativeTime(order.created_at)}
                    </Text>
                  </View>

                  {/* 详细信息 */}
                  {(order.type === 'recharge' && (order.bonus > 0 || order.is_vip)) ||
                   (order.type === 'consume' && order.task_info) ? (
                    <View className="order-details">
                      {order.type === 'recharge' && (
                        <>
                          {order.bonus > 0 && (
                            <Text className="detail-tag">赠送 {order.bonus} 积分</Text>
                          )}
                          {order.is_vip && order.vip_days > 0 && (
                            <Text className="detail-tag vip">VIP {order.vip_days} 天</Text>
                          )}
                          {order.amount_rmb && (
                            <Text className="detail-price">¥{order.amount_rmb}</Text>
                          )}
                        </>
                      )}
                      {order.type === 'consume' && order.task_info && (
                        <Text className="detail-tag">任务ID: {order.task_info.task_id?.substring(0, 8)}...</Text>
                      )}
                    </View>
                  ) : null}

                  {order.balance_after !== undefined && (
                    <View className="order-footer">
                      <Text className="order-balance">
                        余额: {order.balance_after} 积分
                      </Text>
                      {order.type === 'recharge' && order.paid_at && (
                        <Text className="order-paid-time">
                          支付于 {formatRelativeTime(order.paid_at)}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </Cell>
            ))}
          </Cell.Group>
        )}

        {loading && (
          <View className="loading-more">
            <Text>加载中...</Text>
          </View>
        )}

        {!hasMore && orders.length > 0 && (
          <View className="no-more">
            <Text>没有更多了</Text>
          </View>
        )}
      </ScrollView>
    </CommonWarp>
  )
}

export default Orders
