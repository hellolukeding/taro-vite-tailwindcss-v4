import { Image, Text, View } from "@tarojs/components";
import CusCard from "../CusCard";


interface RobotStatusCardProps { }

const RobotStatusCard: React.FC<RobotStatusCardProps> = (props) => {
  return (
    <CusCard title='机器人状态'>
      <View className='w-full flex items-center justify-between my-2'>
        {
          status.map(item => {

            return (
              <View className='flex items-center my-2' key={item.name}>
                <Image src={item.icon} className='w-6 h-6 mr-2' />
                <View className='text-sm'>{item.name}</View>
              </View>
            )
          })}
      </View>

      <View className='bg-gray-300 w-full h-40 rounded-xl my-2'>

      </View>

      <Text className=' text-sm text-gray-700'>当前位置：操场西侧</Text>
    </CusCard>

  );
};

export default RobotStatusCard;

/*------------------------------------------------------------------------------------------*/

const status = [
  {
    name: "状态",
    icon: "https://api.iconify.design/majesticons:status-online.svg"
  },
  {
    name: "电量",
    icon: "https://api.iconify.design/material-symbols:battery-full-rounded.svg"
  },
  {
    name: "巡逻",
    icon: "https://api.iconify.design/carbon:3d-curve-auto-colon.svg"
  }
]
