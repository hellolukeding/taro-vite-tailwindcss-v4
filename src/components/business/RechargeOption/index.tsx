import { Text, View } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface RechargeOptionProps {
  credits: number
  price: number
  originalPrice?: number
  isHot?: boolean
  isSelected: boolean
  onSelect: () => void
}

const RechargeOption: React.FC<RechargeOptionProps> = ({
  credits,
  price,
  originalPrice,
  isHot,
  isSelected,
  onSelect
}) => {
  return (
    <View
      onClick={onSelect}
      className={`recharge-option ${isSelected ? 'selected' : ''}`}
    >
      {/* HOT Badge */}
      {isHot && (
        <View className='hot-badge'>
          <Text className='hot-text'>热销 HOT</Text>
        </View>
      )}

      {/* Credits */}
      <Text className={`credits ${isSelected ? 'credits-selected' : ''}`}>
        {credits} 积分
      </Text>

      {/* Price */}
      <Text className={`price ${isSelected ? 'price-selected' : ''}`}>
        ¥{price}
      </Text>

      {/* Original Price (if discounted) */}
      {originalPrice && (
        <Text className='original-price'>¥{originalPrice}</Text>
      )}
    </View>
  )
}

export default RechargeOption
