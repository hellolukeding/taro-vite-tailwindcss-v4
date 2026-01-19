import { Button } from "@taroify/core"
import { Text, View } from "@tarojs/components"

interface PromptDetailHeaderProps {
  avatar: string
  username: string
  followers: number
  title: string
  onFollow: () => void
}

export function PromptDetailHeader({
  avatar,
  username,
  followers,
  title,
  onFollow,
}: PromptDetailHeaderProps) {
  return (
    <View className="flex flex-col gap-4">
      <View className="flex items-center justify-between">
        <View className="flex items-center gap-3">
          <View
            className="w-11 h-11 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100"
            style={{ backgroundImage: `url(${avatar})` }}
          />
          <View className="flex flex-col">
            <Text className="text-sm font-bold text-slate-900 leading-none mb-1">
              {username}
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">
              {followers} followers
            </Text>
          </View>
        </View>
        <Button
          size="small"
          shape="round"
          className="px-5 py-2"
          onClick={onFollow}
        >
          关注
        </Button>
      </View>
      <Text className="text-2xl font-bold text-slate-900 leading-tight mt-1">
        {title}
      </Text>
    </View>
  )
}
