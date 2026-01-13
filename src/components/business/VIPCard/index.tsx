import { Icon } from '@/components/common/Icon'
import { Text, View } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface VIPCardProps {
  price: number
  originalPrice: number
  benefits: string[]
  onActivate: () => void
}

const VIPCard: React.FC<VIPCardProps> = ({ price, originalPrice, benefits, onActivate }) => {
  return (
    <View className='vip-card'>
      {/* Background gradient overlay */}
      <View className='vip-card-bg' />

      {/* Content */}
      <View className='vip-card-content'>
        {/* Header */}
        <View className='vip-header'>
          <View>
            <Text className='vip-title'>VIP 会员权益</Text>
            <Text className='vip-subtitle'>尊享 8 项特权，创作快人一步</Text>
          </View>
          <View className='vip-badge'>
            <Text className='vip-badge-text'>PRO</Text>
          </View>
        </View>

        {/* Benefits List */}
        <View className='vip-benefits'>
          {benefits.map((benefit, index) => (
            <View key={index} className='benefit-item'>
              <View className={`benefit-icon benefit-icon-${index}`}>
                <Icon name={index === 0 ? 'payments' : index === 1 ? 'auto_awesome' : 'speed'} size={12} />
              </View>
              <Text className='benefit-text'>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Activate Button */}
        <View className='vip-action' onClick={onActivate}>
          <Text className='vip-action-text'>立即开通</Text>
          <View className='vip-action-price'>
            <Text className='vip-action-original'>¥{originalPrice}</Text>
            <Text className='vip-action-current'>¥{price}/月</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default VIPCard
