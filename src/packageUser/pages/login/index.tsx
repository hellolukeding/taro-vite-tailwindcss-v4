import { authApi } from "@/api/auth";
import CommonWarp from "@/components/CommonWarp";
import { useUser } from "@/store";
import { Button, Flex, Radio } from "@taroify/core";
import { Image, Input as TaroInput, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { useState } from "react";
import "./index.css";

interface LoginProps { }

const Login: React.FC<LoginProps> = (props) => {
  const router = useRouter()
  const { login } = useUser()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [validating, setValidating] = useState(false)
  const [inviteValidation, setInviteValidation] = useState<{
    valid: boolean
    inviter_nickname?: string | null
    inviter_avatar?: string | null
    message?: string | null
  } | null>(null)

  useDidShow(() => {
    // 从 URL 参数获取邀请码和重定向地址
    const { invite_code, redirect } = router.params
    if (invite_code) {
      setInviteCode(invite_code as string)
    }

    // 检查是否已经登录（验证 token 有效性）
    const checkLoginStatus = async () => {
      const token = Taro.getStorageSync("token")
      if (!token) {
        return // 没有 token，显示登录页面
      }

      try {
        // 验证 token 是否有效
        await authApi.getUserProfile()

        // token 有效，跳转到首页
        const redirectUrl = (redirect as string) || "/pages/index/index"
        const isTabBar = redirectUrl.startsWith("/pages/")
        if (isTabBar) {
          Taro.switchTab({ url: redirectUrl })
        } else {
          Taro.redirectTo({ url: redirectUrl })
        }
      } catch (error: any) {
        // token 无效或网络错误
        console.error('Token validation failed:', error)

        // 如果是 401 错误，清除本地存储
        if (error.message?.includes('401') || error.message?.includes('登录')) {
          Taro.removeStorageSync("token")
          Taro.removeStorageSync("userInfo")
        }
        // 其他错误（网络问题等），不清除 token，显示登录页面
      }
    }

    checkLoginStatus()
  })

  // 处理邀请码输入
  const handleInviteCodeInput = async (value: string) => {
    setInviteCode(value)

    // 如果清空了邀请码，重置验证状态
    if (!value.trim()) {
      setInviteValidation(null)
      return
    }

    // 防抖：延迟500ms后再验证
    setValidating(true)
    // TODO: 实现防抖逻辑，这里简化处理
    try {
      const result = await authApi.validateInviteCode(value)
      setInviteValidation(result)
    } catch (error) {
      console.error('验证邀请码失败:', error)
      setInviteValidation({
        valid: false,
        message: '验证失败，请稍后再试'
      })
    } finally {
      setValidating(false)
    }
  }

  // 处理微信登录
  const handleWeChatLogin = async () => {
    if (!agreed) {
      Taro.showToast({ title: "请先阅读并同意用户协议", icon: "none" })
      return
    }

    setLoading(true)
    try {
      // 获取微信 code
      const { code } = await Taro.login()
      if (!code) {
        throw new Error("获取微信code失败")
      }

      // 调用登录接口
      await login(code, inviteCode)

      Taro.showToast({ title: "登录成功", icon: "success" })

      setTimeout(() => {
        const redirect = (router.params.redirect as string) || "/pages/index/index"
        // 判断是否为 tabBar 页面
        const isTabBar = redirect.startsWith("/pages/")
        if (isTabBar) {
          Taro.switchTab({ url: redirect })
        } else {
          Taro.redirectTo({ url: redirect })
        }
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error)
      Taro.showToast({
        title: error.message || "登录失败",
        icon: "none"
      })
    } finally {
      setLoading(false)
    }
  }

  // 暂不登录，返回首页
  const handleSkipLogin = () => {
    Taro.switchTab({
      url: "/pages/index/index"
    })
  }

  // 查看用户协议
  const handleViewAgreement = (type: 'user' | 'privacy') => {
    return (e: any) => {
      // 阻止事件冒泡，避免触发 Radio 的 onChange
      e.stopPropagation()
      Taro.navigateTo({
        url: `/packageUser/pages/agreement/index?type=${type}`
      })
    }
  }

  return (
    <CommonWarp title='' withHeader>
      <View className='w-full h-full flex flex-col items-center justify-center'>

        <View className='mb-20'>

          <Flex justify='center'>
            <Flex.Item>
              <Image src='https://i.urusai.cc/09TWQ.png' className='w-30 h-30' />
            </Flex.Item>
          </Flex>


          <Text className='text-sm '>
            开启你的 AI 创意之旅
          </Text>

        </View>

        <View className='w-full px-6 mb-6'>
          <View className='flex items-start'>
            {/* Radio 组件 */}
            <Radio.Group
              value={agreed ? "1" : ""}
              onChange={(value) => setAgreed(!!value)}
            >
              <Radio name='1'>
                <Text className='text-sm text-gray-600'>
                  我已阅读并同意
                </Text>
              </Radio>
            </Radio.Group>

            {/* 协议链接放在 Radio 外面，使用 View 包裹确保点击事件生效 */}
            <View className='flex items-center mt-0.5'>
              <View
                className='ml-1'
                onClick={handleViewAgreement('user')}
                catchMove
              >
                <Text className='text-sm text-blue-500'>《用户协议》</Text>
              </View>
              <Text className='text-sm text-gray-600 ml-1'>和</Text>
              <View
                className='ml-1'
                onClick={handleViewAgreement('privacy')}
                catchMove
              >
                <Text className='text-sm text-blue-500'>《隐私政策》</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='w-full flex flex-col px-6'>

          {/* 邀请码输入框 */}
          <View className='mb-4 flex flex-col items-center'>
            <TaroInput
              className='border border-gray-300 rounded-2xl bg-white'
              placeholder='请输入邀请码（可选）'
              value={inviteCode}
              onInput={(e) => handleInviteCodeInput(e.detail.value)}
              disabled={loading}
              style={{
                width: "280px",
                padding: "12px"
              }}
            />

            {/* 验证结果显示 */}
            {inviteValidation && inviteCode && (
              <View className='mt-2 px-3 py-2 rounded-lg' style={{
                backgroundColor: inviteValidation.valid ? '#F0FDF4' : '#FEF2F2',
                minWidth: '280px'
              }}>
                {inviteValidation.valid ? (
                  <View className='flex items-center gap-2'>
                    <Text className='text-xs' style={{ color: '#16A34A' }}>✓</Text>
                    <Text className='text-xs' style={{ color: '#16A34A' }}>
                      邀请人：{inviteValidation.inviter_nickname || '未知用户'}
                    </Text>
                  </View>
                ) : (
                  <Text className='text-xs' style={{ color: '#DC2626' }}>
                    {inviteValidation.message || '无效的邀请码'}
                  </Text>
                )}
              </View>
            )}

            {/* 验证中提示 */}
            {validating && (
              <View className='mt-2'>
                <Text className='text-xs text-gray-500'>验证中...</Text>
              </View>
            )}
          </View>



          <Button
            shape='round'
            style={{
              backgroundColor: "#000",
              color: "#fff"
            }}
            onClick={handleWeChatLogin}
            loading={loading}
            disabled={loading || !agreed}
          >
            {loading ? "登录中..." : "微信授权登录"}
          </Button>

          <Button
            variant='outlined'
            shape='round'
            style={{
              marginTop: 10
            }}
            onClick={handleSkipLogin}
            disabled={loading}
          >
            暂不登录
          </Button>
        </View>

      </View>

    </CommonWarp>

  );
};

export default Login;
