import CommonHeader from '@/components/CommonHeader'
import CommonWarp from '@/components/CommonWarp'
import { Icon } from '@/components/common/Icon'
import { mockUser } from '@/mock/user'
import { Add, Arrow, Fire, Warning } from '@taroify/icons'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'



interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {

  const [activeTab, setActiveTab] = useState("我的收藏")

  return (
    <CommonWarp title='我的' withHeader={false}>
      <View className='w-full h-full bg-white flex flex-col'>
        <CommonHeader title='个人主页' withBack >
          <View className='w-full flex items-center justify-between'>
            <View className='rounded-full w-20 h-20 overflow-hidden'>
              <Image src='https://i.urusai.cc/PlyC9.png' className='w-full h-full object-cover ' />
            </View>

            <View className='ml-4 flex flex-col justify-center flex-1'>
              <Text className='text-white text-xl font-semibold tracking-wide'>
                {mockUser.nickname}
              </Text>
              <Text className='text-gray-300 text-sm mt-1'>
                @{mockUser.userId}
              </Text>
            </View>

            <Arrow size={20} style={{ color: "#fff" }} />

          </View>

          <View className='w-full text-white flex items-center justify-between mt-6 px-6'>
            <View className='flex flex-col '>
              <Text className='text-sm'>{mockUser.totalWorks}</Text>
              <Text className='text-xs mt-1'>已创作</Text>
            </View>


            <View className='flex flex-col '>
              <Text className='text-sm'>{mockUser.likes}</Text>
              <Text className='text-xs mt-1'>收获点赞</Text>
            </View>

            <View className='flex flex-col '>
              <Text className='text-sm'>{mockUser.favorites}</Text>
              <Text className='text-xs mt-1'>收藏</Text>
            </View>
          </View>
        </CommonHeader>


        <ScrollView scrollY className='flex-1 mt-2'>


          {/* 积分卡片 */}
          <View className='px-5 mb-8'>
            <View className='bg-linear-to-br from-gray-900 to-black rounded-3xl p-6 relative overflow-hidden shadow-xl'>
              {/* 装饰光晕 */}
              <View className='absolute -top-10 -right-5 w-40 h-40 bg-gray-700/20 rounded-full blur-3xl pointer-events-none' />
              <View className='absolute -bottom-5 -left-5 w-32 h-32 bg-gray-600/10 rounded-full blur-2xl pointer-events-none' />

              {/* 当前积分区 */}
              <View className='relative z-10 flex justify-between items-center'>
                <View>
                  <View className='flex items-center gap-1.5 mb-2 opacity-80'>
                    {/* <Icon name='bolt' size={16} color='#FBBF24' /> */}
                    <Fire size={16} color='#FBBF24' />
                    <Text className='text-gray-300 text-xs font-medium tracking-wide'>当前积分</Text>
                  </View>
                  <Text className='text-[32px] font-bold text-white tracking-tight leading-none'>{mockUser.credits.toLocaleString()}</Text>
                </View>
                <View
                  onClick={() => Taro.navigateTo({ url: '/packageUser/pages/recharge/index' })}
                  className='flex items-center gap-1 bg-white text-black px-5 py-2.5 rounded-4xl shadow-lg active:scale-95 transition-transform'
                >
                  <Icon name='add' size={14} />
                  <Text className='text-xs font-bold'>立即充值</Text>
                </View>
              </View>

              {/* 统计信息 */}
              <View className='mt-5 pt-4 border-t border-white/10 grid  grid-cols-2 gap-2 text-white text-xs '>
                <View className='flex items-center'>
                  <Warning className='mr-2' /> 今日消耗： <Text className='font-bold'>{999}</Text>
                </View>

                <View className='flex items-center'>
                  <Add className='mr-2' /> 累计创作： <Text className='font-bold'>{999}</Text>
                </View>
              </View>


            </View>
          </View>

          <View className='w-full px-4' >

            <Text className='font-semibold tracking-wide text-lg'>
              我的收藏
            </Text>

            <ScrollView scrollY className='w-full '>

            </ScrollView>
          </View>

        </ScrollView>
      </View>
    </CommonWarp >
  )
}

export default Profile
