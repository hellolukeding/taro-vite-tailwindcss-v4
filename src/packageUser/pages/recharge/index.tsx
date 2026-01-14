import { paymentApi } from "@/api";
import CommonWarp from "@/components/CommonWarp";
import { Button, Field, Input, RollingText } from "@taroify/core";
import { Arrow, Award, BrushOutlined, Completed, Diamond, Hot, MedalOutlined, VipCard } from "@taroify/icons";
import { Text, View } from "@tarojs/components";
import useRequest from "ahooks/lib/useRequest";
import "./index.scss";

interface RechargeProps { }

const Recharge: React.FC<RechargeProps> = (props) => {

  const { data: packages, loading: pkgLoading } = useRequest(() => paymentApi.getPackages())


  return (
    <CommonWarp title='充值' withHeader className='px-4 pb-40'>

      <View className='w-full h-40 rounded-xl mt-4 relative overflow-hidden shadow-2xl bg-black text-white'>




        {/* 内容层 */}
        <View className='relative z-10 flex flex-col items-center justify-center h-full bg-black'>
          <RollingText className='my-rolling-text' height={54} startNum={12345} targetNum={54321} />
          <View className='mt-4 font-semibold text-lg'>
            <MedalOutlined />
            <Text className='ml-2'>当前积分余额</Text>
          </View>
        </View>
      </View>

      <View className='mt-4 w-full overflow-auto whitespace-nowrap py-2' >
        {
          (packages ?? []).map((pkg) => {
            if (pkg.is_vip) return null;
            return (
              <View key={pkg.id}
                className='w-30 h-40 mr-4 rounded-xl p-3 inline-flex  flex-col  items-center justify-center shadow-lg relative
              bg-black text-white active:scale-95 transition-transform
              '
              >

                <View className='absolute bottom-2 left-2 text-xs'>
                  {pkg.name}
                </View>
                {pkg.is_hot &&
                  <View className='absolute top-1 right-1 rotate-45' >

                    <Hot size={30} color='#f00' />
                  </View>
                }


                <Text className='text-2xl'>
                  {pkg.credits} 积分
                </Text>
                <Text className='font-semibold text-2xl mt-2'>
                  ￥{pkg.price}
                </Text>
                <Text className='line-through opacity-85 mt-2'>
                  ￥{pkg.original_price}
                </Text>
              </View>
            )
          })
        }
      </View>


      <View className='w-full mt-4 rounded-xl overflow-hidden shadow-2xl'>
        <Field align='center' label='邀请码'>
          <Input placeholder='输入邀请码' />
          <Button variant='text' color='primary' icon={<Arrow />} />
        </Field>
      </View>

      <View className='w-full mt-4 flex items-center'>

        <VipCard size={30} />
        <Text className='text-xl font-semibold ml-2'>
          VIP专区
        </Text>
      </View>

      <View className='w-full mt-4 space-y-4'>
        {
          pkgLoading ? (
            <Text>加载中...</Text>
          ) : (
            packages?.map((pkg, index) => {
              if (!pkg.is_vip) return null;
              return (
                <View key={pkg.id} className='w-full h-50 rounded-2xl shadow-2xl relative overflow-hidden vip-card'>
                  {/* 动态渐变背景 */}
                  <View className={`absolute inset-0 bg-linear-to-br vip-gradient-${index % 3}`} />
                  {/* 装饰光晕 */}
                  {/* <View className='absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl' /> */}
                  {/* <View className='absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl' /> */}
                  {/* 内容层 */}
                  <View className='relative text-white z-10 flex flex-col items-start justify-start h-full p-6'>
                    <View className='text-xl font-semibold flex items-center'>
                      <VipCard size={30} />
                      <Text className='ml-2'>
                        会员权益
                      </Text>
                    </View>
                    <Text className='text-xs'>{pkg.description}</Text>

                    <View className='w-full flex flex-col mt-4 text-sm'>
                      {
                        list.map((item, idx) => (
                          <View key={idx} className='flex items-center mt-2'>
                            {item.icon}
                            <Text className='ml-2'>{item.description}</Text>
                          </View>
                        ))
                      }


                    </View>

                    <View className='absolute bottom-2 right-2 flex flex-col justify-end items-end'>
                      <Text className='text-3xl font-semibold'>{`¥${pkg.price}`}</Text>
                      <Text className='line-through opacity-85'>{`¥${pkg.original_price}`}</Text>
                    </View>
                  </View>

                </View>
              )
            })
          )
        }
      </View>

      {/* 结算 */}
      <View className='w-screen z-50 fixed bottom-0 left-0 h-30  flex bg-white items-center justify-between px-6 py-4 shadow-t-lg'>

        <View className='flex flex-col'>
          <Text className='text-2xl font-semibold'>{`¥ ${999}`}</Text>
          <Text className='text-xs'>应付金额</Text>
        </View>

        <Button className='w-40' style={{
          backgroundColor: "#000",
          color: "#fff",
        }} icon={<BrushOutlined color='#fff' />}
        >
          去支付
        </Button>
      </View>
    </CommonWarp>
  );
};

export default Recharge;


const list = [
  {
    icon: <Award />,
    description: "每日免费领取20积分",

  },
  {
    icon: <Diamond />,
    description: "专属高级模型使用权",
  },
  {
    icon: <Completed />,
    description: "无限速创作，排队优先",
  }
]
