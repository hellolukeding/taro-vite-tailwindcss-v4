import { Icon } from '@/components/common/Icon'
import { Text, View } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface PaymentBarProps {
  amount: number
  onPayment: () => void
  loading?: boolean
}

const PaymentBar: React.FC<PaymentBarProps> = ({ amount, onPayment, loading = false }) => {
  return (
    <View className='payment-bar'>
      {/* Amount Display */}
      <View className='payment-amount'>
        <Text className='payment-label'>应付金额</Text>
        <Text className='payment-price'>¥{amount.toFixed(1)}</Text>
      </View>

      {/* Pay Button */}
      <View className='payment-button' onClick={onPayment}>
        {loading ? (
          <Text className='payment-button-text'>处理中...</Text>
        ) : (
          <>
            <Text className='payment-button-text'>立即支付</Text>
            <Icon name='arrow_forward' size={16} />
          </>
        )}
      </View>
    </View>
  )
}

export default PaymentBar
