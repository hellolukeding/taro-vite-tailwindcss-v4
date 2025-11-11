/**
 * 坐标转换工具
 * 支持 WGS84、GCJ02（火星坐标）、BD09（百度坐标）之间的转换
 */

const PI = Math.PI;
const X_PI = (PI * 3000.0) / 180.0;
const A = 6378245.0; // 长半轴
const EE = 0.00669342162296594323; // 偏心率平方

/**
 * 判断坐标是否在中国境外
 */
function outOfChina(lng: number, lat: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

/**
 * 转换纬度
 */
function transformLat(lng: number, lat: number): number {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

/**
 * 转换经度
 */
function transformLng(lng: number, lat: number): number {
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) /
    3.0;
  return ret;
}

/**
 * WGS84 转 GCJ02（火星坐标）
 * @param lng WGS84 经度
 * @param lat WGS84 纬度
 * @returns GCJ02 坐标 { lng, lat }
 */
export function wgs84ToGcj02(lng: number, lat: number): { lng: number; lat: number } {
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);

  const mgLat = lat + dLat;
  const mgLng = lng + dLng;

  return { lng: mgLng, lat: mgLat };
}

/**
 * GCJ02（火星坐标）转 WGS84
 * @param lng GCJ02 经度
 * @param lat GCJ02 纬度
 * @returns WGS84 坐标 { lng, lat }
 */
export function gcj02ToWgs84(lng: number, lat: number): { lng: number; lat: number } {
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);

  const mgLat = lat + dLat;
  const mgLng = lng + dLng;

  return { lng: lng * 2 - mgLng, lat: lat * 2 - mgLat };
}

/**
 * GCJ02（火星坐标）转 BD09（百度坐标）
 * @param lng GCJ02 经度
 * @param lat GCJ02 纬度
 * @returns BD09 坐标 { lng, lat }
 */
export function gcj02ToBd09(lng: number, lat: number): { lng: number; lat: number } {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  const bdLng = z * Math.cos(theta) + 0.0065;
  const bdLat = z * Math.sin(theta) + 0.006;

  return { lng: bdLng, lat: bdLat };
}

/**
 * BD09（百度坐标）转 GCJ02（火星坐标）
 * @param lng BD09 经度
 * @param lat BD09 纬度
 * @returns GCJ02 坐标 { lng, lat }
 */
export function bd09ToGcj02(lng: number, lat: number): { lng: number; lat: number } {
  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  const gcjLng = z * Math.cos(theta);
  const gcjLat = z * Math.sin(theta);

  return { lng: gcjLng, lat: gcjLat };
}

/**
 * WGS84 转 BD09（百度坐标）
 * @param lng WGS84 经度
 * @param lat WGS84 纬度
 * @returns BD09 坐标 { lng, lat }
 */
export function wgs84ToBd09(lng: number, lat: number): { lng: number; lat: number } {
  const gcj02 = wgs84ToGcj02(lng, lat);
  return gcj02ToBd09(gcj02.lng, gcj02.lat);
}

/**
 * BD09（百度坐标）转 WGS84
 * @param lng BD09 经度
 * @param lat BD09 纬度
 * @returns WGS84 坐标 { lng, lat }
 */
export function bd09ToWgs84(lng: number, lat: number): { lng: number; lat: number } {
  const gcj02 = bd09ToGcj02(lng, lat);
  return gcj02ToWgs84(gcj02.lng, gcj02.lat);
}

/**
 * 坐标系类型
 */
export type CoordType = 'WGS84' | 'GCJ02' | 'BD09';

/**
 * 通用坐标转换函数
 * @param lng 经度
 * @param lat 纬度
 * @param from 源坐标系
 * @param to 目标坐标系
 * @returns 转换后的坐标 { lng, lat }
 */
export function transformCoord(
  lng: number,
  lat: number,
  from: CoordType,
  to: CoordType
): { lng: number; lat: number } {
  // 相同坐标系，直接返回
  if (from === to) {
    return { lng, lat };
  }

  // 先转换到 GCJ02（火星坐标）作为中间坐标
  let gcj02: { lng: number; lat: number };

  switch (from) {
    case 'WGS84':
      gcj02 = wgs84ToGcj02(lng, lat);
      break;
    case 'BD09':
      gcj02 = bd09ToGcj02(lng, lat);
      break;
    case 'GCJ02':
    default:
      gcj02 = { lng, lat };
      break;
  }

  // 从 GCJ02 转换到目标坐标系
  switch (to) {
    case 'WGS84':
      return gcj02ToWgs84(gcj02.lng, gcj02.lat);
    case 'BD09':
      return gcj02ToBd09(gcj02.lng, gcj02.lat);
    case 'GCJ02':
    default:
      return gcj02;
  }
}
