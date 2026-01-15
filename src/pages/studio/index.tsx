import CommonWarp from '@/components/CommonWarp'
import { GenerateBar } from '@/components/business/GenerateBar'
import ImgUploader from '@/components/business/ImgUploader'
import { PromptInput } from '@/components/business/PromptInput'
import { RatioSelector } from '@/components/business/RatioSelector'
import ResolutionSelector from '@/components/business/ResolutionSelector'
import { StudioModelSelector } from '@/components/business/StudioModelSelector'
import { Icon } from '@/components/common/Icon'
import { mockModels, mockPromptExamples, type MockModel } from '@/mock/studio'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type ImageRatio = 'auto' | '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | '21:9' | '3:2' | '2:3' | '5:4' | '4:5'

interface StudioProps { }

const Studio: React.FC<StudioProps> = (props) => {
  const { requireLogin } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [models, setModels] = useState<MockModel[]>(mockModels)
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>('auto')
  const [steps, setSteps] = useState(30)
  const [cfg, setCfg] = useState(7.5)
  const [isGenerating, setIsGenerating] = useState(false)

  // Handle model selection (需要登录)
  const handleModelSelect = (modelId: string) => {
    if (!requireLogin()) return

    setModels(prev => prev.map(model => ({
      ...model,
      isSelected: model.id === modelId
    })))
  }

  // Handle translate (需要登录)
  const handleTranslate = () => {
    if (!requireLogin()) return

    if (!prompt.trim()) {
      Taro.showToast({ title: '请输入提示词', icon: 'none' })
      return
    }
    // TODO: Implement translation API
    Taro.showToast({ title: '翻译功能开发中', icon: 'none' })
  }

  // Handle random prompt
  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * mockPromptExamples.length)
    setPrompt(mockPromptExamples[randomIndex])
  }

  // Handle generate (需要登录)
  const handleGenerate = () => {
    if (!requireLogin()) return

    if (!prompt.trim()) {
      Taro.showToast({ title: '请输入提示词', icon: 'none' })
      return
    }

    const selectedModel = models.find(m => m.isSelected)
    if (!selectedModel) {
      Taro.showToast({ title: '请选择模型', icon: 'none' })
      return
    }

    setIsGenerating(true)
    // TODO: Implement generation API
    setTimeout(() => {
      setIsGenerating(false)
      Taro.showToast({ title: '生成功能开发中', icon: 'none' })
    }, 2000)
  }

  // Handle resolution selection (需要登录)
  const handleResolutionSelect = (resolutionId: string) => {
    if (!requireLogin()) return

    console.log('Selected resolution:', resolutionId)
  }

  return (
    <CommonWarp title='创作工坊' withHeader={false}>
      <ScrollView scrollY className='h-full bg-gray-50'>
        {/* Header Section */}
        <View className='bg-black pt-20 pb-8 px-3 rounded-b-4xl shadow-xl relative z-10'>
          {/* Top Bar */}
          <View className='flex justify-between items-center mb-6'>
            <View className='flex items-center gap-2' onClick={() => Taro.navigateBack()}>
              <Icon name='arrow_back_ios' size={20} color='white' />
              <Text className='text-white text-xl font-semibold tracking-wide'>创作工坊</Text>
            </View>

          </View>

          {/* 图片上传 */}
          <ImgUploader />

          {/* Prompt Input */}
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onTranslate={handleTranslate}
            onRandom={handleRandom}
          />
        </View>

        {/* Main Content */}
        <View className='px-5 pb-32'>
          {/* Model Selector */}
          <StudioModelSelector
            models={models}
            onSelect={handleModelSelect}
          />

          {/* 选择分辨率 */}
          <ResolutionSelector
            onSelect={handleResolutionSelect}
          />

          {/* Ratio Selector */}
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelect={setSelectedRatio}
          />


        </View>
      </ScrollView>

      {/* Generate Bar */}
      <GenerateBar
        cost={2}
        balance={1402}
        onGenerate={handleGenerate}
        loading={isGenerating}
      />
    </CommonWarp>
  )
}

export default Studio
