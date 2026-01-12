import type { MockModel } from '@/mock/studio'
import { ScrollView, Text, View } from '@tarojs/components'
import { ModelCard } from '../ModelCard'

interface StudioModelSelectorProps {
  models: MockModel[]
  onSelect: (modelId: string) => void
}

export function StudioModelSelector({ models, onSelect }: StudioModelSelectorProps) {
  return (
    <View className='mt-8'>
      {/* Section Header */}
      <View className='flex justify-between items-end mb-5 px-1'>
        <Text className='text-lg font-bold flex items-center gap-2'>
          <View className='w-1.5 h-6 bg-black rounded-full'></View>
          选择模型
        </Text>
        {/* <Text className='text-xs font-bold text-black border-b-2 border-black pb-0.5'>
          查看全部
        </Text> */}
      </View>

      {/* Model Cards */}
      <ScrollView scrollX className='overflow-x-auto pb-4'>
        <View className='flex gap-4 px-1'>
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onPress={() => onSelect(model.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
