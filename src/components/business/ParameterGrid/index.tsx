import { View, Text } from '@tarojs/components'

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
    { label: 'Model', value: model },
    { label: 'Ratio', value: ratio },
    { label: 'Steps', value: steps.toString() },
    { label: 'Seed', value: seed, mono: true },
    { label: 'Sampler', value: sampler, full: true },
  ]

  return (
    <View className='flex flex-col gap-4'>
      {/* Header */}
      <View className='flex items-center gap-2'>
        <View className='w-1 h-5 bg-blue-600 rounded-full' />
        <Text className='text-lg font-bold text-gray-900'>参数</Text>
      </View>

      {/* Grid */}
      <View className='grid grid-cols-2 gap-3'>
        {parameters.map((param) => (
          <View
            key={param.label}
            className={`bg-gray-50 rounded-xl p-3 flex flex-col gap-1 border border-gray-100 ${
              param.full ? 'col-span-2' : ''
            }`}
          >
            <Text className='text-[10px] text-gray-400 uppercase tracking-wider font-bold'>
              {param.label}
            </Text>
            <Text
              className={`text-sm font-semibold text-gray-900 ${
                param.mono ? 'font-mono' : ''
              } ${param.full ? '' : 'truncate'}`}
            >
              {param.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
