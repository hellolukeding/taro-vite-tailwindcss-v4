import { Text, View } from '@tarojs/components'
import React from 'react'

const AddPage: React.FC = () => {
  return (
    <View className='flex-1 bg-gray-50 flex items-center justify-center'>
      <View className='bg-white p-8 rounded-2xl shadow-lg text-center'>
        <View className='w-20 h-20 bg-theme-primary rounded-full flex items-center justify-center mx-auto mb-4'>
          <Text className='text-white text-4xl'>+</Text>
        </View>
        <Text className='text-lg font-bold text-gray-800 mb-2'>创建新提示词</Text>
        <Text className='text-gray-500 text-sm mb-6'>打造属于你的专属提示词模板</Text>
        <View className='px-6 py-3 bg-theme-primary rounded-full'>
          <Text className='text-white font-medium'>开始创作</Text>
        </View>
      </View>
    </View>
  )
}

export default AddPage
