import { Button } from '@taroify/core'
import { Arrow } from '@taroify/icons'
import { Text, View } from '@tarojs/components'
import './index.scss'

interface EmptyStateProps {
  type: 'assets' | 'profile'
  onLogin?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onLogin }) => {
  const config = {
    assets: {
      icon: '📦',
      title: '暂无资产',
      description: '登录后查看您的创作资产'
    },
    profile: {
      icon: '👤',
      title: '未登录',
      description: '登录后查看个人信息'
    }
  }

  const current = config[type]

  return (
    <View className='empty-state-container'>
      <View className='empty-state-content'>
        <Text className='empty-state-icon'>{current.icon}</Text>
        <Text className='empty-state-title'>{current.title}</Text>
        <Text className='empty-state-description'>{current.description}</Text>

        <Button
          className='empty-state-button'
          style={{
            background: "#000",
            color: "#fff"
          }}
          color='primary'
          icon={<Arrow />}
          onClick={onLogin}
        >
          去登录
        </Button>
      </View>
    </View>
  )
}
