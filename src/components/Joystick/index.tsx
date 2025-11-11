import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useCallback, useRef, useState } from "react";

interface JoystickProps {
  size?: number;
  backgroundColor?: string;
  knobColor?: string;
  onDirectionChange?: (direction: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => void;
}

const Joystick: React.FC<JoystickProps> = ({
  size = 200,
  backgroundColor = "#ffffff",
  knobColor = "#3f9b6a",
  onDirectionChange,
}) => {
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const centerRef = useRef<{ x: number; y: number } | null>(null);
  const isPressedRef = useRef(false);

  const knobSize = size * 0.3;
  const containerRadius = size / 2;
  const maxDistance = containerRadius - knobSize / 2;

  const updatePosition = useCallback(
    (x: number, y: number) => {
      const distance = Math.sqrt(x * x + y * y);

      if (distance > maxDistance) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * maxDistance;
        y = Math.sin(angle) * maxDistance;
      }

      const normalizedDistance =
        distance > maxDistance ? maxDistance : distance;
      const angle = Math.atan2(y, x) * (180 / Math.PI);

      setKnobPosition({ x, y });

      if (onDirectionChange) {
        onDirectionChange({
          x: maxDistance > 0 ? x / maxDistance : 0,
          y: maxDistance > 0 ? y / maxDistance : 0,
          angle: angle,
          distance: maxDistance > 0 ? normalizedDistance / maxDistance : 0,
        });
      }
    },
    [maxDistance, onDirectionChange],
  );

  const handleTouchStart = useCallback(
    (e: any) => {
      e.stopPropagation();
      setIsPressed(true);
      isPressedRef.current = true;

      const touch = e.touches[0];

      // 使用 Taro API 获取元素位置
      Taro.createSelectorQuery()
        .select("#joystick-container")
        .boundingClientRect((rect: any) => {
          if (rect) {
            centerRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };

            if (centerRef.current) {
              const x = touch.clientX - centerRef.current.x;
              const y = touch.clientY - centerRef.current.y;
              updatePosition(x, y);
            }
          }
        })
        .exec();
    },
    [updatePosition],
  );

  const handleTouchMove = useCallback(
    (e: any) => {
      if (!isPressedRef.current || !centerRef.current) return;
      e.stopPropagation();

      const touch = e.touches[0];
      const x = touch.clientX - centerRef.current.x;
      const y = touch.clientY - centerRef.current.y;
      updatePosition(x, y);
    },
    [updatePosition],
  );

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    isPressedRef.current = false;
    setKnobPosition({ x: 0, y: 0 });
    if (onDirectionChange) {
      onDirectionChange({ x: 0, y: 0, angle: 0, distance: 0 });
    }
  }, [onDirectionChange]);

  return (
    <View
      id='joystick-container'
      className='flex items-center justify-center'
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: backgroundColor,
        borderRadius: "50%",
        position: "relative",
        border: `2px solid #ddd`,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "0 auto",
        userSelect: "none",
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 中心点 */}
      <View
        style={{
          position: "absolute",
          width: "4px",
          height: "4px",
          backgroundColor: "#666",
          borderRadius: "50%",
          zIndex: 10,
        }}
      />

      {/* 摇杆球 */}
      <View
        style={{
          position: "absolute",
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          backgroundColor: knobColor,
          borderRadius: "50%",
          transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
          transition: isPressed ? "none" : "transform 0.1s ease-out",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          zIndex: 20,
        }}
      />

      {/* 方向指示线 */}
      {(knobPosition.x !== 0 || knobPosition.y !== 0) && (
        <View
          style={{
            position: "absolute",
            width: "1px",
            height: `${Math.sqrt(knobPosition.x ** 2 + knobPosition.y ** 2)}px`,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            transformOrigin: "0 0",
            transform: `rotate(${Math.atan2(knobPosition.y, knobPosition.x) * (180 / Math.PI)}deg)`,
            zIndex: 5,
          }}
        />
      )}
    </View>
  );
};

export default Joystick;
