import { Button, Card, Input } from '@/components/common'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React, { useState } from 'react'

const AddPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prompts, setPrompts] = useState([''])
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    console.log('Create prompt page loaded')
  })

  // 添加提示词行
  const addPromptLine = () => {
    setPrompts([...prompts, ''])
  }

  // 更新提示词
  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  // 删除提示词行
  const removePromptLine = (index: number) => {
    if (prompts.length > 1) {
      const newPrompts = prompts.filter((_, i) => i !== index)
      setPrompts(newPrompts)
    }
  }

  // 提交创建
  const handleSubmit = async () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' })
      return
    }

    const validPrompts = prompts.filter(p => p.trim())
    if (validPrompts.length === 0) {
      Taro.showToast({ title: '请输入提示词内容', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        prompts: validPrompts,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        is_public: true
      }

      console.log('Creating prompt:', payload)
      // TODO: 调用创建API

      Taro.showToast({ title: '创建成功', icon: 'success' })

      // 清空表单
      setTitle('')
      setDescription('')
      setPrompts([''])
      setTags('')

      // 跳转到广场
      setTimeout(() => {
        // 这里可以跳转到详情页或返回广场
      }, 1000)
    } catch (error) {
      console.error('Create error:', error)
      Taro.showToast({ title: '创建失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* 顶部标题 */}
      <View className='bg-white px-4 py-4 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-800'>创建提示词</Text>
        <Text className='text-sm text-gray-500 mt-1'>打造属于你的专属提示词模板</Text>
      </View>

      <ScrollView className='flex-1' scrollY>
        <View className='p-4 space-y-4 pb-24'>
          {/* 基本信息 */}
          <Card title='基本信息' padding='p-4'>
            <Input
              label='标题'
              placeholder='请输入提示词标题'
              value={title}
              onChange={setTitle}
              required
              className='mb-4'
            />
            <Input
              label='描述'
              placeholder='简要描述提示词的用途'
              value={description}
              onChange={setDescription}
              className='mb-2'
            />
          </Card>

          {/* 提示词内容 */}
          <Card title='提示词内容' padding='p-4'>
            <View className='space-y-3'>
              {prompts.map((prompt, index) => (
                <View key={index} className='flex gap-2 items-start'>
                  <View className='flex-1'>
                    <Input
                      placeholder={`提示词 ${index + 1}`}
                      value={prompt}
                      onChange={(value) => updatePrompt(index, value)}
                      className='w-full'
                    />
                  </View>
                  {prompts.length > 1 && (
                    <Button
                      type='outline'
                      size='small'
                      onClick={() => removePromptLine(index)}
                      className='mt-1 px-2'
                    >
                      删除
                    </Button>
                  )}
                </View>
              ))}
              <Button
                type='outline'
                size='small'
                onClick={addPromptLine}
                className='w-full'
              >
                + 添加提示词行
              </Button>
            </View>
          </Card>

          {/* 标签设置 */}
          <Card title='标签设置' padding='p-4'>
            <Input
              label='标签'
              placeholder='请输入标签，用逗号分隔（如：文案,营销,小红书）'
              value={tags}
              onChange={setTags}
              className='mb-2'
            />
            <Text className='text-xs text-gray-500'>
              标签有助于用户更好地找到你的提示词
            </Text>
          </Card>

          {/* 使用说明 */}
          <Card title='使用说明' padding='p-4'>
            <View className='space-y-2'>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                • 提示词内容越详细，生成效果越好
              </Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                • 可以添加多个提示词行来构建复杂的提示
              </Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                • 添加合适的标签能提高曝光率
              </Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                • 创建后可在"我的"页面管理你的提示词
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom px-4 py-3'>
        <Button
          block
          loading={loading}
          onClick={handleSubmit}
          className='shadow-lg'
        >
          创建提示词
        </Button>
      </View>
    </View>
  )
}

export default AddPage
