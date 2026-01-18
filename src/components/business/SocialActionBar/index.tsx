import { View, Text } from '@tarojs/components'
import { Button } from '@taroify/core'
import { useState } from 'react'
import { Icon } from '@/components/common/Icon'

interface SocialActionBarProps {
  likes?: number
  bookmarks?: number
  liked?: boolean
  bookmarked?: boolean
  onLike?: () => void
  onBookmark?: () => void
  onShare?: () => void
}

export function SocialActionBar({
  likes = 0,
  bookmarks = 0,
  liked = false,
  bookmarked = false,
  onLike,
  onBookmark,
  onShare,
}: SocialActionBarProps) {
  const [liking, setLiking] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const handleLike = async () => {
    if (liking) return
    setLiking(true)
    try {
      await onLike?.()
    } finally {
      setLiking(false)
    }
  }

  const handleBookmark = async () => {
    if (bookmarking) return
    setBookmarking(true)
    try {
      await onBookmark?.()
    } finally {
      setBookmarking(false)
    }
  }

  return (
    <View className='flex items-center justify-around px-2'>
      {/* Like Button */}
      <Button
        onClick={handleLike}
        variant='text'
        className='flex flex-col items-center gap-2 transition-all duration-200 active:scale-95'
        disabled={liking}
      >
        <View 
          className={`flex items-center justify-center transition-all duration-200 ${
            liked 
              ? 'bg-black shadow-lg scale-110' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%',
            boxShadow: liked ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
          }}
        >
          <Icon
            name='favorite'
            size={22}
            color={liked ? 'white' : '#64748b'}
            className={liked ? 'animate-pulse' : ''}
          />
        </View>
        <Text 
          className={`text-sm font-medium transition-colors duration-200 ${
            liked 
              ? 'text-black font-semibold' 
              : 'text-gray-500'
          }`}
          style={{ fontSize: '13px' }}
        >
          {formatCount(likes)}
        </Text>
      </Button>

      {/* Bookmark Button */}
      <Button
        onClick={handleBookmark}
        variant='text'
        className='flex flex-col items-center gap-2 transition-all duration-200 active:scale-95'
        disabled={bookmarking}
      >
        <View 
          className={`flex items-center justify-center transition-all duration-200 ${
            bookmarked 
              ? 'bg-black shadow-lg scale-110' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%',
            boxShadow: bookmarked ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
          }}
        >
          <Icon
            name='bookmark'
            size={22}
            color={bookmarked ? 'white' : '#64748b'}
            className={bookmarked ? 'animate-pulse' : ''}
          />
        </View>
        <Text 
          className={`text-sm font-medium transition-colors duration-200 ${
            bookmarked 
              ? 'text-black font-semibold' 
              : 'text-gray-500'
          }`}
          style={{ fontSize: '13px' }}
        >
          {formatCount(bookmarks)}
        </Text>
      </Button>

      {/* Share Button */}
      <Button
        onClick={onShare}
        variant='text'
        className='flex flex-col items-center gap-2 transition-all duration-200 active:scale-95'
      >
        <View 
          className='flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all duration-200'
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%'
          }}
        >
          <Icon name='share' size={22} color='#64748b' />
        </View>
        <Text 
          className='text-sm font-medium text-gray-500'
          style={{ fontSize: '13px' }}
        >
          分享
        </Text>
      </Button>
    </View>
  )
}
