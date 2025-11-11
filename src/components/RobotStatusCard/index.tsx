import { Image, Text, View } from "@tarojs/components";
import CusCard from "../CusCard";
import MapComponent from "../MapComponent";


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

      <View className='bg-gray-300 w-full h-40 rounded-xl my-2 overflow-hidden'>
        <MapComponent
          latitude={30.204556156324941}  // 从后端获取的机器人纬度（杭州）
          longitude={120.27277612295666} // 从后端获取的机器人经度（杭州）
          coordType='WGS84'  // 🔧 尝试 WGS84（GPS原始坐标）
          enableAmap  // 启用高德地图 SDK
          markers={[
            {
              id: 1,
              latitude: 30.204556156324941,
              longitude: 120.27277612295666,
              iconPath: 'https://api.iconify.design/streamline-plump:dog-1-solid.svg',
              width: 30,
              height: 30,
            }
          ]}
        />
      </View>

      <Text className=' text-sm text-gray-700'>当前位置：操场西侧（请查看控制台坐标转换日志）</Text>
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
