import { ExpandOutlined } from '@taroify/icons'
import { Input, Text, View } from '@tarojs/components'
import { FC } from 'react'
import './index.scss'

interface SearchBarProps {
  value: string
  onOpenFullscreen: () => void
  placeholder?: string
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onOpenFullscreen,
  placeholder = '请输入搜索关键词'
}) => {
  return (
    <View className='search-bar-wrapper' onClick={onOpenFullscreen}>
      <View className='custom-search-bar'>
        <View className='search-icon-wrapper'>
          <Text className='search-icon'>🔍</Text>
        </View>
        <Input
          className='search-input'
          placeholder={placeholder}
          value={value}
          readonly
          placeholderClass='search-placeholder'
        />
        <Text className='expand-icon'>
          <ExpandOutlined size={20} />
        </Text>
      </View>
    </View>
  )
}
