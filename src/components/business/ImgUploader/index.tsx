import { Uploader } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";


interface ImgUploaderProps {
  value?: Uploader.File[]
  onChange?: (files: Uploader.File[]) => void
  maxCount?: number
}

const ImgUploader: React.FC<ImgUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 9
}) => {
  const files = value

  function onUpload() {
    const remainingCount = maxCount - files.length
    if (remainingCount <= 0) {
      Taro.showToast({ title: `最多上传${maxCount}张图片`, icon: 'none' })
      return
    }

    Taro.chooseImage({
      count: remainingCount,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({ tempFiles }) => {
      const newFiles = [
        ...files,
        ...tempFiles.map(({ path, type, originalFileObj }) => ({
          type,
          url: path,
          name: originalFileObj?.name,
        })),
      ]
      onChange?.(newFiles)
    })
  }

  function handleChange(newFiles: Uploader.File[]) {
    onChange?.(newFiles)
  }
  return (
    <View className='bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-2'>
      <View className='flex justify-between items-center mb-3'>
        <Text className='text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1'>
          上传参考图片
        </Text>
      </View>


      <View className='mb-3 text-xs text-gray-500'>
        上传后，AI将参考图片内容进行创作
      </View>

      <Uploader value={files} multiple onUpload={onUpload} onChange={handleChange} />
    </View>
  );
};

export default ImgUploader;
