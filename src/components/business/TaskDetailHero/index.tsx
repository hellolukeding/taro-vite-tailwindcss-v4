import { Image, View } from "@tarojs/components";
import { useMemo } from "react";
import { normalizeUrl } from "@/utils/url";

interface TaskDetailHeroProps {
  imageUrl: string;
  onFullscreen: () => void;
}

export function TaskDetailHero({ imageUrl, onFullscreen }: TaskDetailHeroProps) {
  const normalizedUrl = useMemo(() => normalizeUrl(imageUrl), [imageUrl]);

  return (
    <View
      className="w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden"
      style={{
        borderBottomLeftRadius: "2.5rem",
        borderBottomRightRadius: "2.5rem",
      }}
      onClick={onFullscreen}
    >
      {imageUrl ? (
        <Image
          src={normalizedUrl}
          className="w-full h-full"
          mode="aspectFill"
          lazyLoad
        />
      ) : (
        <View className="w-full h-full flex items-center justify-center">
          <View className="text-gray-400 text-center">
            <View className="text-6xl mb-2">🎨</View>
            <View className="text-sm">图片生成中...</View>
          </View>
        </View>
      )}

      {/* 全屏提示 */}
      {imageUrl && (
        <View className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          <View className="text-white text-xs">点击全屏</View>
        </View>
      )}
    </View>
  );
}
