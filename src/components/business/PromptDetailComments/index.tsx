import { CommentItem } from "@/components/business/CommentItem"
import { Text, View } from "@tarojs/components"

interface Comment {
  id: string
  avatar: string
  username: string
  time: string
  content: string
  likes: number
}

interface PromptDetailCommentsProps {
  comments: Comment[]
}

export function PromptDetailComments({ comments }: PromptDetailCommentsProps) {
  return (
    <View className="flex flex-col gap-6 pb-40">
      <View className="flex items-center justify-between">
        <Text className="text-lg font-bold text-slate-900">
          评论 ({comments.length})
        </Text>
      </View>

      {comments.length === 0 ? (
        <View className="flex flex-col items-center justify-center py-16">
          <Text className="text-5xl mb-3">💬</Text>
          <Text className="text-slate-900 text-base font-semibold mb-2">
            暂无评论
          </Text>
          <Text className="text-slate-500 text-sm">
            快来发表第一条评论吧
          </Text>
        </View>
      ) : (
        <View className="flex flex-col space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              avatar={comment.avatar}
              username={comment.username}
              time={comment.time}
              content={comment.content}
              likes={comment.likes}
            />
          ))}
        </View>
      )}
    </View>
  )
}
