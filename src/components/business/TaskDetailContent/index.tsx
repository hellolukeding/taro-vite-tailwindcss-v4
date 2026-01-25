import { DiamondOutlined } from "@taroify/icons";
import { Text, View } from "@tarojs/components";

interface TaskDetailContentProps {
  prompt: string;
  onCopy: () => void;
}

export function TaskDetailContent({ prompt, onCopy }: TaskDetailContentProps) {
  return (
    <View className="flex flex-col gap-3">
      <View className="flex items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">提示词</Text>
        <View
          className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full active:bg-gray-200"
          onClick={onCopy}
        >
          <DiamondOutlined size={14} />
          <Text className="text-xs text-gray-600">复制</Text>
        </View>
      </View>

      <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
        <Text className="text-sm text-gray-700 leading-relaxed">
          {prompt || "无提示词"}
        </Text>
      </View>
    </View>
  );
}
