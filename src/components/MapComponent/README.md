# MapComponent 使用文档

## 概述

MapComponent 是一个集成了高德地图 SDK 的 Taro 地图组件，用于在微信小程序中显示机器人的实时位置。

## 特性

- ✅ 支持显示机器人实时位置
- ✅ 集成高德地图微信小程序 SDK
- ✅ 支持自定义标记点
- ✅ 坐标验证和默认值处理
- ✅ 提供逆地理编码功能

## 基础使用

### 1. 显示机器人位置

```tsx
import MapComponent from "@/components/MapComponent";

const RobotMap = () => {
  const [robotPosition, setRobotPosition] = useState({
    latitude: 39.908823,
    longitude: 116.39747,
  });

  return (
    <MapComponent
      latitude={robotPosition.latitude}
      longitude={robotPosition.longitude}
      scale={16}
    />
  );
};
```

### 2. 添加机器人标记

```tsx
import MapComponent from "@/components/MapComponent";

const RobotMap = () => {
  const robotPosition = {
    latitude: 39.908823,
    longitude: 116.39747,
  };

  const markers = [
    {
      id: 1,
      latitude: robotPosition.latitude,
      longitude: robotPosition.longitude,
      iconPath: "/assets/robot-marker.png", // 机器人图标
      width: 30,
      height: 30,
      title: "机器人当前位置",
    },
  ];

  return (
    <MapComponent
      latitude={robotPosition.latitude}
      longitude={robotPosition.longitude}
      markers={markers}
      scale={16}
    />
  );
};
```

### 3. 启用高德地图 SDK 功能

```tsx
import MapComponent from "@/components/MapComponent";

const RobotMap = () => {
  return (
    <MapComponent
      latitude={39.908823}
      longitude={116.39747}
      enableAmap={true} // 启用高德地图 SDK
      scale={16}
    />
  );
};
```

## 高级功能

### 逆地理编码（获取地址信息）

```tsx
import { getAddressFromLocation } from "@/components/MapComponent";

const getRobotAddress = async (lat: number, lng: number) => {
  try {
    const result = await getAddressFromLocation(lat, lng);
    console.log("机器人当前地址:", result[0]?.desc);
    console.log("详细信息:", result[0]?.regeocodeData);
  } catch (error) {
    console.error("获取地址失败:", error);
  }
};
```

### 自定义样式

```tsx
<MapComponent
  latitude={39.908823}
  longitude={116.39747}
  style={{
    width: "100vw",
    height: "50vh",
    borderRadius: "10px",
  }}
/>
```

### 监听事件

```tsx
<MapComponent
  latitude={39.908823}
  longitude={116.39747}
  markers={markers}
  onMarkerTap={(e) => {
    console.log("点击标记:", e);
    // 处理标记点击事件
  }}
  onRegionChange={(e) => {
    console.log("地图区域变化:", e);
    // 处理地图拖动、缩放等
  }}
/>
```

## Props 说明

| 属性           | 类型                         | 必填 | 默认值  | 说明                         |
| -------------- | ---------------------------- | ---- | ------- | ---------------------------- |
| latitude       | number                       | 是   | -       | 机器人当前纬度（-90 ~ 90）   |
| longitude      | number                       | 是   | -       | 机器人当前经度（-180 ~ 180） |
| scale          | number                       | 否   | 16      | 地图缩放级别（3-20）         |
| markers        | MarkerType[]                 | 否   | []      | 标记点数组                   |
| style          | CSSProperties                | 否   | -       | 自定义样式                   |
| onMarkerTap    | function                     | 否   | -       | 标记点击事件                 |
| onRegionChange | function                     | 否   | -       | 地图区域变化事件             |
| enableAmap     | boolean                      | 否   | false   | 是否启用高德地图 SDK         |
| coordType      | 'WGS84' \| 'GCJ02' \| 'BD09' | 否   | 'GCJ02' | 输入坐标系类型               |

### MarkerType 说明

```typescript
interface MarkerType {
  id: number; // 标记唯一 ID
  latitude: number; // 纬度
  longitude: number; // 经度
  title?: string; // 标题（可选）
  iconPath: string; // 图标路径
  width?: number; // 图标宽度（可选）
  height?: number; // 图标高度（可选）
}
```

### 坐标系说明

组件支持三种坐标系的自动转换：

- **WGS84**：GPS 原始坐标（国际标准）
- **GCJ02**：火星坐标（高德、腾讯地图使用）- **默认**
- **BD09**：百度坐标（百度地图使用）

微信小程序 Map 组件使用 GCJ02（火星坐标），组件会自动将输入坐标转换为 GCJ02。

#### 坐标系转换示例

```tsx
// 如果机器人使用 GPS 原始坐标（WGS84）
<MapComponent
  latitude={30.200000}  // WGS84 纬度
  longitude={120.270000} // WGS84 经度
  coordType="WGS84"     // 指定输入坐标系
/>

// 如果机器人使用百度坐标（BD09）
<MapComponent
  latitude={30.210000}  // BD09 纬度
  longitude={120.280000} // BD09 经度
  coordType="BD09"      // 指定输入坐标系
/>

// 如果机器人使用火星坐标（GCJ02）- 默认，无需转换
<MapComponent
  latitude={30.204556}
  longitude={120.272776}
  // coordType="GCJ02" // 可省略，默认值
/>
```

## 配置说明

### 1. 环境变量配置

在 `.env.development` 中配置高德地图 Key：

```bash
TARO_APP_AMAP_KEY=你的高德地图Key
```

### 2. 微信小程序配置

在微信小程序后台配置：

1. 进入「开发」→「开发管理」→「开发设置」
2. 在「服务器域名」中添加：
   - request 合法域名：`https://restapi.amap.com`

### 3. SDK 文件

高德地图 SDK 已放置在 `src/libs/amap-wx.130.js`

## 注意事项

1. **坐标验证**：

   - 纬度必须在 -90 到 90 之间
   - 经度必须在 -180 到 180 之间
   - 无效坐标会自动使用默认值（北京天安门）

2. **不需要定位权限**：

   - 本组件用于显示机器人位置，不获取用户定位
   - 坐标数据应该从后端服务获取

3. **性能优化**：
   - 频繁更新位置时，建议做防抖处理
   - 避免在 markers 数组中放置过多标记点

## 完整示例

```tsx
import { View } from "@tarojs/components";
import { useState, useEffect } from "react";
import MapComponent, {
  getAddressFromLocation,
} from "@/components/MapComponent";

const RobotTrackingPage = () => {
  const [robotPosition, setRobotPosition] = useState({
    latitude: 39.908823,
    longitude: 116.39747,
  });
  const [address, setAddress] = useState("");

  // 模拟接收实时位置数据
  useEffect(() => {
    const interval = setInterval(() => {
      // 从 WebSocket 或 API 获取机器人位置
      fetchRobotPosition().then((pos) => {
        setRobotPosition(pos);
      });
    }, 3000); // 每3秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 获取地址信息
  const updateAddress = async () => {
    try {
      const result = await getAddressFromLocation(
        robotPosition.latitude,
        robotPosition.longitude
      );
      setAddress(result[0]?.desc || "");
    } catch (error) {
      console.error("获取地址失败");
    }
  };

  const markers = [
    {
      id: 1,
      latitude: robotPosition.latitude,
      longitude: robotPosition.longitude,
      iconPath: "/assets/robot-icon.png",
      width: 40,
      height: 40,
      title: "机器人",
    },
  ];

  return (
    <View className="w-full h-screen">
      <MapComponent
        latitude={robotPosition.latitude}
        longitude={robotPosition.longitude}
        markers={markers}
        scale={16}
        enableAmap={true}
        onMarkerTap={(e) => {
          console.log("点击机器人标记:", e);
          updateAddress();
        }}
      />
      {address && (
        <View className="absolute bottom-4 left-4 bg-white p-2 rounded">
          当前位置: {address}
        </View>
      )}
    </View>
  );
};
```

## 故障排查

### 地图不显示

- 检查 latitude 和 longitude 是否有效
- 查看控制台是否有错误信息
- 确认微信开发者工具中「不校验合法域名」已勾选

### 高德地图功能不可用

- 检查 `.env.development` 中的 Key 配置
- 确认高德地图 SDK 文件存在
- 查看控制台是否有初始化成功的日志

### 坐标验证失败

- 确保传入的坐标为数字类型
- 检查坐标范围是否正确
- 查看控制台警告信息
