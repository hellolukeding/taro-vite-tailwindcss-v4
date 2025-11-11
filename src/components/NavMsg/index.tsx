import { Button } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import CusCard from "../CusCard";

interface NavMsgProps { }

const NavMsg: React.FC<NavMsgProps> = (props) => {
  return (
    <CusCard title={
      <View className='flex items-center justify-between'>
        <Text>异常事件速览</Text>

        <Button variant='text' color='success'>
          查看更多
        </Button>
      </View>
    }
    >
      <View className='w-full flex justify-between items-center mt-4'>
        {
          tabs.map(item => {

            return (
              <View className='flex flex-col items-center px-8 py-2 rounded-xl' key={item.title} style={{
                backgroundColor: item.fillColor
              }}
              >
                <Image src={item.icon} className='w-10 h-10 mb-1' />
                <Text className='font-medium text-sm'>{item.title}</Text>
              </View>
            )
          })
        }
      </View>

      <View className='w-full'>
        {
          msgs.slice(0, 5).map(item => {

            return (
              <View key={item.time} className='w-full flex items-center justify-between py-3 border-b border-gray-200'>
                <View className='flex items-center'>
                  <Image src={item.icon} className='w-6 h-6 mr-3' />
                  <View className='flex flex-col'>
                    <Text className='font-medium'>{item.title}</Text>
                    <Text className='text-sm text-gray-600'>{item.desc}</Text>
                  </View>
                </View>

                <Text className='text-sm text-gray-500'>{item.time}</Text>
              </View>
            )
          })
        }

      </View>
    </CusCard>
  );
};

export default NavMsg;


const tabs = [
  {
    title: "报警",
    icon: "https://api.iconify.design/material-symbols:release-alert-outline.svg",
    color: "#f00",
    fillColor: "#ffcccc"
  },
  {
    title: "异常",
    icon: "https://api.iconify.design/lsicon:wifi-abnormal-filled.svg",
    color: "#ff9800",
    fillColor: "#ffe0b2"
  },
  {
    title: "求助",
    icon: "https://api.iconify.design/mdi:help-circle-outline.svg",
    color: "#ffeb3b",
    fillColor: "#fff9c4"
  }
]

const msgs = [
  {
    title: "报警",
    time: "10:30",
    desc: "机器人在教学楼附近发现异常情况",
    icon: "https://api.iconify.design/material-symbols:release-alert-outline.svg",
  },
  {
    title: "异常",
    time: "11:00",
    desc: "机器人在操场附近发现异常情况",
    icon: "https://api.iconify.design/lsicon:wifi-abnormal-filled.svg",
  },
  {
    title: "求助",
    time: "11:30",
    desc: "机器人在图书馆附近请求人工协助",
    icon: "https://api.iconify.design/mdi:help-circle-outline.svg",
  },
  {
    title: "报警",
    time: "12:00",
    desc: "机器人在食堂附近发现异常情况",
    icon: "https://api.iconify.design/material-symbols:release-alert-outline.svg",
  },
  {
    title: "异常",
    time: "12:30",
    desc: "机器人在宿舍楼附近发现异常情况",
    icon: "https://api.iconify.design/lsicon:wifi-abnormal-filled.svg",
  }
]
