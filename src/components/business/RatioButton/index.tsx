import { Icon } from "@/components/common/Icon";
import { Text, View } from "@tarojs/components";
import React from "react";

type ImageRatio =
  | "auto"
  | "1:1"
  | "3:4"
  | "4:3"
  | "16:9"
  | "9:16"
  | "21:9"
  | "3:2"
  | "2:3"
  | "5:4"
  | "4:5";

interface RatioButtonProps {
  ratio: ImageRatio;
  isSelected: boolean;
  onPress: () => void;
}

const ratioIcons: Record<ImageRatio, React.ReactElement> = {
  auto: (
    <View className="flex items-center justify-center">
      <Icon name="auto_awesome" size={16} />
    </View>
  ),
  "1:1": <View className="w-6 h-6 border-2 border-current rounded-sm" />,
  "3:4": <View className="w-5 h-7 border-2 border-current rounded-sm" />,
  "4:3": <View className="w-7 h-5 border-2 border-current rounded-sm" />,
  "16:9": <View className="w-8 h-5 border-2 border-current rounded-sm" />,
  "9:16": <View className="w-5 h-8 border-2 border-current rounded-sm" />,
  "21:9": <View className="w-9 h-4 border-2 border-current rounded-sm" />,
  "3:2": <View className="w-7 h-5 border-2 border-current rounded-sm" />,
  "2:3": <View className="w-5 h-7 border-2 border-current rounded-sm" />,
  "5:4": <View className="w-6 h-5 border-2 border-current rounded-sm" />,
  "4:5": <View className="w-5 h-6 border-2 border-current rounded-sm" />,
};

export function RatioButton({ ratio, isSelected, onPress }: RatioButtonProps) {
  return (
    <View
      onClick={onPress}
      className={`p-3 flex flex-col items-center justify-center gap-2 rounded-xl transition ${isSelected
          ? "bg-black border-2 border-black shadow-lg"
          : "bg-white border-2 border-gray-200 hover:bg-gray-100"
        }`}
    >
      <View className={`${isSelected ? "text-white" : "text-gray-400"}`}>
        {ratioIcons[ratio]}
      </View>
      <Text
        className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-500"}`}
      >
        {ratio}
      </Text>
    </View>
  );
}
