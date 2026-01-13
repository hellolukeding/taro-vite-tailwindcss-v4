import { ScrollView, Text, View } from '@tarojs/components'
import { useState } from 'react'
import CommonWarp from '@/components/CommonWarp'
import { Icon } from '@/components/common/Icon'
import RechargeOption from '@/components/business/RechargeOption'
import VIPCard from '@/components/business/VIPCard'
import PaymentBar from '@/components/business/PaymentBar'
import { paymentApi } from '@/api/payment'
import Taro from '@tarojs/taro'
import './index.scss'

interface RechargePackage {
  id: string
  credits: number
  price: number
  originalPrice?: number
  isHot?: boolean
}

const Recharge: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('500')
  const [balance, setBalance] = useState(1250)
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Mock data - replace with API call
  const packages: RechargePackage[] = [
    { id: '100', credits: 100, price: 9.9 },
    { id: '500', credits: 500, price: 39.9, originalPrice: 49.9, isHot: true },
    { id: '1000', credits: 1000, price: 69.9 }
  ]

  const vipBenefits = [
    '每日免费领 20 积分',
    '专属高级模型使用权',
    '无限速生图，排队优先'
  ]

  const selectedPrice = packages.find((p) => p.id === selectedPackage)?.price || 0

  const handlePayment = async () => {
    if (!agreedToTerms) {
      Taro.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      })
      return
    }

    try {
      setLoading(true)

      // Create order via API
      const order = await paymentApi.createOrder({
        package_id: selectedPackage,
        quantity: 1
      })

      // Call WeChat pay
      await Taro.requestPayment({
        ...order.payment_params,
        success: () => {
          Taro.showToast({
            title: '充值成功',
            icon: 'success'
          })
          // Navigate back or refresh
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        },
        fail: (err) => {
          if (err.errMsg.includes('cancel')) {
            Taro.showToast({
              title: '已取消支付',
              icon: 'none'
            })
          } else {
            Taro.showToast({
              title: '支付失败',
              icon: 'error'
            })
          }
        }
      })
    } catch (error) {
      console.error('Payment error:', error)
      Taro.showToast({
        title: '创建订单失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVIPActivate = () => {
    Taro.showToast({
      title: 'VIP功能即将上线',
      icon: 'none'
    })
  }

  return (
    <CommonWarp title='积分充值' withHeader={false}>
      <View className='recharge-page'>
        {/* Header */}
        <View className='recharge-header'>
          <View
            onClick={() => Taro.navigateBack()}
            className='header-icon'
          >
            <Icon name='arrow_back_ios' size={20} />
          </View>
          <Text className='header-title'>积分充值</Text>
          <View
            onClick={() => {
              // Refresh balance
              Taro.showToast({ title: '刷新成功', icon: 'success' })
            }}
            className='header-icon'
          >
            <Icon name='refresh' size={20} />
          </View>
        </View>

        <ScrollView scrollY className='recharge-content'>
          {/* Balance Card */}
          <View className='balance-card'>
            {/* Background decoration */}
            <View className='balance-card-bg'>
              <View className='balance-glow balance-glow-1' />
              <View className='balance-glow balance-glow-2' />
            </View>

            <View className='balance-card-content'>
              <View className='balance-info'>
                <View className='balance-label'>
                  <Icon name='bolt' size={16} color='#FBBF24' />
                  <Text className='balance-label-text'>当前积分</Text>
                </View>
                <Text className='balance-amount'>{balance.toLocaleString()}</Text>
              </View>

              {/* Stats */}
              <View className='balance-stats'>
                <View className='balance-stat-item'>
                  <Text className='balance-stat-label'>获赞</Text>
                  <Text className='balance-stat-value'>128</Text>
                </View>
                <View className='balance-stat-item'>
                  <Text className='balance-stat-label'>收藏</Text>
                  <Text className='balance-stat-value'>56</Text>
                </View>
                <View className='balance-stat-item'>
                  <Text className='balance-stat-label'>累计创作</Text>
                  <Text className='balance-stat-value'>
                    24<Text className='balance-stat-unit'>张</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recharge Options */}
          <View className='recharge-section'>
            <View className='recharge-section-header'>
              <Text className='section-title'>选择充值套餐</Text>
            </View>
            <View className='recharge-options'>
              {packages.map((pkg) => (
                <RechargeOption
                  key={pkg.id}
                  credits={pkg.credits}
                  price={pkg.price}
                  originalPrice={pkg.originalPrice}
                  isHot={pkg.isHot}
                  isSelected={selectedPackage === pkg.id}
                  onSelect={() => setSelectedPackage(pkg.id)}
                />
              ))}
            </View>
          </View>

          {/* VIP Card */}
          <View className='recharge-section'>
            <VIPCard
              price={29.9}
              originalPrice={49.9}
              benefits={vipBenefits}
              onActivate={handleVIPActivate}
            />
          </View>

          {/* Coupon/Redeem Code */}
          <View className='recharge-section'>
            <View className='redeem-code'>
              <Text className='redeem-text'>兑换码/优惠券</Text>
              <Icon name='chevron_right' size={18} color='#9CA3AF' />
            </View>
          </View>

          {/* Terms Checkbox */}
          <View className='recharge-section'>
            <View className='terms-checkbox'>
              <View
                className={`checkbox ${agreedToTerms ? 'checkbox-checked' : ''}`}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
              >
                {agreedToTerms && <Icon name='check' size={12} />}
              </View>
              <Text className='terms-text'>
                我已阅读并同意
                <Text className='terms-link'>《用户服务协议》</Text>
                和
                <Text className='terms-link'>《隐私政策》</Text>
              </Text>
            </View>
          </View>

          {/* Bottom Spacer for Payment Bar */}
          <View style={{ height: '100px' }} />
        </ScrollView>

        {/* Payment Bar */}
        <PaymentBar amount={selectedPrice} onPayment={handlePayment} loading={loading} />
      </View>
    </CommonWarp>
  )
}

export default Recharge
