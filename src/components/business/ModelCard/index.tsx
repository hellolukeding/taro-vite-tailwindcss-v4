import { MockModel } from "@/mock/studio";
import { Success } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";

interface ModelCardProps {
  model: MockModel;
  onPress: () => void;
}

export function ModelCard({ model, onPress }: ModelCardProps) {
  return (
    <View
      className="flex-shrink-0 w-32 relative group cursor-pointer"
      onClick={onPress}
    >
      {/* VIP Badge */}
      {model.isVIP && (
        <View className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
          VIP
        </View>
      )}

      {/* 模型卡片 */}
      <View
        className={`w-32 h-44 rounded-2xl overflow-hidden border-4 transition-all duration-300 relative ${model.isSelected
            ? "border-black shadow-2xl scale-105"
            : "border-transparent hover:border-gray-300"
          }`}
      >
        {/* 图片 */}
        <Image
          src={model.imageUrl}
          className="w-full h-full object-cover"
          mode="aspectFill"
        />

        {/* 选中时显示的黑色遮罩 */}
        {model.isSelected && (
          <View className="absolute inset-0 opacity-30 bg-black" />
        )}

        {/* 渐变遮罩 */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* 选中图标 */}
        {model.isSelected && (
          <View className="absolute bottom-3 left-0 right-0 text-center">
            <Success size={20} color="white" className="font-semibold" />
          </View>
        )}
      </View>

      {/* 模型名称 */}
      <Text
        className={`text-center text-xs font-bold mt-2 uppercase tracking-wide ${model.isSelected ? "text-black" : "text-gray-500"
          }`}
      >
        {model.name}
      </Text>
    </View>
  );
}
