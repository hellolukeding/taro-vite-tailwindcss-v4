import { Button, Card } from '@/components/common'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface PromptDetail {
  id: number
  title: string
  desc: string
  model: string
  prompts: string[]
  examples: string[]
  tags: string[]
  likes: number
  comments: number
  author: string
  avatar: string
}

export default function PromptDetail() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<PromptDetail>({
    id: 1,
    title: "小红书爆款文案",
    desc: "帮你写出吸引人的种草文案，提升转化率",
    model: "GPT-4",
    prompts: [
      "你是一个专业的小红书文案助手",
      "根据产品特点生成吸引人的标题",
      "使用emoji增加趣味性",
      "包含行动号召"
    ],
    examples: [
      "https://img.yzcdn.cn/vant/cat.jpg",
      "https://img.yzcdn.cn/vant/dog.jpg"
    ],
    tags: ["文案", "营销", "小红书"],
    likes: 128,
    comments: 45,
    author: "AI助手",
    avatar: "https://img.yzcdn.cn/vant/cat.jpg"
  })

  useLoad(() => {
    const params = router.params
    console.log('Prompt detail params:', params)
    // TODO: 根据ID获取详情
  })

  // 使用提示词
  const handleUsePrompt = async () => {
    setLoading(true)
    try {
      // TODO: 调用API创建任务
      console.log('Use prompt:', detail)

      Taro.showToast({ title: '任务已创建', icon: 'success' })

      // 跳转到任务页面
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } catch (error) {
      console.error('Error:', error)
      Taro.showToast({ title: '操作失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 收藏提示词
  const handleCollect = async () => {
    try {
      // TODO: 调用收藏API
      console.log('Collect prompt:', detail.id)
      Taro.showToast({ title: '已收藏', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '收藏失败', icon: 'error' })
    }
  }

  // 分享提示词
  const handleShare = async () => {
    try {
      // TODO: 调用分享API
      console.log('Share prompt:', detail.id)
      Taro.showToast({ title: '分享功能开发中', icon: 'none' })
    } catch (error) {
      Taro.showToast({ title: '分享失败', icon: 'error' })
    }
  }

  return (
    <View className='min-h-screen bg-gray-50'>
      {/* 顶部导航 */}
      <View className='bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-3 safe-area-top'>
        <View className='flex items-center justify-between'>
          <Text className='text-lg font-bold text-gray-800'>提示词详情</Text>
          <View className='flex gap-3'>
            <Text className='text-gray-600' onClick={handleShare}>分享</Text>
            <Text className='text-gray-600' onClick={handleCollect}>收藏</Text>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1' scrollY>
        {/* 基本信息 */}
        <Card className='m-4 mb-2' padding='p-5'>
          <View className='flex items-start gap-3 mb-4'>
            <Image
              src={detail.avatar}
              className='w-12 h-12 rounded-full'
              mode='aspectFill'
            />
            <View className='flex-1'>
              <Text className='text-lg font-bold text-gray-800 block mb-1'>
                {detail.title}
              </Text>
              <Text className='text-sm text-gray-500 block'>
                作者: {detail.author}
              </Text>
            </View>
          </View>

          <Text className='text-gray-700 text-sm leading-relaxed mb-4 block'>
            {detail.desc}
          </Text>

          <View className='flex gap-2 flex-wrap mb-3'>
            {detail.tags.map((tag, index) => (
              <View key={index} className='px-3 py-1 bg-theme-primary/10 rounded-full'>
                <Text className='text-xs text-theme-primary font-medium'>{tag}</Text>
              </View>
            ))}
          </View>

          <View className='flex items-center gap-4 text-sm text-gray-500'>
            <View className='flex items-center gap-1'>
              <Text>❤️</Text>
              <Text>{detail.likes}</Text>
            </View>
            <View className='flex items-center gap-1'>
              <Text>💬</Text>
              <Text>{detail.comments}</Text>
            </View>
            <View className='flex items-center gap-1'>
              <Text>🤖</Text>
              <Text>{detail.model}</Text>
            </View>
          </View>
        </Card>

        {/* 提示词内容 */}
        <Card title='提示词内容' className='m-4 mb-2'>
          <View className='space-y-2'>
            {detail.prompts.map((prompt, index) => (
              <View key={index} className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
                <Text className='text-sm text-gray-700 leading-relaxed'>
                  {index + 1}. {prompt}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* 示例图片 */}
        {detail.examples.length > 0 && (
          <Card title='示例效果' className='m-4 mb-2'>
            <View className='space-y-3'>
              {detail.examples.map((example, index) => (
                <View key={index} className='rounded-lg overflow-hidden bg-gray-100'>
                  <Image
                    src={example}
                    className='w-full'
                    mode='widthFix'
                    style={{ minHeight: '200px' }}
                  />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* 使用说明 */}
        <Card title='使用说明' className='m-4 mb-20'>
          <View className='space-y-3'>
            <View className='flex items-start gap-2'>
              <Text className='text-theme-primary font-bold mt-0.5'>1.</Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                点击下方"立即使用"按钮，系统将自动创建生成任务
              </Text>
            </View>
            <View className='flex items-start gap-2'>
              <Text className='text-theme-primary font-bold mt-0.5'>2.</Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                可以在"我的"页面查看任务进度和生成结果
              </Text>
            </View>
            <View className='flex items-start gap-2'>
              <Text className='text-theme-primary font-bold mt-0.5'>3.</Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                建议根据实际需求调整提示词内容以获得最佳效果
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom px-4 py-3'>
        <Button
          block
          loading={loading}
          onClick={handleUsePrompt}
          className='shadow-lg'
        >
          立即使用
        </Button>
      </View>
    </View>
  )
}
