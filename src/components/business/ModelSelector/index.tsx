import { Image, ScrollView, Text, View } from '@tarojs/components'
import React from 'react'
import type { ModelInfo } from '@/types'
import './index.css'

interface ModelSelectorProps {
  models: ModelInfo[]
  selectedModelId: string
  isVIP: boolean
  onSelect: (model: ModelInfo) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  isVIP,
  onSelect
}) => {
  return (
    <ScrollView scrollX className='model-selector'>
      <View className='model-selector-container'>
        {models.map((model) => {
          const isVipModel = model.is_vip
          const canSelect = !isVipModel || isVIP
          const isSelected = model.model_id === selectedModelId

          return (
            <View
              key={model.model_id}
              className={`model-item ${!canSelect ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => canSelect && onSelect(model)}
            >
              <View className='model-card'>
                <Image
                  src={model.icon}
                  className='model-icon'
                  mode='aspectFill'
                />
                <View className='model-name'>{model.name}</View>
                {isVipModel && (
                  <View className='vip-badge'>VIP</View>
                )}
              </View>
              <View className='model-cost'>
                <Text className='cost-text'>{model.cost_per_image}积分</Text>
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default ModelSelector
