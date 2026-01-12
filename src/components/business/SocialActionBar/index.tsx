import { View, Text } from '@tarojs/components'
import { Button } from '@taroify/core'
import { Icon } from '@/components/common/Icon'

interface SocialActionBarProps {
  likes?: number
  bookmarks?: number
  onLike?: () => void
  onBookmark?: () => void
  onShare?: () => void
}

export function SocialActionBar({
  likes = 0,
  bookmarks = 0,
  onLike,
  onBookmark,
  onShare,
}: SocialActionBarProps) {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <View className='flex items-center justify-between px-2'>
      {/* Like Button */}
      <Button
        onClick={onLike}
        variant='text'
        className='flex flex-1 flex-col items-center gap-1.5'
      >
        <View className='p-3 rounded-full bg-gray-100'>
          <Icon name='favorite' size={26} color='#64748b' />
        </View>
        <Text className='text-xs font-medium text-gray-500'>{formatCount(likes)}</Text>
      </Button>

      {/* Bookmark Button */}
      <Button
        onClick={onBookmark}
        variant='text'
        className='flex flex-1 flex-col items-center gap-1.5'
      >
        <View className='p-3 rounded-full bg-gray-100'>
          <Icon name='bookmark' size={26} color='#64748b' />
        </View>
        <Text className='text-xs font-medium text-gray-500'>{formatCount(bookmarks)}</Text>
      </Button>

      {/* Share Button */}
      <Button
        onClick={onShare}
        variant='text'
        className='flex flex-1 flex-col items-center gap-1.5'
      >
        <View className='p-3 rounded-full bg-gray-100'>
          <Icon name='share' size={26} color='#64748b' />
        </View>
        <Text className='text-xs font-medium text-gray-500'>分享</Text>
      </Button>
    </View>
  )
}
