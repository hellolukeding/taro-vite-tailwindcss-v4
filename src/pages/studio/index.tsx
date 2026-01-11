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
    <View className='studio-page'>
      {/* 黑色头部 */}
      <View className='studio-header'>
        {/* 顶部导航 */}
        <View className='header-nav'>
          <View className='nav-left'>
            <Icon name='arrow_back_ios' size={24} color='#FFFFFF' />
            <Text className='page-title'>创作工坊</Text>
          </View>
          <View className='nav-right'>
            <View className='icon-btn-bg'>
              <Icon name='history' size={20} color='#FFFFFF' />
            </View>
            <Image
              src={mockUser.avatar}
              className='user-avatar'
              mode='aspectFill'
            />
          </View>
        </View>

        {/* Prompt输入区 */}
        <View className='prompt-section'>
          <View className='prompt-header'>
            <View className='prompt-title'>
              <Icon name='edit_note' size={16} color='#000000' />
              <Text>提示词</Text>
            </View>
            <View className='translate-btn'>
              <Icon name='translate' size={12} color='#FFFFFF' />
              <Text>中译英</Text>
            </View>
          </View>
          <Input
            className='prompt-input'
            placeholder='描述你想生成的图片... (例如: 一个未来城市的街道，霓虹灯光，8k分辨率)'
            value={prompt}
            onInput={(e) => setPrompt(e.detail.value)}
          />
          <View className='random-btn'>
            <Icon name='casino' size={14} color='#000000' />
            <Text>随机</Text>
          </View>
        </View>
      </View>

      {/* 主内容区域 */}
      <ScrollView scrollY className='studio-content'>
        {/* 模型选择 */}
        <View className='section'>
          <View className='section-header'>
            <View className='section-title'>
              <View className='title-bar' />
              <Text>选择模型</Text>
            </View>
            <Text className='view-all'>查看全部</Text>
          </View>
          <ScrollView scrollX className='model-scroll'>
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
        <View className='section'>
          <View className='section-title-single'>
            <View className='title-bar' />
            <Text>图片比例</Text>
          </View>
          <View className='ratio-grid'>
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
        <View className='section'>
          <View
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='advanced-settings'
          >
            <View className='settings-header'>
              <View className='settings-title'>
                <Icon name='tune' size={20} color='#000000' />
                <Text>高级设置</Text>
              </View>
              <Icon
                name='expand_more'
                size={20}
                color='#000000'
                className={`expand-icon ${showAdvanced ? 'expanded' : ''}`}
              />
            </View>

            {showAdvanced && (
              <View className='settings-content'>
                <View className='settings-body'>
                  {/* 步数滑块 */}
                  <View className='slider-group'>
                    <View className='slider-header'>
                      <Text className='slider-label'>步数</Text>
                      <Text className='slider-value'>{steps}</Text>
                    </View>
                    <input
                      type='range'
                      min='10'
                      max='50'
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className='slider-input'
                    />
                  </View>

                  {/* CFG滑块 */}
                  <View className='slider-group'>
                    <View className='slider-header'>
                      <Text className='slider-label'>提示词引导 (CFG)</Text>
                      <Text className='slider-value'>{cfgScale}</Text>
                    </View>
                    <input
                      type='range'
                      min='1'
                      max='20'
                      step='0.5'
                      value={cfgScale}
                      onChange={(e) => setCfgScale(Number(e.target.value))}
                      className='slider-input'
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部生成栏 */}
      <View className='generate-bar'>
        <View className='generate-content'>
          {/* 消耗积分 */}
          <View className='cost-info'>
            <Text className='cost-label'>预计消耗</Text>
            <View className='cost-value'>
              <Icon name='bolt' size={16} color='#FBBF24' filled />
              <Text>2</Text>
            </View>
          </View>

          <View className='divider' />

          {/* 余额 */}
          <View className='balance-info'>
            <Text className='cost-label'>余额</Text>
            <Text className='balance-value'>{mockUser.credits}</Text>
          </View>

          {/* 立即生成按钮 */}
          <View className='generate-btn'>
            <Icon name='auto_awesome' size={20} color='#FFFFFF' />
            <Text>立即生成</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
