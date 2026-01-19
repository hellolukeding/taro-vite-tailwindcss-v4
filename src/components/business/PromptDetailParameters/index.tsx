import { Text, View } from "@tarojs/components"

interface PromptDetailParametersProps {
  model: string
  ratio: string
  steps: number
  seed: number
  sampler: string
}

export function PromptDetailParameters({
  model,
  ratio,
  steps,
  seed,
  sampler,
}: PromptDetailParametersProps) {
  return (
    <View className="flex flex-col gap-3">
      <Text className="text-sm font-bold text-slate-900 flex items-center gap-2">
        Parameters
      </Text>
      <View className="flex flex-wrap gap-2">
        <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
          <Text className="text-slate-400">Model:</Text> {model}
        </View>
        <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
          <Text className="text-slate-400">Ratio:</Text> {ratio}
        </View>
        <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
          <Text className="text-slate-400">Steps:</Text> {steps}
        </View>
        <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
          <Text className="text-slate-400">Seed:</Text> {seed}
        </View>
        <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
          <Text className="text-slate-400">Sampler:</Text> {sampler}
        </View>
      </View>
    </View>
  )
}
