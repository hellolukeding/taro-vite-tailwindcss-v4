import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';

interface TabbarItemConfig {
  name: string;
  icon: React.ReactNode;
  activeColor?: string;
  inactiveColor?: string;
  path: string | null;
}

interface CustomTabbarProps {
  value?: string;
  items: TabbarItemConfig[];
  onChange?: (value: string) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const CustomTabbar: React.FC<CustomTabbarProps> = ({
  value,
  items,
  onChange,
  activeColor = '#a8e6cf',
  inactiveColor = '#999999',
}) => {
  return (
    <View className='w-full flex items-center justify-around'>
      {items.map((item) => {
        const isActive = value === item.name;
        const currentActiveColor = item.activeColor || activeColor;
        const currentInactiveColor = item.inactiveColor || inactiveColor;
        const displayColor = isActive ? currentActiveColor : currentInactiveColor;

        return (
          <View
            key={item.name}
            onClick={() => {
              onChange?.(item.name);
              if (item?.path) {
                Taro.navigateTo({ url: item.path });// Navigate to the specified path
              } else {
                Taro.showToast({
                  title: '施工中...',
                  icon: 'error',
                  duration: 2000
                })
              }
            }}
            className='flex flex-col items-center justify-center px-4 cursor-pointer transition-all'
            style={{
              color: displayColor,
            }}
          >
            <View
              className='flex items-center justify-center'
              style={{
                color: displayColor,
                lineHeight: '1',
              }}
            >
              {item.icon}
            </View>
            <Text
              className='text-xs'
              style={{
                color: displayColor,
                lineHeight: '1.2',
                marginTop: '-2px',
              }}
            >
              {item.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabbar;
