import { normalizeUrl } from '@/utils/url'
import { generateAvatarUrl } from '@/utils/constants'
import { Image, Text, View } from '@tarojs/components'

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
  // 如果头像为空，基于用户名生成默认头像
  const avatarUrl = avatar || generateAvatarUrl(username)

  return (
    <View className='flex gap-4'>
      <View className='shrink-0'>
        <Image
          src={normalizeUrl(avatarUrl)}
          className='w-10 h-10 rounded-full'
          mode='aspectFill'
        />
      </View>

      <View className='flex-1 space-y-1'>
        <View className='flex justify-between items-center'>
          <Text className='text-sm font-bold text-slate-900'>{username}</Text>
          <Text className='text-xs text-slate-400'>{time}</Text>
        </View>
        <Text className='text-sm text-slate-600 leading-relaxed'>{content}</Text>
        <View className='flex items-center gap-4 pt-1'>
          <Text className='text-slate-400 text-xs font-medium'>Reply</Text>
          {/* <View className='flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors'>
            <Icon name='favorite' size={14} />
            <Text className='text-xs font-medium'>{likes}</Text>
          </View> */}
        </View>
      </View>
    </View>
  )
}
