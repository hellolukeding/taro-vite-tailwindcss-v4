import { Button, Divider } from "@taroify/core";
import { Star } from "@taroify/icons";
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


    <View className=" flex items-center justify-between fixed bottom-0 left-0 w-full bg-white px-6 py-4 border-t border-gray-200 shadow-md z-50">
      {/* Cost */}
      <View className="flex flex-col gap-2 ">
        <Text className="text-base font-semibold text-gray-600 w-20">
          预计消耗
        </Text>
        <View className="flex items-center gap-2">
          <Text className="text-lg font-bold text-black leading-none">
            {cost !== undefined ? cost : "--"}
          </Text>
        </View>
      </View>


      {/* Divider */}
      <Divider type='vertical' />

      {/* Balance */}
      <View className="flex flex-col gap-2 ">
        <Text className="text-base font-semibold text-gray-600 w-20">
          余额
        </Text>
        <Text className="text-lg font-bold text-black leading-none">
          {balance !== undefined ? balance.toLocaleString() : "--"}
        </Text>
      </View>

      {/* Generate Button */}
      <View className="flex justify-end flex-1">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          shape="round"
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 32px",
          }}
          icon={
            <Star size={24} color="white" />
          }
        >
          立即生成
        </Button>
      </View>
    </View>






  );
}
