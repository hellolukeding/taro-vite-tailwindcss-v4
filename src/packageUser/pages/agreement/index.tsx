import CommonWarp from "@/components/CommonWarp"
import { agreementApi, type AgreementData } from "@/api/agreement"
import { View, Text, RichText, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState } from "react"
import "./index.css"

const Agreement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "privacy">("user")
  const [userAgreement, setUserAgreement] = useState<AgreementData | null>(null)
  const [privacyPolicy, setPrivacyPolicy] = useState<AgreementData | null>(null)
  const [loading, setLoading] = useState(true)

  // 从 URL 参数获取默认显示的协议类型
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    const type = router?.params?.type as "user" | "privacy"
    if (type) setActiveTab(type)
  }, [])

  // 加载协议内容
  useEffect(() => {
    loadAgreements()
  }, [])

  const loadAgreements = async () => {
    try {
      setLoading(true)
      // 并行加载两个协议
      const [userAgreementData, privacyPolicyData] = await Promise.all([
        agreementApi.getAgreement('user_agreement'),
        agreementApi.getAgreement('privacy_policy')
      ])
      setUserAgreement(userAgreementData)
      setPrivacyPolicy(privacyPolicyData)
    } catch (error: any) {
      console.error('加载协议失败:', error)
      Taro.showToast({
        title: '加载失败，请稍后重试',
        icon: 'none',
        duration: 2000
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CommonWarp title="加载中..." withHeader>
        <View className="w-full h-full bg-white flex items-center justify-center">
          <Text className="text-gray-500">加载中...</Text>
        </View>
      </CommonWarp>
    )
  }

  const currentAgreement = activeTab === "user" ? userAgreement : privacyPolicy

  return (
    <CommonWarp title={activeTab === "user" ? "用户协议" : "隐私政策"} withHeader>
      <View className='w-full h-full bg-white flex flex-col'>

        {/* Tab 切换 */}
        <View className='flex border-b border-gray-200'>
          <View
            className={`flex-1 text-center py-3 ${activeTab === 'user' ? 'text-black font-semibold border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('user')}
          >
            用户协议
          </View>
          <View
            className={`flex-1 text-center py-3 ${activeTab === 'privacy' ? 'text-black font-semibold border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('privacy')}
          >
            隐私政策
          </View>
        </View>

        {/* 内容区域 */}
        <ScrollView scrollY className='flex-1'>
          {currentAgreement ? (
            <View className='p-4'>
              {/* 标题和元信息 */}
              <View className='mb-4 pb-4 border-b border-gray-200'>
                <Text className='text-xl font-bold block mb-2'>{currentAgreement.title}</Text>
                <View className='flex gap-2'>
                  <Text className='text-xs text-gray-500'>版本: {currentAgreement.version}</Text>
                  <Text className='text-xs text-gray-500'>•</Text>
                  <Text className='text-xs text-gray-500'>更新于: {currentAgreement.updated_at}</Text>
                </View>
              </View>

              {/* HTML 内容 */}
              <RichText
                nodes={currentAgreement.content_html}
                className='agreement-content'
              />
            </View>
          ) : (
            <View className='p-4 text-center text-gray-500'>
              <Text>加载失败，请稍后重试</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </CommonWarp>
  )
}

export default Agreement
