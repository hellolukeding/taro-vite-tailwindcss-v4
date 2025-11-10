import { Tabbar } from "@taroify/core";
import { FriendsOutlined, HomeOutlined, Search, SettingOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import React from "react";

interface NaviBarProps { }

const NaviBar: React.FC<NaviBarProps> = () => {
  return (
    <View className='w-full h-full flex flex-col'>
      <View className='w-full h-[calc(100%-80px)] '>

      </View>
      <View className='w-full  h-20 '>
        <Tabbar>
          <Tabbar.TabItem icon={<HomeOutlined />}>标签</Tabbar.TabItem>
          <Tabbar.TabItem icon={<Search />}>标签</Tabbar.TabItem>
          <Tabbar.TabItem icon={<FriendsOutlined />}>标签</Tabbar.TabItem>
          <Tabbar.TabItem icon={<SettingOutlined />}>标签</Tabbar.TabItem>
        </Tabbar>
      </View>

    </View>
  );
};

export default NaviBar;
