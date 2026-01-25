import { Text, View } from "@tarojs/components";

interface TaskDetailParametersProps {
  model: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
}

export function TaskDetailParameters({
  model,
  width,
  height,
  steps,
  cfg_scale,
  seed,
}: TaskDetailParametersProps) {
  const params = [
    { label: "模型", value: model },
    { label: "尺寸", value: width && height ? `${width}x${height}` : "-" },
    { label: "步数", value: steps ?? "-" },
    { label: "CFG", value: cfg_scale ?? "-" },
    { label: "种子", value: seed ?? "-" },
  ];

  return (
    <View className="flex flex-col gap-3">
      <Text className="text-lg font-semibold text-gray-900">生成参数</Text>

      <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {params.map((param, index) => (
          <View
            key={index}
            className={`flex justify-between items-center px-5 py-3 ${
              index !== params.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <Text className="text-sm text-gray-500">{param.label}</Text>
            <Text className="text-sm text-gray-900 font-medium">
              {param.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
