
import { ChatOutlined, SettingOutlined } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import NaviBar from "../NaviBar";
import NavMsg from "../NavMsg";
import NavTask from "../NavTask";
import RobotCtrl from "../RobotCtrl";
import RobotStatusCard from "../RobotStatusCard";


interface HomePageProps { }

const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <NaviBar value='首页'>
      <View className='w-full h-full overflow-auto pt-24 text-white '>
        <View className='w-full flex items-center '>
          <Image src='https://i.urusai.cc/OyAmE.png' className='w-16 h-16 rounded-xl shadow' />

          <View className='h-16 flex flex-col justify-end ml-4'>
            <Text className='text-sm  rounded-4xl   w-30 '>欢迎你
            </Text>
            <Text className='text-xl font-bold'>
              李老师！
            </Text>
          </View>

          <View className='flex-1 flex items-center justify-end'>
            <View className='w-16 h-16 flex items-center justify-center bg-gray-200 rounded-xl ml-2'>
              <ChatOutlined size={25} style={{ color: "#000" }} />
            </View>

            <View className='w-16 h-16 flex items-center justify-center bg-gray-200 rounded-xl ml-2'>
              <SettingOutlined size={25} style={{ color: "#000" }} />
            </View>
          </View>

        </View>

        <View className='w-full  h-[calc(100%-5rem)]  overflow-auto mt-4'>

          <RobotStatusCard />

          <RobotCtrl />

          <NavTask />

          <NavMsg />
        </View>
      </View>

    </NaviBar>
  );
};

export default HomePage;
