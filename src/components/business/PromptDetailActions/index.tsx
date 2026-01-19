import { Text, View } from "@tarojs/components"

interface PromptDetailActionsProps {
  liked: boolean
  likes: number
  bookmarked: boolean
  bookmarks: number
  onLike: () => void
  onBookmark: () => void
  onShare: () => void
}

export function PromptDetailActions({
  liked,
  likes,
  bookmarked,
  bookmarks,
  onLike,
  onBookmark,
  onShare,
}: PromptDetailActionsProps) {
  return (
    <View className="flex justify-center w-full -mx-2">
      <View className="flex items-center gap-6 px-8 py-3 bg-white border border-gray-100 rounded-full shadow-lg z-10">
        <View
          className="flex flex-col items-center gap-1 w-12"
          onClick={onLike}
        >
          <Text
            className={`text-2xl ${liked ? "text-red-500" : "text-slate-400"}`}
          >
            {liked ? "♥" : "♡"}
          </Text>
          <Text className="text-[10px] font-bold text-slate-500">
            {likes}
          </Text>
        </View>
        <View className="w-px h-8 bg-gray-200" />
        <View
          className="flex flex-col items-center gap-1 w-12"
          onClick={onBookmark}
        >
          <Text
            className={`text-2xl ${bookmarked ? "text-yellow-500" : "text-slate-400"}`}
          >
            {bookmarked ? "★" : "☆"}
          </Text>
          <Text className="text-[10px] font-bold text-slate-500">
            {bookmarks}
          </Text>
        </View>
        <View className="w-px h-8 bg-gray-200" />
        <View
          className="flex flex-col items-center gap-1 w-12"
          onClick={onShare}
        >
          <Text className="text-2xl text-slate-400">↗</Text>
          <Text className="text-[10px] font-bold text-slate-500">
            Share
          </Text>
        </View>
      </View>
    </View>
  )
}
