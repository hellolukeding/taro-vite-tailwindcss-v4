import { studioApi } from '@/api'
import { normalizeUrl } from '@/utils/url'
import { getAuthToken } from '@/utils/storage'
import { Add, Close, PhotoOutlined } from '@taroify/icons'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'

interface TicketImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxCount?: number
}

export function TicketImageUploader({ images, onChange, maxCount = 4 }: TicketImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  // 选择图片
  const handleChooseImage = async () => {
    if (images.length >= maxCount) {
      Taro.showToast({
        title: `最多上传${maxCount}张图片`,
        icon: 'none'
      })
      return
    }

    try {
      const res = await Taro.chooseImage({
        count: maxCount - images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      const tempFilePaths = res.tempFilePaths

      // 上传所有选中的图片
      setUploading(true)
      const uploadPromises = tempFilePaths.map((filePath) => uploadImage(filePath))
      const uploadResults = await Promise.all(uploadPromises)

      // 筛选出上传成功的图片
      const successUrls = uploadResults.filter((url): url is string => url !== null)

      if (successUrls.length > 0) {
        onChange([...images, ...successUrls])
        Taro.showToast({
          title: `成功上传${successUrls.length}张`,
          icon: 'success'
        })
      }

      if (uploadResults.some((result) => result === null)) {
        Taro.showToast({
          title: '部分图片上传失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('选择图片失败:', error)
    } finally {
      setUploading(false)
    }
  }

  // 上传单张图片
  const uploadImage = async (filePath: string): Promise<string | null> => {
    try {
      const token = await getAuthToken()
      if (!token) {
        throw new Error('未登录')
      }

      console.log('[上传图片] 开始上传:', filePath)

      const uploadedData = await studioApi.uploadImage(filePath, token)

      console.log('[上传图片] 上传结果:', uploadedData)

      // uploadImage 现在直接返回 {url, id, filename}，url 已经是完整的
      return uploadedData.url
    } catch (error: any) {
      console.error('[上传图片] 异常:', error)
      Taro.showToast({
        title: error?.message || '上传失败',
        icon: 'none'
      })
      return null
    }
  }

  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  // 预览图片
  const handlePreviewImage = (index: number) => {
    Taro.previewImage({
      current: images[index],
      urls: images
    })
  }

  return (
    <View className='space-y-2'>
      {/* 图片列表 */}
      <View className='flex flex-wrap gap-2'>
        {images.map((imageUrl, index) => (
          <View key={index} className='relative w-20 h-20 rounded-xl overflow-hidden shadow-sm'>
            <Image
              src={imageUrl}
              className='w-full h-full'
              mode='aspectFill'
              lazyLoad
              onClick={() => handlePreviewImage(index)}
            />
            <View
              className='absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center'
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage(index)
              }}
            >
              <Close size={12} color='#fff' />
            </View>
          </View>
        ))}

        {/* 上传按钮 */}
        {images.length < maxCount && (
          <View
            className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${
              uploading
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 bg-gray-50 active:bg-gray-100'
            }`}
            onClick={uploading ? undefined : handleChooseImage}
          >
            {uploading ? (
              <Text className='text-gray-400 text-xs'>上传中...</Text>
            ) : (
              <>
                <Add size={24} color='#9CA3AF' />
                <Text className='text-gray-400 text-xs mt-1'>添加</Text>
              </>
            )}
          </View>
        )}
      </View>

      {/* 提示文字 */}
      <Text className='text-xs text-gray-400'>
        {images.length > 0 ? `已上传 ${images.length}/${maxCount} 张` : `最多上传 ${maxCount} 张截图`}
      </Text>
    </View>
  )
}
