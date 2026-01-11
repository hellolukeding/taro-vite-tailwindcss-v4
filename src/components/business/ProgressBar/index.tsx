import { Text, View } from '@tarojs/components'
import React from 'react'
import './index.css'

interface ProgressBarProps {
  progress: number
  message?: string
  color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  message,
  color = '#3b82f6'
}) => {
  return (
    <View className='progress-bar-container'>
      <View className='progress-bar'>
        <View
          className='progress-fill'
          style={{
            width: `${progress}%`,
            backgroundColor: color
          }}
        />
      </View>
      <View className='progress-info'>
        <Text className='progress-percent'>{progress}%</Text>
        {message && (
          <Text className='progress-message'>{message}</Text>
        )}
      </View>
    </View>
  )
}

export default ProgressBar
