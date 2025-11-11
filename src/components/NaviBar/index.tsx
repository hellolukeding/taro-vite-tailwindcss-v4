import { View } from '@tarojs/components';
import React, { useState } from 'react';
import CustomTabbar from './CustomTabbar';
import { NaviBarConfig } from './navibar.config';

interface NaviBarProps {
  children?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const NaviBar: React.FC<NaviBarProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(props.value || NaviBarConfig.list[0].name);

  const handleChange = (value: string) => {
    setCurrentValue(value);
    // props.onChange?.(value);

  };

  return (
    <View className='w-screen h-screen flex flex-col bg-[#3f9b6a]'>
      <View className='w-full h-[calc(100%-80px)] px-2 overflow-hidden'>
        {
          props?.children
        }
      </View>
      <View className='w-full h-20 flex items-center justify-center'>
        <CustomTabbar
          value={currentValue}
          items={NaviBarConfig.list}
          onChange={handleChange}
          activeColor={props.activeColor}
          inactiveColor={props.inactiveColor}
        />
      </View>

    </View>
  );
};

export default NaviBar;
