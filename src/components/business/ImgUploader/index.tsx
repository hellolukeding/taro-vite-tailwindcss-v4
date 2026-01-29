import { studioApi } from "@/api/studio"
import { getAuthToken } from "@/utils/storage"
import type { Uploader as TaroUploader } from "@taroify/core"
import { Uploader } from "@taroify/core"
import { Text, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useState } from "react"

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
  async function handleUpload() {
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

      // 创建带上传状态的文件对象
      const uploadingFiles = res.tempFilePaths.map((filePath) => ({
        type: "image" as const,
        url: filePath,
        status: "uploading" as const,
        message: "上传中...",
      }))

      // 先添加显示上传中的状态
      const newFiles = [...files, ...uploadingFiles]
      onChange?.(newFiles)

      // 逐个上传图片到服务器
      const uploadPromises = res.tempFilePaths.map(async (filePath, index) => {
        try {
          const uploadedData = await studioApi.uploadImage(filePath, token)

          // 上传成功，返回文件对象
          console.log(`[ImgUploader] Image ${index} uploaded successfully:`, uploadedData)
          return {
            type: "image" as const,
            url: uploadedData.url,
            status: "completed" as const,
            name: uploadedData.filename || `image_${Date.now()}_${index}`,
          }
        } catch (error: any) {
          console.error(`[ImgUploader] Image ${index} upload failed:`, error)
          return {
            type: "image" as const,
            url: filePath,
            status: "failed" as const,
            message: error.message || "上传失败",
          }
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      Taro.hideLoading()

      // 更新文件列表 - 替换上传中的文件为最终状态
      const finalFiles = [
        ...files,
        ...uploadedFiles
      ]
      onChange?.(finalFiles)

      // 统计成功数量
      const successCount = uploadedFiles.filter(f => f.status === "completed").length
      if (successCount > 0) {
        Taro.showToast({
          title: `成功上传${successCount}张图片`,
          icon: "success"
        })
      }
    } catch (error: any) {
      console.error("Upload error:", error)
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

  return (
    <View className='bg-white rounded-2xl px-2 py-5 shadow-lg border border-gray-100 mb-2'>
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

      <Uploader
        value={files}
        multiple
        maxFiles={maxCount}
        onUpload={handleUpload}
        onChange={onChange}
        disabled={uploading}
      />
    </View>
  )
}

export default ImgUploader
