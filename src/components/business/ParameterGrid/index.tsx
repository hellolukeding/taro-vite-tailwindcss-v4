import { View, Text } from '@tarojs/components'
import { Cell } from '@taroify/core'
import { Icon } from '@/components/common/Icon'

interface ParameterGridProps {
  model: string
  ratio: string
  steps: number
  seed: string
  sampler: string
}

export function ParameterGrid({
  model,
  ratio,
  steps,
  seed,
  sampler,
}: ParameterGridProps) {
  const parameters = [
    { label: 'Model', value: model, icon: 'model_training' },
    { label: 'Ratio', value: ratio, icon: 'aspect_ratio' },
    { label: 'Steps', value: steps.toString(), icon: 'stairs' },
    { label: 'Seed', value: seed, icon: 'tag', mono: true },
    { label: 'Sampler', value: sampler, icon: 'tune' },
  ]

  return (
    <View className='flex flex-col space-y-4'>
      {/* Header - 黑色主题 */}
      <View className='flex items-center gap-2'>
        <View className='w-1.5 h-6 bg-black rounded-full' />
        <Text className='text-lg font-bold text-gray-900'>参数</Text>
      </View>

      {/* 参数列表 - 使用 View 替代 CellGroup */}
      <View className='bg-gray-50 rounded-2xl overflow-hidden border border-gray-100'>
        {parameters.map((param, index) => (
          <Cell
            key={param.label}
            title={
              <Text className='text-xs text-gray-500 uppercase tracking-wider font-bold'>
                {param.label}
              </Text>
            }
            description={
              <Text className={`text-sm font-semibold text-gray-900 ${
                param.mono ? 'font-mono' : ''
              }`}>
                {param.value}
              </Text>
            }
            icon={<Icon name={param.icon} size={18} color='black' />}
          />
        ))}
      </View>
    </View>
  )
}
