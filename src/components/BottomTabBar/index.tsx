import { AddOutlined, HomeOutlined, ManagerOutlined } from '@taroify/icons'
import { Text, View } from '@tarojs/components'
import React from 'react'

interface BottomTabBarProps {
  activeTab: number
  onTabChange: (tab: number) => void
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className='w-full h-20 bg-white border-t border-gray-100'>
      <View className='flex h-full items-center justify-around'>
        <View
          className={`flex-1 flex flex-col items-center justify-center ${activeTab === 0 ? 'text-theme-primary' : 'text-gray-600'}`}
          onClick={() => onTabChange(0)}
        >
          <View className='mb-1'>
            <HomeOutlined size={20} />
          </View>
          <Text className='text-xs font-medium'>广场</Text>
        </View>
        <View
          className='flex-1 flex flex-col items-center justify-center -mt-6'
          onClick={() => onTabChange(1)}
        >
          <View className={`px-5 py-3 rounded-xl flex items-center justify-center shadow-lg ${activeTab === 1 ? 'bg-theme-primary' : 'bg-theme-secondary'}`}>
            <AddOutlined size={24} color='white' />
          </View>
        </View>
        <View
          className={`flex-1 flex flex-col items-center justify-center ${activeTab === 2 ? 'text-theme-tertiary' : 'text-gray-600'}`}
          onClick={() => onTabChange(2)}
        >
          <View className='mb-1'>
            <ManagerOutlined size={20} />
          </View>
          <Text className='text-xs font-medium'>我的</Text>
        </View>
      </View>
    </View>
  )
}

export default BottomTabBar
