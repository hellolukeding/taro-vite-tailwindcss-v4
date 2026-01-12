import { Navbar } from "@taroify/core";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { BottomNav } from "../business/BottomNav";


interface CommonWarpProps {
  children?: React.ReactNode
  title: string
  withHeader?: boolean
}

const CommonWarp: React.FC<CommonWarpProps> = (props) => {
  const withHeader = props.withHeader ?? true;
  return (
    <View className={`w-screen h-screen flex flex-col ${withHeader ? 'pt-10' : ''}`}>
      {withHeader && (
        <Navbar title={props.title} >
          <Navbar.NavLeft onClick={() => Taro.navigateBack()}>返回</Navbar.NavLeft>
        </Navbar>
      )}
      <View className='w-full  flex-1 overflow-auto'>
        {props.children}
      </View>
      <BottomNav />
    </View>
  );
};

export default CommonWarp;
