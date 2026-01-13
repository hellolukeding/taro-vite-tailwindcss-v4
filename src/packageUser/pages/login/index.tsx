import { Button, Input } from '@/components/common'
import { useUser } from '@/store'
import { Text, View } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

export default function Login() {
  const router = useRouter()
  const { login } = useUser()
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)

  useDidShow(() => {
    // 检查是否已有token，如果有则跳转回原页面
    const token = Taro.getStorageSync('token')
    if (token) {
      const redirect = router.params.redirect || '/pages/index/index'
      Taro.redirectTo({ url: redirect })
    }
  })

  // 微信登录
  const handleWeChatLogin = async () => {
    setLoading(true)
    try {
      // 获取微信code
      const { code } = await Taro.login()

      if (!code) {
        throw new Error('获取微信code失败')
      }

      // 调用后端登录API
      await login(code)

      // 登录成功
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })

      // 跳转到原页面或首页
      setTimeout(() => {
        const redirect = router.params.redirect || '/pages/index/index'
        Taro.redirectTo({ url: redirect })
      }, 1500)
    } catch (error: any) {
      console.error('Login error:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      setLoading(false)
    }
  }

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }

    // TODO: 调用发送验证码API
    console.log('Send code to:', phone)

    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    Taro.showToast({ title: '验证码已发送', icon: 'success' })
  }

  // 手机号登录
  const handlePhoneLogin = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }
    if (!code || code.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      // TODO: 调用手机号登录API
      console.log('Phone login:', phone, code)

      setTimeout(() => {
        Taro.setStorageSync('token', 'mock-phone-token')
        Taro.setStorageSync('userInfo', {
          userId: '789012',
          nickname: '手机用户',
          avatar: ''
        })

        const redirect = router.params.redirect || '/pages/index/index'
        Taro.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          Taro.redirectTo({ url: redirect })
        }, 1000)
      }, 1000)
    } catch (error) {
      console.error('Phone login error:', error)
      Taro.showToast({ title: '登录失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='min-h-screen bg-gradient-to-b from-theme-primary to-theme-secondary flex flex-col items-center justify-center p-6'>
      {/* Logo区域 */}
      <View className='mb-8 text-center'>
        <View className='w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
          <Text className='text-4xl font-bold text-theme-primary'>点</Text>
        </View>
        <Text className='text-2xl font-bold text-white'>点皴AI</Text>
        <Text className='text-sm text-white/80 mt-2 block'>智能提示词创作平台</Text>
      </View>

      {/* 登录方式选择 */}
      <View className='w-full max-w-sm bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl'>
        {showPhoneLogin ? (
          <>
            {/* 手机号登录 */}
            <Text className='text-xl font-bold text-gray-800 mb-6 block'>手机号登录</Text>

            <Input
              label='手机号'
              placeholder='请输入手机号'
              value={phone}
              onChange={setPhone}
              type='phone'
              maxLength={11}
              required
              className='mb-4'
            />

            <View className='flex gap-2 mb-4'>
              <View className='flex-1'>
                <Input
                  placeholder='请输入验证码'
                  value={code}
                  onChange={setCode}
                  type='digit'
                  maxLength={6}
                  className='w-full'
                />
              </View>
              <Button
                type='outline'
                size='small'
                onClick={sendVerificationCode}
                disabled={countdown > 0}
                className='whitespace-nowrap mt-1'
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </View>

            <Button
              block
              loading={loading}
              onClick={handlePhoneLogin}
              className='mb-4'
            >
              登录
            </Button>

            <Button
              type='outline'
              block
              onClick={() => setShowPhoneLogin(false)}
            >
              返回微信登录
            </Button>
          </>
        ) : (
          <>
            {/* 微信登录 */}
            <Button
              block
              loading={loading}
              onClick={handleWeChatLogin}
              className='mb-4 bg-green-600 hover:bg-green-700'
            >
              微信一键登录
            </Button>

            <View className='relative my-4'>
              <View className='absolute inset-0 flex items-center'>
                <View className='w-full border-t border-gray-200'></View>
              </View>
              <View className='relative flex justify-center text-sm'>
                <Text className='px-2 bg-white text-gray-500'>或</Text>
              </View>
            </View>

            <Button
              type='outline'
              block
              onClick={() => setShowPhoneLogin(true)}
            >
              手机号登录
            </Button>
          </>
        )}

        {/* 协议说明 */}
        <View className='mt-6 text-center'>
          <Text className='text-xs text-gray-500'>
            登录即表示同意
            <Text className='text-theme-primary'>《用户协议》</Text>
            和
            <Text className='text-theme-primary'>《隐私政策》</Text>
          </Text>
        </View>
      </View>

      {/* 背景装饰 */}
      <View className='absolute inset-0 pointer-events-none overflow-hidden'>
        <View className='absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl'></View>
        <View className='absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl'></View>
      </View>
    </View>
  )
}
