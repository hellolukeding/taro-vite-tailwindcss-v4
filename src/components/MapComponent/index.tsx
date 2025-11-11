import { Map } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { transformCoord, type CoordType } from '../../utils/coordTransform';

interface MarkerType {
  id: number;
  latitude: number;
  longitude: number;
  title?: string;
  iconPath: string;
  width?: number;
  height?: number;
}

interface MapComponentProps {
  latitude: number; // 机器人当前纬度（必填）
  longitude: number; // 机器人当前经度（必填）
  scale?: number;
  markers?: MarkerType[];
  style?: React.CSSProperties;
  onMarkerTap?: (e: any) => void;
  onRegionChange?: (e: any) => void;
  enableAmap?: boolean; // 是否启用高德地图功能
  coordType?: CoordType; // 输入坐标系类型，默认 GCJ02（火星坐标）
}

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  scale = 16,
  markers = [],
  style,
  onMarkerTap,
  onRegionChange,
  enableAmap = false,
  coordType = 'GCJ02', // 默认火星坐标（高德、腾讯地图使用）
}) => {
  const [amapInstance, setAmapInstance] = useState<any>(null);

  // 坐标转换：将输入坐标转换为 GCJ02（微信地图使用火星坐标）
  const convertedCoord = transformCoord(longitude, latitude, coordType, 'GCJ02');

  // 验证并规范化坐标值
  const validLatitude = !Number.isNaN(convertedCoord.lat) && convertedCoord.lat >= -90 && convertedCoord.lat <= 90
    ? convertedCoord.lat
    : 39.908823; // 默认北京天安门坐标

  const validLongitude = !Number.isNaN(convertedCoord.lng) && convertedCoord.lng >= -180 && convertedCoord.lng <= 180
    ? convertedCoord.lng
    : 116.397470; // 默认北京天安门坐标

  // 验证并规范化 markers 坐标（同时进行坐标转换）
  const validMarkers = markers.map(marker => {
    // 先进行坐标转换
    const convertedMarker = transformCoord(
      marker.longitude,
      marker.latitude,
      coordType,
      'GCJ02'
    );

    const markerLat = !Number.isNaN(convertedMarker.lat) && convertedMarker.lat >= -90 && convertedMarker.lat <= 90
      ? convertedMarker.lat
      : validLatitude;

    const markerLng = !Number.isNaN(convertedMarker.lng) && convertedMarker.lng >= -180 && convertedMarker.lng <= 180
      ? convertedMarker.lng
      : validLongitude;

    if (
      Math.abs(marker.latitude - markerLat) > 0.0001 ||
      Math.abs(marker.longitude - markerLng) > 0.0001
    ) {
      console.log(`Marker ${marker.id} 坐标转换:`, {
        原始坐标: { latitude: marker.latitude, longitude: marker.longitude },
        转换后: { latitude: markerLat, longitude: markerLng },
        坐标系: `${coordType} -> GCJ02`
      });
    }

    return {
      ...marker,
      latitude: markerLat,
      longitude: markerLng,
    };
  });

  // 初始化高德地图配置
  useEffect(() => {
    if (enableAmap && !amapInstance) {
      const amapKey = process.env.TARO_APP_AMAP_KEY || 'ec34258d76112d648df951e9baf229d8';
      setAmapInstance({ key: amapKey });
      console.log('高德地图配置完成，Key:', amapKey);
    }
  }, [enableAmap, amapInstance]);

  // 直接使用传入的机器人位置，不获取用户定位
  useEffect(() => {
    if (latitude !== validLatitude || longitude !== validLongitude) {
      console.warn('坐标值无效，使用默认值:', {
        原始值: { latitude, longitude },
        有效值: { latitude: validLatitude, longitude: validLongitude }
      });
    } else {
      console.log('机器人位置更新:', { latitude: validLatitude, longitude: validLongitude });
    }
  }, [latitude, longitude, validLatitude, validLongitude]);

  const handleMarkerTap = (e: any) => {
    console.log('点击标记', e);
    onMarkerTap?.(e);
  };

  const handleRegionChange = (e: any) => {
    console.log('区域变化', e);
    onRegionChange?.(e);
  };

  const handleError = (e: any) => {
    console.error('地图错误', e);
    Taro.showToast({
      title: '地图加载失败',
      icon: 'none',
    });
  };

  return (
    <Map
      id='map'
      latitude={validLatitude}
      longitude={validLongitude}
      scale={scale}
      markers={validMarkers}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      onMarkerTap={handleMarkerTap}
      onRegionChange={handleRegionChange}
      onError={handleError}
    />
  );
};

// 逆地理编码：根据坐标获取地址信息（直接调用高德 API）
export const getAddressFromLocation = (latitude: number, longitude: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const amapKey = process.env.TARO_APP_AMAP_KEY || 'ec34258d76112d648df951e9baf229d8';

    Taro.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: amapKey,
        location: `${longitude},${latitude}`,
        extensions: 'all',
      },
      method: 'GET',
      success: (res: any) => {
        if (res.data && res.data.status === '1') {
          console.log('逆地理编码成功:', res.data);
          resolve(res.data);
        } else {
          reject(new Error(res.data?.info || '逆地理编码失败'));
        }
      },
      fail: (error: any) => {
        console.error('逆地理编码失败:', error);
        reject(error);
      }
    });
  });
};

export default MapComponent;
