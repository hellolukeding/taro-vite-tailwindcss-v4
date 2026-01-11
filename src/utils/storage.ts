/**
 * 本地存储工具
 */
import Taro from '@tarojs/taro'
import { STORAGE_KEYS } from './constants'

/**
 * 获取Token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await Taro.getStorageSync(STORAGE_KEYS.TOKEN) || null
  } catch (error) {
    console.error('Get token error:', error)
    return null
  }
}

/**
 * 保存Token
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await Taro.setStorageSync(STORAGE_KEYS.TOKEN, token)
  } catch (error) {
    console.error('Set token error:', error)
    throw error
  }
}

/**
 * 删除Token
 */
export async function removeAuthToken(): Promise<void> {
  try {
    await Taro.removeStorageSync(STORAGE_KEYS.TOKEN)
    await Taro.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN)
  } catch (error) {
    console.error('Remove token error:', error)
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<any | null> {
  try {
    return await Taro.getStorageSync(STORAGE_KEYS.USER_INFO) || null
  } catch (error) {
    console.error('Get user info error:', error)
    return null
  }
}

/**
 * 保存用户信息
 */
export async function setUserInfo(userInfo: any): Promise<void> {
  try {
    await Taro.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
  } catch (error) {
    console.error('Set user info error:', error)
    throw error
  }
}

/**
 * 删除用户信息
 */
export async function removeUserInfo(): Promise<void> {
  try {
    await Taro.removeStorageSync(STORAGE_KEYS.USER_INFO)
  } catch (error) {
    console.error('Remove user info error:', error)
  }
}

/**
 * 清除所有存储数据
 */
export async function clearAllStorage(): Promise<void> {
  try {
    await Taro.clearStorageSync()
  } catch (error) {
    console.error('Clear storage error:', error)
  }
}
