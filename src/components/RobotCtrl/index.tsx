import { Image, Text, View } from "@tarojs/components";


interface RobotCtrlProps { }

const RobotCtrl: React.FC<RobotCtrlProps> = (props) => {
  return (
    <View className='w-full h-20 p-4   rounded-xl flex bg-[#a8e6cf] items-center justify-between'>
      {funcs.map(item => {

        return (
          <View key={item.name} className='flex flex-col items-center py-2'>
            <Image src={item.icon} className='w-10 h-10 mb-2' />
            <Text className='text-sm text-gray-600'>{item.name}</Text>
          </View>
        )
      })}
    </View>
  );
};

export default RobotCtrl;


export const funcs = [
  {
    name: "暂停巡逻",
    icon: "https://api.iconify.design/material-symbols:pause.svg"
  },
  {
    name: "返回充电",
    icon: "https://api.iconify.design/streamline-ultimate:charger-1.svg"
  },
  {
    name: "开始广播",
    icon: "https://api.iconify.design/fa7-solid:broadcast-tower.svg"
  }
]
