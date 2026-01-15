import CommonWarp from "@/components/CommonWarp";
import { Button, Flex, Radio } from "@taroify/core";

import { Image, Text, View } from "@tarojs/components";


interface LoginProps { }

const Login: React.FC<LoginProps> = (props) => {
  return (
    <CommonWarp title='' withHeader>
      <View className='w-full h-full flex flex-col items-center justify-center'>

        <View className='mb-20'>

          <Flex justify='center'>
            <Flex.Item>
              <Image src='https://i.urusai.cc/09TWQ.png' className='w-30 h-30' />
            </Flex.Item>
          </Flex>


          <Text className='text-lg font-semibold'>
            开启你的 AI 创意之旅
          </Text>

        </View>

        <Radio.Group defaultValue=''>
          <Radio name='1'>请你阅读并同意《用户协议》和《隐私政策》</Radio>
        </Radio.Group>

        <View className='w-full flex flex-col px-6 mt-6'>

          <Button shape='round' style={{
            backgroundColor: "#000", color: "#fff"
          }}
          >
            手机号授权登录
          </Button>

          <Button variant='outlined' shape='round' style={{
            marginTop: 10
          }}
          >
            暂不登录
          </Button>
        </View>

      </View>

    </CommonWarp>

  );
};

export default Login;
