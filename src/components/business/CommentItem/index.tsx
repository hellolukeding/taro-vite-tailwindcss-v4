import { View, Text } from '@tarojs/components'
import { Button, Image } from '@taroify/core'
import { Icon } from '@/components/common/Icon'

interface CommentItemProps {
  avatar: string
  username: string
  time: string
  content: string
  likes?: number
  onLike?: () => void
  onReply?: () => void
}

export function CommentItem({
  avatar,
  username,
  time,
  content,
  likes = 0,
  onLike,
  onReply,
}: CommentItemProps) {
  return (
    <View className='flex gap-3'>
      {/* Avatar */}
      <View className='shrink-0'>
        <Image
          src={avatar}
          shape='circle'
          className='w-10 h-10'
        />
      </View>

      {/* Content */}
      <View className='flex flex-col gap-1.5 flex-1'>
        {/* Header */}
        <View className='flex justify-between items-start'>
          <Text className='text-sm font-bold text-gray-900'>{username}</Text>
          <Text className='text-xs text-gray-400'>{time}</Text>
        </View>

        {/* Message */}
        <Text className='text-sm text-gray-700 leading-relaxed'>{content}</Text>

        {/* Actions */}
        <View className='flex items-center gap-5 mt-1'>
          <Button
            onClick={onLike}
            variant='text'
            size='mini'
            className='p-0! flex items-center gap-1.5'
          >
            <Icon name='favorite' size={18} color='#9ca3af' />
            <Text className='text-xs font-medium text-gray-400'>{likes}</Text>
          </Button>

          {onReply && (
            <Button
              onClick={onReply}
              variant='text'
              size='mini'
              className='p-0! flex items-center gap-1.5'
            >
              <Icon name='chat_bubble' size={18} color='#9ca3af' />
              <Text className='text-xs font-medium text-gray-400'>Reply</Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
