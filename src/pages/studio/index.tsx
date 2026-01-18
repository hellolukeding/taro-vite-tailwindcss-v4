import CommonWarp from '@/components/CommonWarp'
import { GenerateBar } from '@/components/business/GenerateBar'
import ImgUploader from '@/components/business/ImgUploader'
import { PromptInput } from '@/components/business/PromptInput'
import { RatioSelector } from '@/components/business/RatioSelector'
import ResolutionSelector from '@/components/business/ResolutionSelector'
import { StudioModelSelector } from '@/components/business/StudioModelSelector'
import { Icon } from '@/components/common/Icon'
import { mockPromptExamples, type MockModel } from '@/mock/studio'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { studioApi } from '@/api'
import { useUser } from '@/store'
import type { ModelInfo } from '@/types'

type ImageRatio = 'auto' | '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | '21:9' | '3:2' | '2:3' | '5:4' | '4:5'

interface StudioProps { }

const Studio: React.FC<StudioProps> = (props) => {
  const { requireLogin } = useAuth()
  const { userInfo } = useUser()
  const [prompt, setPrompt] = useState('')
  const [models, setModels] = useState<MockModel[]>([])
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>('auto')
  const [steps, setSteps] = useState(30)
  const [cfg, setCfg] = useState(7.5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [userCredits, setUserCredits] = useState(0)

  // 加载模型列表
  useEffect(() => {
    loadModels()
  }, [])

  // 当prompt、模型、比例变化时重新估算成本
  useEffect(() => {
    if (prompt && models.find(m => m.isSelected)) {
      estimateCost()
    }
  }, [prompt, selectedRatio, steps])

  const loadModels = async () => {
    try {
      const modelInfos: ModelInfo[] = await studioApi.getModels(true)
      const formattedModels: MockModel[] = modelInfos.map(model => ({
        id: model.model_id,
        name: model.name,
        imageUrl: model.icon,
        isVIP: model.is_vip,
        isSelected: false,
      }))
      setModels(formattedModels)
      // 不再自动选择模型，让用户主动选择
    } catch (error) {
      console.error('Load models error:', error)
      Taro.showToast({ title: '加载模型失败', icon: 'none' })
    }
  }

  // 获取分辨率（辅助函数）
  const getResolutionFromRatio = (ratio: ImageRatio): [number, number] => {
    const resolutionMap: Record<ImageRatio, [number, number]> = {
      'auto': [1024, 1024],
      '1:1': [1024, 1024],
      '3:4': [768, 1024],
      '4:3': [1024, 768],
      '16:9': [1344, 768],
      '9:16': [768, 1344],
      '21:9': [1536, 640],
      '3:2': [1152, 768],
      '2:3': [768, 1152],
      '5:4': [960, 1152],
      '4:5': [1152, 960],
    }
    return resolutionMap[ratio] || [1024, 1024]
  }

  // 成本估算
  const estimateCost = async () => {
    try {
      const selectedModel = models.find(m => m.isSelected)
      if (!selectedModel) return

      const [width, height] = getResolutionFromRatio(selectedRatio)

      const result = await studioApi.estimate({
        model_id: selectedModel.id,
        prompt: prompt,
        parameters: { width, height, steps }
      })

      setEstimatedCost(result.estimated_cost)
      setUserCredits(result.user_credits)

      if (!result.can_afford) {
        Taro.showToast({
          title: `积分不足，需要${result.estimated_cost}积分`,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('Estimate error:', error)
    }
  }

  // Handle model selection (需要登录)
  const handleModelSelect = (modelId: string) => {
    if (!requireLogin()) return

    setModels(prev => prev.map(model => ({
      ...model,
      isSelected: model.id === modelId
    })))
  }

  // Handle translate (需要登录)
  const handleTranslate = async () => {
    if (!requireLogin()) return

    if (!prompt.trim()) {
      Taro.showToast({ title: '请输入提示词', icon: 'none' })
      return
    }

    try {
      const result = await studioApi.translate(prompt)
      Taro.showModal({
        title: '翻译结果',
        content: `译文: ${result.translated}`,
        success: (res) => {
          if (res.confirm) setPrompt(result.translated)
        }
      })
    } catch (error) {
      console.error('Translate error:', error)
      Taro.showToast({ title: '翻译失败', icon: 'none' })
    }
  }

  // Handle random prompt
  const handleRandom = async () => {
    try {
      const result = await studioApi.getRandomPrompt()
      setPrompt(result.prompt)
    } catch (error) {
      console.error('Random prompt error:', error)
      // 如果API失败，使用本地示例
      const randomIndex = Math.floor(Math.random() * mockPromptExamples.length)
      setPrompt(mockPromptExamples[randomIndex])
    }
  }

  // Handle generate (需要登录)
  const handleGenerate = async () => {
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

    // 检查积分是否足够
    if (estimatedCost > userCredits) {
      Taro.showModal({
        title: '积分不足',
        content: '您的积分不足，是否前往充值？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/packageUser/pages/recharge/index' })
          }
        }
      })
      return
    }

    setIsGenerating(true)
    try {
      const [width, height] = getResolutionFromRatio(selectedRatio)

      const result = await studioApi.submitTask({
        model_id: selectedModel.id,
        prompt: prompt,
        parameters: { width, height, steps, cfg_scale: cfg }
      })

      Taro.redirectTo({
        url: `/pages/result/index?taskId=${result.task_id}`
      })
    } catch (error: any) {
      console.error('Submit task error:', error)
      Taro.showToast({
        title: error.message || '提交失败',
        icon: 'none'
      })
    } finally {
      setIsGenerating(false)
    }
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
        cost={estimatedCost}
        balance={userCredits}
        onGenerate={handleGenerate}
        loading={isGenerating}
      />
    </CommonWarp>
  )
}

export default Studio
