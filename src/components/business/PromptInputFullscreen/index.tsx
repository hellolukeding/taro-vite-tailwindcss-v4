import CommonHeader from '@/components/CommonHeader'
import Button from '@taroify/core/button/button'
import { ScrollView, Text, Textarea, View } from '@tarojs/components'
import { FC, useState } from 'react'
import './index.scss'

export interface PromptInputFullscreenProps {
  value: string
  onChange: (value: string) => void
  onTranslate?: () => void
  onRandom?: () => void
  placeholder?: string
  onFullscreenChange?: (isFullscreen: boolean) => void  // 新增：全屏状态变化回调
}

/**
 * PromptInputFullscreen 全屏提示词输入组件
 *
 * 支持全屏编辑模式，提供更好的输入体验
 *
 * @param value - 输入内容
 * @param onChange - 内容变化回调
 * @param onTranslate - 中译英按钮回调
 * @param onRandom - 随机提示词按钮回调
 * @param placeholder - 占位文字
 */
export const PromptInputFullscreen: FC<PromptInputFullscreenProps> = ({
  value,
  onChange,
  onTranslate,
  onRandom,
  placeholder = '描述你想生成的图片...',
  onFullscreenChange  // 新增：全屏状态变化回调
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenValue, setFullscreenValue] = useState(value)

  // 打开全屏
  const handleOpenFullscreen = () => {
    setFullscreenValue(value)
    setIsFullscreen(true)
    onFullscreenChange?.(true)  // 通知外部组件：全屏已打开
  }

  // 关闭全屏（不保存）
  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
    onFullscreenChange?.(false)  // 通知外部组件：全屏已关闭
  }

  // 确认并保存
  const handleConfirm = () => {
    onChange(fullscreenValue)
    setIsFullscreen(false)
    onFullscreenChange?.(false)  // 通知外部组件：全屏已关闭
  }

  // 清除内容
  const handleClear = () => {
    setFullscreenValue('')
  }

  // 预览文字（显示前150个字符）
  const previewText = value
    ? value.length > 150
      ? value.substring(0, 150) + '...'
      : value
    : placeholder

  return (
    <>
      {/* 普通模式 - 简化的输入框 */}
      <View className='prompt-input-compact bg-white rounded-2xl px-4 py-6 shadow-lg border border-gray-100' onClick={handleOpenFullscreen}>
        <View className='prompt-input-header'>
          <Text className='text-sm font-bold text-black uppercase tracking-wider'>
            提示词
          </Text>
        </View>

        <View className='prompt-input-description mb-3'>
          <Text className='text-sm text-gray-500'>
            描述你想生成的图片内容
          </Text>
        </View>

        <View className='prompt-input-preview'>
          <Text className={value ? 'preview-text' : 'preview-placeholder'}>
            {previewText}
          </Text>
          {!value && (
            <View className='edit-hint'>
              <Text className='edit-hint-text'>✏️ 点击开始编辑</Text>
            </View>
          )}
        </View>

        <View className='prompt-input-footer'>
          <Text className='text-sm text-gray-400'>💡 点击卡片展开编辑</Text>
          <Text className='text-sm text-gray-400'>{value.length} 字</Text>
        </View>
      </View>

      {/* 全屏编辑模式 */}
      {isFullscreen && (
        <View className='prompt-input-fullscreen'>
          <CommonHeader title='编辑提示词' withBack={false}>
            <View className='flex items-center justify-end px-4 py-2'>
              {fullscreenValue && (
                <View
                  className='flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full'
                  onClick={handleClear}
                >
                  <Text className='text-sm text-gray-600'>×</Text>
                  <Text className='text-xs text-gray-600'>清除</Text>
                </View>
              )}
            </View>
          </CommonHeader>

          <View className='fullscreen-scroll-area'>
            <ScrollView
              scrollY
              className='fullscreen-content'
              scrollWithAnimation
            >
              <View className='content-wrapper'>
                <Textarea
                  className='fullscreen-input'
                  placeholder={placeholder}
                  value={fullscreenValue}
                  onInput={(e) => setFullscreenValue(e.detail.value)}
                  focus
                  adjustPosition
                  maxlength={-1}
                  autoHeight={false}
                  style={{ minHeight: '400px' }}
                />

                <View className='fullscreen-tips'>
                  <Text className='tips-text'>
                    💡 提示：详细描述能获得更好的生成效果
                  </Text>
                </View>

                <View className='fullscreen-info'>
                  <View className='info-item'>
                    <Text className='info-label'>字数统计</Text>
                    <Text className='info-value'>{fullscreenValue.length} 字</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* 底部按钮区域 */}
          <View className='fullscreen-footer flex items-center justify-between'>
            <Button
              variant="outlined"
              style={{
                borderColor: "#e5e7eb",
                color: "#6b7280"
              }}
              shape="round"
              className='fullscreen-cancel-btn flex-1 mr-2'
              onClick={handleCloseFullscreen}
            >
              <Text className='fullscreen-btn-text'>取消</Text>
            </Button>

            <Button
              variant="contained"
              style={{
                background: "#000",
                color: "#fff"
              }}
              shape="round"
              className='fullscreen-confirm-btn flex-1 ml-2'
              onClick={handleConfirm}
            >
              <Text className='fullscreen-btn-text'>完成</Text>
            </Button>
          </View>
        </View>
      )}
    </>
  )
}
