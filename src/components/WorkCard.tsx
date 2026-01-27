import { Icon } from '@/components/common/Icon'
import { normalizeUrl } from '@/utils/url'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import './WorkCard.css'

interface WorkCardProps {
  id: string
  index: number
  data: any[]
  isScrolling?: boolean
}

export const WorkCard = memo(({ id, index, data, isScrolling }: WorkCardProps) => {
  const work = data[index]

  if (!work) return null

  const handleClick = () => {
    Taro.navigateTo({
      url: `/packageDetail/pages/prompt-detail/index?id=${work.id}`,
    })
  }

  return (
    <View id={id} className='work-card' onClick={handleClick}>
      <Image
        src={normalizeUrl(work.cover_image)}
        className='work-img'
        mode='aspectFill'
        lazyLoad
      />
      <Text className='work-prompt text-lg'>{work.title}</Text>
      <View className='work-footer'>
        <View className='work-author'>
          {work.creator?.avatar_url && (
            <Image
              src={normalizeUrl(work.creator.avatar_url)}
              className='author-avatar'
              mode='aspectFill'
            />
          )}
          <Text className='author-name'>{work.creator?.nickname || work.model}</Text>
        </View>
        <View className='work-stats'>
          <View className='work-likes'>
            <Icon name='favorite' size={12} color='#F43F5E' />
            <Text className='stats-num'>{work.likes_count || 0}</Text>
          </View>
          {work.views_count > 0 && (
            <Text className='views-num'>{work.views_count}</Text>
          )}
        </View>
      </View>
    </View>
  )
})

WorkCard.displayName = 'WorkCard'
