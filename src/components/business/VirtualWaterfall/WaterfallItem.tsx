import { LazyImage } from '@/components/business/LazyImage'
import { GoodJobOutlined } from '@taroify/icons'
import { Image, Text, View } from '@tarojs/components'
import { FC, memo } from 'react'
import { normalizeUrl } from '@/utils/url'
import './index.scss'

export interface WorkItem {
  id: string
  title: string
  cover_image: string
  creator?: {
    nickname?: string
    avatar_url?: string
  }
  model?: string
  likes_count?: number
  views_count?: number
}

export interface WaterfallItemProps {
  item: WorkItem
  onClick?: () => void
}

/**
 * WaterfallItem 瀑布流单个作品项
 */
export const WaterfallItem: FC<WaterfallItemProps> = memo(({
  item,
  onClick
}) => {
  return (
    <View className='work-card' onClick={onClick}>
      {/* 图片 */}
      <LazyImage
        src={normalizeUrl(item.cover_image)}
        className='work-img'
        mode='widthFix'
      />

      {/* 标题 */}
      <Text className='work-prompt text-lg'>{item.title}</Text>

      {/* 底部信息 */}
      <View className='work-footer'>
        {/* 作者信息 */}
        <View className='work-author'>
          {item.creator?.avatar_url && (
            <Image
              src={normalizeUrl(item.creator.avatar_url)}
              className='author-avatar'
              mode='aspectFill'
            />
          )}
          <Text className='author-name'>
            {item.creator?.nickname || item.model || '未知'}
          </Text>
        </View>

        {/* 统计信息 */}
        <View className='work-stats'>
          <View className='work-likes text-lg flex items-center justify-center'>
            <GoodJobOutlined size={16} />
            <Text className='stats-num ml-2'>{item.likes_count || 0}</Text>
          </View>
          {item.views_count > 0 && (
            <Text className='views-num text-lg'>{item.views_count}</Text>
          )}
        </View>
      </View>
    </View>
  )
})

WaterfallItem.displayName = 'WaterfallItem'
