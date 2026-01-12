import { Image, View, Button } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'

interface PromptDetailHeroProps {
  imageUrl: string
  onFullscreen?: () => void
}

export function PromptDetailHero({ imageUrl, onFullscreen }: PromptDetailHeroProps) {
  return (
    <View className='w-full relative bg-gray-800'>
      <View className='w-full aspect-[4/5] bg-gray-800 relative overflow-hidden'>
        {/* Main Image */}
        <Image
          src={imageUrl}
          className='w-full h-full'
          mode='aspectFill'
        />

        {/* Fullscreen Button */}
        {onFullscreen && (
          <View className='absolute top-4 right-4'>
            <Button
              onClick={onFullscreen}
              className='bg-black/40 backdrop-blur-md !p-2 rounded-full border border-white/10'
              style={{ padding: '8px' }}
            >
              <Icon name='fullscreen' size={20} color='white' />
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}
