import { Icon } from "@/components/common/Icon";
import { Star } from "@taroify/icons";
import { Button } from "@taroify/core";
import { Text, View } from "@tarojs/components";

interface GenerateBarProps {
  cost?: number;
  balance?: number;
  onGenerate?: () => void;
  loading?: boolean;
}

export function GenerateBar({
  cost,
  balance,
  onGenerate,
  loading = false,
}: GenerateBarProps) {
  const handleGenerate = () => {
    if (loading) return;
    onGenerate?.();
  };

  return (
    <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg rounded-t-2xl">
      <View className="flex items-center gap-4">
        {/* Cost */}
        <View className="flex flex-col">
          <Text className="text-[10px] font-bold uppercase text-gray-400">
            预计消耗
          </Text>
          <View className="flex items-center gap-1">
            <Icon name="bolt" size={16} />
            <Text className="font-bold text-lg text-black">
              {cost !== undefined ? cost : "--"}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-8 w-[1px] bg-gray-200 mx-2"></View>

        {/* Balance */}
        <View className="flex flex-col mr-auto">
          <Text className="text-[10px] font-bold uppercase text-gray-400">
            余额
          </Text>
          <Text className="font-bold text-sm text-black">
            {balance !== undefined ? balance.toLocaleString() : "--"}
          </Text>
        </View>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          shape="round"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            width: "66.66%",
            padding: "14px 32px",
          }}
        >
          <View className="flex items-center justify-center gap-2">
            <Star size={20} color="white" />
            <Text>{loading ? "生成中..." : "立即生成"}</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
