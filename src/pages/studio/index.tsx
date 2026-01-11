import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { ModelCard } from '@/components/business/ModelCard'
import { RatioButton } from '@/components/business/RatioButton'
import { mockModels } from '@/mock/studio'
import { mockUser } from '@/mock/user'
import { useState } from 'react'
import './index.css'

type ImageRatio = '1:1' | '3:4' | '16:9' | '9:16'

export default function StudioPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('1')
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>('1:1')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [steps, setSteps] = useState(30)
  const [cfgScale, setCfgScale] = useState(7.5)

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId)
  }

  return (
    <View className='bg-white min-h-screen pb-24'>
      {/* 黑色头部 */}
      <View className='bg-black pt-12 pb-8 px-6 rounded-b-3xl relative z-10'>
        {/* 顶部导航 */}
        <View className='flex justify-between items-center mb-6'>
          <View className='flex items-center gap-2'>
            <Icon name='arrow_back_ios' size={24} color='white' />
            <Text className='text-white text-xl font-semibold tracking-wide'>创作工坊</Text>
          </View>
          <View className='flex items-center gap-3'>
            <View className='bg-white/20 p-2 rounded-xl backdrop-blur-sm'>
              <Icon name='history' size={20} color='white' />
            </View>
            <Image
              src={mockUser.avatar}
              className='w-10 h-10 rounded-full border-2 border-white'
              mode='aspectFill'
            />
          </View>
        </View>

        {/* Prompt输入区 */}
        <View className='bg-white rounded-2xl p-5 shadow-2xl border border-gray-100'>
          <View className='flex justify-between items-center mb-3'>
            <Text className='text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1'>
              <Icon name='edit_note' size={16} />
              提示词
            </Text>
            <View className='flex items-center gap-1 text-xs font-bold text-white bg-black px-3 py-1.5 rounded-lg hover:opacity-80 transition shadow-md">
              <Icon name='translate' size={12} color='white' />
              中译英
            </View>
          </View>
          <Input
            className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm placeholder-gray-400 h-24'
            placeholder='描述你想生成的图片... (例如: 一个未来城市的街道，霓虹灯光，8k分辨率)'
            value={prompt}
            onInput={(e) => setPrompt(e.detail.value)}
          />
          <View className='flex justify-end mt-3'>
            <View className='flex items-center gap-1 text-xs font-semibold text-black border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition'>
              <Icon name='casino' size={14} />
              随机
            </View>
          </View>
        </View>
      </View>

      {/* 主内容区域 */}
      <ScrollView scrollY className='px-5 mt-8 space-y-10 pb-8'>
        {/* 模型选择 */}
        <View>
          <View className='flex justify-between items-end mb-5'>
            <Text className='text-lg font-bold flex items-center gap-2'>
              <View className='w-1.5 h-6 bg-black rounded-full' />
              选择模型
            </Text>
            <Text className='text-xs font-bold text-black border-b-2 border-black pb-0.5'>
              查看全部
            </Text>
          </View>
          <ScrollView scrollX className='flex gap-4 overflow-x-auto pb-4 pl-1'>
            {mockModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onPress={() => handleModelSelect(model.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* 图片比例选择 */}
        <View>
          <Text className='text-lg font-bold mb-5 flex items-center gap-2'>
            <View className='w-1.5 h-6 bg-black rounded-full' />
            图片比例
          </Text>
          <View className='grid grid-cols-4 gap-3'>
            {(['1:1', '3:4', '16:9', '9:16'] as ImageRatio[]).map((ratio) => (
              <RatioButton
                key={ratio}
                ratio={ratio}
                isSelected={selectedRatio === ratio}
                onPress={() => setSelectedRatio(ratio)}
              />
            ))}
          </View>
        </View>

        {/* 高级设置 */}
        <View>
          <View
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='bg-white rounded-2xl border-2 border-gray-100 overflow-hidden'
          >
            <View className='flex justify-between items-center p-4'>
              <View className='flex items-center gap-2'>
                <Icon name='tune' size={20} />
                <Text className='font-bold text-sm'>高级设置</Text>
              </View>
              <Icon
                name='expand_more'
                size={20}
                className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </View>

            {showAdvanced && (
              <View className='px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50'>
                <View className='mt-2 space-y-6'>
                  {/* 步数滑块 */}
                  <View>
                    <View className='flex justify-between mb-2'>
                      <Text className='text-xs font-bold text-gray-500 uppercase'>步数</Text>
                      <Text className='text-xs font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-200'>
                        {steps}
                      </Text>
                    </View>
                    <input
                      type='range'
                      min='10'
                      max='50'
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                      style={{ accentColor: '#000000' }}
                    />
                  </View>

                  {/* CFG滑块 */}
                  <View>
                    <View className='flex justify-between mb-2'>
                      <Text className='text-xs font-bold text-gray-500 uppercase'>提示词引导 (CFG)</Text>
                      <Text className='text-xs font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-200'>
                        {cfgScale}
                      </Text>
                    </View>
                    <input
                      type='range'
                      min='1'
                      max='20'
                      step='0.5'
                      value={cfgScale}
                      onChange={(e) => setCfgScale(Number(e.target.value))}
                      className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                      style={{ accentColor: '#000000' }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部生成栏 */}
      <View className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 z-50'>
        <View className='flex items-center gap-4 max-w-md mx-auto'>
          {/* 消耗积分 */}
          <View className='flex flex-col'>
            <Text className='text-[10px] font-bold uppercase text-gray-400'>预计消耗</Text>
            <View className='flex items-center gap-1'>
              <Icon name='bolt' size={16} color='yellow-500' filled />
              <Text className='font-bold text-lg text-black'>2</Text>
            </View>
          </View>

          <View className='h-8 w-[1px] bg-gray-200 mx-2' />

          {/* 余额 */}
          <View className='flex flex-col mr-auto'>
            <Text className='text-[10px] font-bold uppercase text-gray-400'>余额</Text>
            <Text className='font-bold text-sm text-black'>{mockUser.credits}</Text>
          </View>

          {/* 立即生成按钮 */}
          <View className='bg-black hover:opacity-90 text-white font-bold py-3.5 px-8 rounded-full shadow-lg flex items-center gap-2 transform active:scale-95 transition-all justify-center text-sm tracking-wide'>
            <Icon name='auto_awesome' size={20} color='white' />
            立即生成
          </View>
        </View>
      </View>
    </View>
  )
}
