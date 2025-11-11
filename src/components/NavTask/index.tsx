import { Button } from "@taroify/core";
import { FlagOutlined, Passed, UnderwayOutlined } from "@taroify/icons";
import { Text, View } from "@tarojs/components";
import CusCard from "../CusCard";

interface NavTaskProps { }

const NavTask: React.FC<NavTaskProps> = (props) => {
  return (
    <CusCard title={
      <View className='flex items-center justify-between'>
        <Text>巡逻任务</Text>

        <Button variant='text' color='success'>
          查看更多
        </Button>
      </View>
    }
    >
      <View className='w-full max-h-60'>
        {
          timeline.slice(0, 3).map(item => {

            return (
              <View key={item.title} className='w-full flex items-center justify-between py-2 '>
                <View className='flex flex-col items-start'>
                  <Text className='font-medium'>{item.title}</Text>
                  <Text className='text-sm text-gray-600 '>{item.time}</Text>
                </View>

                <View className='flex flex-col items-center justify-center'>

                  {item.status === "完成" && <Passed size={25} color='#6b9e3b' />}
                  {item.status === "进行中" && <FlagOutlined size={25} color='#8ce' />}
                  {item.status === "未开始" && <UnderwayOutlined size={25} color='#f8c' />}
                  {item.status === "完成" && <Text className='text-sm mt-2 text-[#6b9e3b]'>已完成</Text>}
                  {item.status === "进行中" && <Text className='text-sm mt-2 text-[#8ce]'>进行中</Text>}
                  {item.status === "未开始" && <Text className='text-sm mt-2 text-[#f8c]'>未开始</Text>}
                </View>

              </View>
            )
          })
        }
      </View>
    </CusCard>
  );
};

export default NavTask;


const timeline = [
  {
    title: "巡逻全园",
    time: "08:00 - 09:00",
    status: "完成"
  },
  {
    title: "巡逻教学楼",
    time: "09:00 - 10:00",
    status: "进行中"
  },
  {
    title: "巡逻操场",
    time: "10:00 - 11:00",
    status: "未开始"
  },
  {
    title: "巡逻食堂",
    time: "11:00 - 12:00",
    status: "未开始"
  },
  {
    title: "巡逻宿舍楼",
    time: "12:00 - 13:00",
    status: "未开始"
  },
  {
    title: "巡逻图书馆",
    time: "13:00 - 14:00",
    status: "未开始"
  }
]
