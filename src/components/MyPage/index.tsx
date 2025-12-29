import { Text, View } from '@tarojs/components'
import React from 'react'

const MyPage: React.FC = () => {
  return (
    <View className='flex-1 bg-gray-50'>
      {/* 个人资料 */}
      <View className='bg-white p-6 border-b border-gray-100'>
        <View className='flex items-center'>
          <View className='w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4'>
            我
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-bold text-gray-800'>我的账号</Text>
            <Text className='text-sm text-gray-500'>ID: 123456</Text>
          </View>
          <View className='px-4 py-2 border border-gray-300 rounded-full'>
            <Text className='text-sm text-gray-600'>编辑资料</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className='mt-4 bg-white rounded-xl mx-4 overflow-hidden'>
        <View className='border-b border-gray-100 p-4 flex items-center justify-between'>
          <Text className='text-gray-800 font-medium'>我的收藏</Text>
          <Text className='text-gray-400'>→</Text>
        </View>
        <View className='border-b border-gray-100 p-4 flex items-center justify-between'>
          <Text className='text-gray-800 font-medium'>创建历史</Text>
          <Text className='text-gray-400'>→</Text>
        </View>
        <View className='border-b border-gray-100 p-4 flex items-center justify-between'>
          <Text className='text-gray-800 font-medium'>我的模板</Text>
          <Text className='text-gray-400'>→</Text>
        </View>
        <View className='p-4 flex items-center justify-between'>
          <Text className='text-gray-800 font-medium'>设置</Text>
          <Text className='text-gray-400'>→</Text>
        </View>
      </View>

      {/* 统计信息 */}
      <View className='mt-4 bg-white rounded-xl mx-4 p-4'>
        <Text className='text-gray-800 font-bold mb-3 block'>我的数据</Text>
        <View className='flex justify-between'>
          <View className='text-center flex-1'>
            <Text className='text-xl font-bold text-theme-primary'>128</Text>
            <Text className='text-xs text-gray-500 mt-1'>收藏</Text>
          </View>
          <View className='text-center flex-1'>
            <Text className='text-xl font-bold text-theme-secondary'>45</Text>
            <Text className='text-xs text-gray-500 mt-1'>创建</Text>
          </View>
          <View className='text-center flex-1'>
            <Text className='text-xl font-bold text-theme-tertiary'>89</Text>
            <Text className='text-xs text-gray-500 mt-1'>使用</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default MyPage
