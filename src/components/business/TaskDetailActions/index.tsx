import { BrushOutlined, Close, Delete, Share } from "@taroify/icons";
import { Text, View } from "@tarojs/components";

interface TaskDetailActionsProps {
  canPublish: boolean;
  isAuditing: boolean;
  isPublic: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onShare: () => void;
  publishing: boolean;
  unpublishing: boolean;
}

export function TaskDetailActions({
  canPublish,
  isAuditing,
  isPublic,
  onPublish,
  onUnpublish,
  onDelete,
  onShare,
  publishing,
  unpublishing,
}: TaskDetailActionsProps) {
  // 审核中状态
  if (isAuditing) {
    return (
      <View className="w-full bg-white border-t border-gray-200 px-5 py-4">
        <View className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <View className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <View className="text-yellow-600 text-lg">⏳</View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-yellow-900">
              作品审核中
            </Text>
            <Text className="text-xs text-yellow-700 mt-0.5">
              审核通过后将公开展示，请耐心等待
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // 已公开状态
  if (isPublic) {
    return (
      <View className="w-full bg-white border-t border-gray-200 px-5 py-4">
        <View className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-3 flex items-center gap-3">
          <View className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <View className="text-green-600 text-lg">✓</View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-green-900">
              已公开发布
            </Text>
            <Text className="text-xs text-green-700 mt-0.5">
              作品正在广场中展示，其他用户可以点赞和收藏
            </Text>
          </View>
        </View>

        <View className="flex gap-3">
          <View
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl flex items-center justify-center gap-2 active:bg-gray-200"
            onClick={onUnpublish}
          >
            <Close size={18} />
            <Text className="text-sm font-medium">
              {unpublishing ? "处理中..." : "取消发布"}
            </Text>
          </View>

          <View
            className="flex-1 bg-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 active:bg-blue-600"
            onClick={onShare}
          >
            <Share size={18} />
            <Text className="text-sm font-medium">分享</Text>
          </View>
        </View>
      </View>
    );
  }

  // 私有状态（可以发布）
  return (
    <View className="w-full bg-white border-t border-gray-200 px-5 py-4">
      <View className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 mb-3">
        <View className="flex items-center gap-3 mb-2">
          <View className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <View className="text-gray-500 text-lg">🔒</View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">
              私有状态
            </Text>
            <Text className="text-xs text-gray-600 mt-0.5">
              作品未公开，只有您可以看到
            </Text>
          </View>
        </View>

        {canPublish && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mt-2">
            <Text className="text-xs text-blue-700">
              💡 发布到广场后，其他用户可以点赞、收藏和评论您的作品
            </Text>
          </View>
        )}
      </View>

      <View className="flex gap-3">
        {canPublish ? (
          <View
            className="flex-1 bg-gradient-to-r from-black to-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 active:opacity-90"
            onClick={onPublish}
          >
            <BrushOutlined size={18} />
            <Text className="text-sm font-medium">
              {publishing ? "提交中..." : "发布作品"}
            </Text>
          </View>
        ) : (
          <View className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-2xl flex items-center justify-center">
            <Text className="text-sm font-medium">任务未完成，无法发布</Text>
          </View>
        )}

        <View
          className="bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl flex items-center justify-center active:bg-gray-200"
          onClick={onDelete}
        >
          <Delete size={20} />
        </View>
      </View>
    </View>
  );
}
