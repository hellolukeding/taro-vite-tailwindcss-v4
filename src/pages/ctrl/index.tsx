
import Joystick from "@/components/Joystick";
import NaviBar from "@/components/NaviBar";
import { Image, Text, View } from "@tarojs/components";
import { useState } from "react";
import { menus } from "./ctrl.config";


interface CtrlPageProps { }

const CtrlPage: React.FC<CtrlPageProps> = () => {
  const [direction, setDirection] = useState({ x: 0, y: 0, angle: 0, distance: 0 });

  const handleDirectionChange = (dir: any) => {
    setDirection(dir);
  };

  return (
    <NaviBar value='控制'>
      <View className='w-full h-full pt-24 '>
        <View className='grid grid-cols-4 gap-4 px-4'>
          {menus.map(item => {
            return (
              <View className='flex flex-col items-center justify-center' key={item.name}>
                <Image src={item.icon} className='w-10 h-10 mb-2' />
                <View className='text-sm text-white'>{item.name}</View>
              </View>
            )
          })}
        </View>

        <View className='w-full mt-4 flex flex-col items-center justify-center' >
          <Joystick
            size={180}
            backgroundColor='#ffffff'
            knobColor='#3f9b6a'
            onDirectionChange={handleDirectionChange}
          />
          <View className='mt-4 text-white text-center'>
            <Text>X: {direction.x.toFixed(2)}</Text>
            <Text> | Y: {direction.y.toFixed(2)}</Text>
            <Text> | 角度: {direction.angle.toFixed(0)}°</Text>
            <Text> | 距离: {direction.distance.toFixed(2)}</Text>
          </View>
        </View>

      </View>
    </NaviBar>
  );
};

export default CtrlPage;
