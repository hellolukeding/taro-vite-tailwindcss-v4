

import { ScrollView, Text, View } from '@tarojs/components';
import { ModelCard } from '../ModelCard';

interface ResolutionSelectorProps {

  onSelect: (modelId: string) => void
}

const ResolutionSelector: React.FC<ResolutionSelectorProps> = (props) => {

  const resolutions = [
    {
      id: 'res_1', label: '1k', imgUrl: "https://i.urusai.cc/P9qD6.png", isVIP: false, isSelected: true
    },
    { id: 'res_2', label: '2k', imgUrl: "https://i.urusai.cc/P9qD6.png", isVIP: false, isSelected: false },
    { id: 'res_3', label: '4k', imgUrl: "https://i.urusai.cc/P9qD6.png", isVIP: false, isSelected: false },
  ]
  return (
    <View className='mt-8'>
      {/* Section Header */}
      <View className='flex justify-between items-end mb-5 px-1'>
        <Text className='text-lg font-bold flex items-center gap-2'>
          <View className='w-1.5 h-6 bg-black rounded-full'></View>
          选择模型
        </Text>
        {/* <Text className='text-xs font-bold text-black border-b-2 border-black pb-0.5'>
          查看全部
        </Text> */}
      </View>

      {/* Model Cards */}
      <ScrollView scrollX className='overflow-x-auto pb-4'>
        <View className='flex gap-4 px-1'>
          {resolutions.map((resolution) => (
            <ModelCard
              key={resolution.id}
              model={{
                id: resolution.id,
                name: resolution.label,
                imageUrl: resolution.imgUrl,
                isVIP: resolution.isVIP,
                isSelected: resolution.isSelected,
              }}
              onPress={() => props.onSelect(resolution.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ResolutionSelector;



