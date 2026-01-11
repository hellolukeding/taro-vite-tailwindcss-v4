import { Text, View } from '@tarojs/components'
import React from 'react'

interface BottomTabBarProps {
  activeTab: number
  onTabChange: (tab: number) => void
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 0, name: '广场', icon: '🏠', activeColor: 'text-theme-primary', activeBg: 'bg-theme-primary/10' },
    { id: 1, name: '创建', icon: '✨', activeColor: 'text-theme-secondary', activeBg: 'bg-theme-secondary/10' },
    { id: 2, name: '我的', icon: '👤', activeColor: 'text-theme-tertiary', activeBg: 'bg-theme-tertiary/10' }
  ]

  return (
    <View className='w-full h-20 bg-white border-t border-gray-100 safe-area-bottom'>
      <View className='flex h-full items-center justify-around'>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <View
              key={tab.id}
              className={`flex-1 flex flex-col items-center justify-center transition-all duration-200 ${isActive ? tab.activeColor : 'text-gray-600'}`}
              onClick={() => onTabChange(tab.id)}
            >
              {/* 中间按钮特殊样式 */}
              {tab.id === 1 ? (
                <View
                  className={`-mt-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${isActive ? 'bg-theme-secondary text-white' : 'bg-theme-secondary/20 text-theme-secondary'
                    }`}
                >
                  <Text className='text-2xl font-bold'>{tab.icon}</Text>
                </View>
              ) : (
                <>
                  <View className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all duration-200 ${isActive ? tab.activeBg : 'bg-gray-50'
                    }`}
                  >
                    <Text className={`text-xl ${isActive ? '' : 'opacity-60'}`}>{tab.icon}</Text>
                  </View>
                  <Text className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                    {tab.name}
                  </Text>
                </>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default BottomTabBar
