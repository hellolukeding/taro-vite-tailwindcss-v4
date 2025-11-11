import { Canvas, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  backgroundColor = '#f0f0f0',
  knobColor = '#3f9b6a',
  onDirectionChange,
}) => {
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<any>(null);
  const centerRef = useRef<{ x: number; y: number } | null>(null);
  const isPressedRef = useRef(false);

  const knobSize = size * 0.25; // 摇杆球大小
  const containerRadius = size / 2;
  const maxDistance = containerRadius - knobSize - 10; // 留一些边距

  // 绘制摇杆
  const drawJoystick = useCallback(
    (ctx: any, knobX: number, knobY: number) => {
      // 清空画布
      ctx.clearRect(0, 0, size, size);

      // 绘制外圈背景
      ctx.beginPath();
      ctx.arc(containerRadius, containerRadius, containerRadius - 5, 0, 2 * Math.PI);
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 绘制十字辅助线
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(containerRadius, 10);
      ctx.lineTo(containerRadius, size - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, containerRadius);
      ctx.lineTo(size - 10, containerRadius);
      ctx.stroke();

      // 绘制中心圆圈
      ctx.beginPath();
      ctx.arc(containerRadius, containerRadius, maxDistance, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制中心点
      ctx.beginPath();
      ctx.arc(containerRadius, containerRadius, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#999';
      ctx.fill();

      // 如果有移动，绘制方向线
      if (knobX !== 0 || knobY !== 0) {
        ctx.beginPath();
        ctx.moveTo(containerRadius, containerRadius);
        ctx.lineTo(containerRadius + knobX, containerRadius + knobY);
        ctx.strokeStyle = knobColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 绘制摇杆球（带阴影效果）
      const knobAbsX = containerRadius + knobX;
      const knobAbsY = containerRadius + knobY;

      // 阴影
      ctx.beginPath();
      ctx.arc(knobAbsX + 2, knobAbsY + 2, knobSize, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      // 摇杆球
      ctx.beginPath();
      ctx.arc(knobAbsX, knobAbsY, knobSize, 0, 2 * Math.PI);
      ctx.fillStyle = knobColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 摇杆球高光
      ctx.beginPath();
      ctx.arc(knobAbsX - knobSize / 3, knobAbsY - knobSize / 3, knobSize / 3, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(
        knobAbsX - knobSize / 3,
        knobAbsY - knobSize / 3,
        0,
        knobAbsX - knobSize / 3,
        knobAbsY - knobSize / 3,
        knobSize / 3
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    },
    [size, backgroundColor, knobColor, containerRadius, maxDistance, knobSize]
  );

  // 初始化 Canvas
  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('#joystick-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 设置 Canvas 尺寸
          const dpr = Taro.getSystemInfoSync().pixelRatio || 1;
          canvas.width = size * dpr;
          canvas.height = size * dpr;
          ctx.scale(dpr, dpr);

          canvasRef.current = { canvas, ctx };

          // 初始绘制
          drawJoystick(ctx, 0, 0);
        }
      });
  }, [size, drawJoystick]);

  // 更新位置
  const updatePosition = useCallback(
    (x: number, y: number) => {
      const distance = Math.sqrt(x * x + y * y);

      // 限制在最大距离内
      if (distance > maxDistance) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * maxDistance;
        y = Math.sin(angle) * maxDistance;
      }

      const normalizedDistance = distance > maxDistance ? maxDistance : distance;
      const angle = Math.atan2(y, x) * (180 / Math.PI);

      setKnobPosition({ x, y });

      // 重新绘制
      if (canvasRef.current) {
        drawJoystick(canvasRef.current.ctx, x, y);
      }

      // 回调
      if (onDirectionChange) {
        onDirectionChange({
          x: maxDistance > 0 ? x / maxDistance : 0,
          y: maxDistance > 0 ? y / maxDistance : 0,
          angle: angle,
          distance: maxDistance > 0 ? normalizedDistance / maxDistance : 0,
        });
      }
    },
    [maxDistance, onDirectionChange, drawJoystick]
  );

  // 触摸开始
  const handleTouchStart = useCallback(
    (e: any) => {
      e.stopPropagation();
      isPressedRef.current = true;

      const touch = e.touches[0];

      // 获取 Canvas 位置
      Taro.createSelectorQuery()
        .select('#joystick-container')
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
    [updatePosition]
  );

  // 触摸移动
  const handleTouchMove = useCallback(
    (e: any) => {
      if (!isPressedRef.current || !centerRef.current) return;
      e.stopPropagation();

      const touch = e.touches[0];
      const x = touch.clientX - centerRef.current.x;
      const y = touch.clientY - centerRef.current.y;
      updatePosition(x, y);
    },
    [updatePosition]
  );

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    isPressedRef.current = false;
    setKnobPosition({ x: 0, y: 0 });

    // 重置到中心
    if (canvasRef.current) {
      drawJoystick(canvasRef.current.ctx, 0, 0);
    }

    if (onDirectionChange) {
      onDirectionChange({ x: 0, y: 0, angle: 0, distance: 0 });
    }
  }, [onDirectionChange, drawJoystick]);

  return (
    <View
      id='joystick-container'
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        margin: '0 auto',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas
        id='joystick-canvas'
        type='2d'
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />

      {/* 调试信息 */}
      <View
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '0',
          right: '0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
        }}
      >
        X: {knobPosition.x.toFixed(0)} Y: {knobPosition.y.toFixed(0)}
      </View>
    </View>
  );
};

export default Joystick;
