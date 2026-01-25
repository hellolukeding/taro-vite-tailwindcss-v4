import { Icon } from "@/components/common/Icon";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

interface PromptDetailHeroProps {
  imageUrl: string;
  onFullscreen?: () => void;
}

export function PromptDetailHero({
  imageUrl,
  onFullscreen,
}: PromptDetailHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // 监控 imageUrl 变化
  useEffect(() => {
    console.log("[PromptDetailHero] imageUrl 变化:", imageUrl);

    // 重置状态
    if (imageUrl) {
      setImageLoaded(false);
      setImageError(false);
      setShowLoading(true);

      // 延迟500ms后隐藏加载骨架（给图片加载一些时间）
      const timer = setTimeout(() => {
        console.log("[PromptDetailHero] 延迟隐藏加载骨架");
        setShowLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [imageUrl]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleMore = () => {
    Taro.showActionSheet({
      itemList: ["保存图片", "分享", "举报"],
      success: async (res) => {
        if (res.tapIndex === 0) {
          // 保存图片
          try {
            await Taro.downloadFile({
              url: imageUrl,
              success: (res) => {
                Taro.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: () =>
                    Taro.showToast({ title: "已保存", icon: "success" }),
                  fail: () =>
                    Taro.showToast({ title: "保存失败", icon: "none" }),
                });
              },
            });
          } catch (e) {
            Taro.showToast({ title: "下载失败", icon: "none" });
          }
        }
      },
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setShowLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setShowLoading(false);
  };

  return (
    <View className="w-full relative bg-gray-900 min-h-60">
      <View
        className="w-full bg-gray-900 relative overflow-hidden shadow-2xl"
        style={{
          height: "120vw",
          maxHeight: "600px",
          borderBottomLeftRadius: "2rem",
          borderBottomRightRadius: "2rem",
        }}
      >
        {/* 加载骨架 */}
        {showLoading && (
          <View className="absolute inset-0 z-10 bg-gray-800 animate-pulse flex items-center justify-center">
            <Icon name="photo" size={48} color="#374151" />
          </View>
        )}

        {/* 错误状态 */}
        {(imageError || !imageUrl) && !showLoading && (
          <View className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-800 gap-3">
            <Icon name="image_not_supported" size={48} color="#9ca3af" />
            <Text className="text-gray-400 text-sm">
              {!imageUrl ? "暂无图片" : "图片加载失败"}
            </Text>
          </View>
        )}

        {/* 主图 - 使用 style 确保高度正确 */}
        {imageUrl && !imageError && (
          <Image
            key={imageUrl}
            src={imageUrl}
            className="absolute inset-0"
            style={{
              width: "100%",
              height: "100%",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 500ms ease-in-out",
            }}
            mode="aspectFill"
            onLoad={handleImageLoad}
            onError={handleImageError}
            showMenuByLongpress
          />
        )}

        {/* 顶部半透明悬浮导航 */}
        {/* {!imageError && (
          <View className="absolute bottom-0 right-0 z-50 p-4">
            <Button
              onClick={handleMore}
              className="bg-black/50 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-white text-xl">⋯</Text>
            </Button>
          </View>
        )} */}


        {/* 底部渐变遮罩 */}
        {!imageError && imageLoaded && (
          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent" />
        )}
      </View>
    </View>
  );
}
