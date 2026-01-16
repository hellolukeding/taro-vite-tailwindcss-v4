import { Navbar } from "@taroify/core";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
// 注意：原生 tabBar 已启用，不再需要自定义 BottomNav 组件
// import { BottomNav } from "../business/BottomNav";


interface CommonWarpProps {
  children?: React.ReactNode
  title: string
  withHeader?: boolean
  className?: string
}

const CommonWarp: React.FC<CommonWarpProps> = (props) => {
  const withHeader = props.withHeader ?? true;
  return (
    <View className={`common-warp w-screen h-screen flex flex-col ${withHeader ? 'pt-10' : ''} `}>
      {withHeader && (
        <Navbar title={props.title} >
          <Navbar.NavLeft onClick={() => Taro.navigateBack()}>返回</Navbar.NavLeft>
        </Navbar>
      )}
      <View className={`w-full  flex-1 overflow-auto ${props.className ?? ''}`}>
        {props.children}
      </View>
      {/* 原生 tabBar 已启用，移除自定义 BottomNav */}
    </View>
  );
};

export default CommonWarp;
