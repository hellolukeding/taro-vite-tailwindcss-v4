import { Uploader } from "@taroify/core"
import { getAuthToken } from "@/utils/storage"
import { studioApi } from "@/api/studio"
import { Button } from "@taroify/core"
import { Image, Text, View } from "@tarojs/components"
import { PhotoOutlined } from "@taroify/icons"
import Taro from "@tarojs/taro"
import { useState } from "react"
import type { Uploader as TaroUploader } from "@taroify/core"

interface ImgUploaderProps {
  value?: TaroUploader.File[]
  onChange?: (files: TaroUploader.File[]) => void
  maxCount?: number
}

const ImgUploader: React.FC<ImgUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 9
}) => {
  const [uploading, setUploading] = useState(false)
  const files = value

  // 处理选择图片并上传
  async function handleSelectImage() {
    if (uploading) return

    if (files.length >= maxCount) {
      Taro.showToast({ title: `最多只能上传${maxCount}张图片`, icon: "none" })
      return
    }

    try {
      // 使用Taro的chooseImage选择图片
      const res = await Taro.chooseImage({
        count: maxCount - files.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
      })

      if (!res.tempFilePaths || res.tempFilePaths.length === 0) return

      setUploading(true)
      Taro.showLoading({ title: `正在上传${res.tempFilePaths.length}张图片...` })

      // 获取token
      const token = await getAuthToken()
      if (!token) {
        Taro.hideLoading()
        Taro.showToast({ title: "请先登录", icon: "none" })
        setUploading(false)
        return
      }

      // 逐个上传图片到服务器
      const uploadPromises = res.tempFilePaths.map(async (filePath, index) => {
        try {
          const result = await studioApi.uploadImage(filePath, token)

          if (result.status === "success" && result.data) {
            // 上传成功，返回文件对象
            return {
              type: "image" as const,
              url: result.data.url,
              status: "completed" as const,
              name: result.data.filename || `image_${Date.now()}_${index}`,
            }
          } else {
            console.error("Upload failed:", result.message)
            return null
          }
        } catch (error: any) {
          console.error("Upload error:", error)
          return null
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      // 过滤掉上传失败的文件
      const successfulFiles = uploadedFiles.filter(f => f !== null) as TaroUploader.File[]

      Taro.hideLoading()

      // 更新文件列表
      if (successfulFiles.length > 0) {
        const newFiles = [...files, ...successfulFiles]
        onChange?.(newFiles)

        Taro.showToast({
          title: `成功上传${successfulFiles.length}张图片`,
          icon: "success"
        })
      } else {
        Taro.showToast({
          title: "上传失败，请重试",
          icon: "none"
        })
      }
    } catch (error: any) {
      console.error("Select image error:", error)
      // 用户取消选择图片时不显示错误
      if (error.errMsg && !error.errMsg.includes("cancel")) {
        Taro.showToast({
          title: "选择图片失败",
          icon: "none"
        })
      }
    } finally {
      setUploading(false)
      Taro.hideLoading()
    }
  }

  // 处理删除图片
  function handleDelete(index: number) {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onChange?.(newFiles)
  }

  return (
    <View className='bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-2'>
      <View className='flex justify-between items-center mb-3'>
        <Text className='text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1'>
          上传参考图片
        </Text>
        {files.length > 0 && (
          <Text className='text-xs text-gray-400'>
            {files.length}/{maxCount}
          </Text>
        )}
      </View>

      <View className='mb-3 text-xs text-gray-500'>
        上传后，AI将参考图片内容进行创作
      </View>

      {/* 图片预览区域 */}
      {files.length > 0 && (
        <View className='flex flex-wrap gap-2 mb-3'>
          {files.map((file, index) => (
            <View key={index} className='relative w-20 h-20 rounded-lg overflow-hidden'>
              <Image
                src={file.url}
                className='w-full h-full'
                mode='aspectFill'
              />
              {!uploading && (
                <View
                  className='absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-bl'
                  onClick={() => handleDelete(index)}
                >
                  <Text className='text-white text-xs'>×</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 上传按钮 */}
      {files.length < maxCount && (
        <Button
          icon={<PhotoOutlined />}
          size='small'
          color='primary'
          disabled={uploading}
          onClick={handleSelectImage}
          className='w-full'
        >
          {uploading ? '上传中...' : '选择图片'}
        </Button>
      )}
    </View>
  )
}

export default ImgUploader
