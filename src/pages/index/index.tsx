import { AddPage, BottomTabBar, MyPage, PromptItem, PromptSquare } from '@/components'
import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const [activeTab, setActiveTab] = useState(0)

  // 模拟数据
  const promptData: PromptItem[] = [
    {
      id: 1,
      title: "小红书爆款文案",
      desc: "帮你写出吸引人的种草文案，提升转化率",
      avatar: "https://img.yzcdn.cn/vant/cat.jpg",
      image: "https://img.yzcdn.cn/vant/cat.jpg",
      likes: 128,
      comments: 45
    },
    {
      id: 2,
      title: "AI绘画提示词",
      desc: "Midjourney/Stable Diffusion专业提示词生成",
      avatar: "https://img.yzcdn.cn/vant/dog.jpg",
      image: "https://img.yzcdn.cn/vant/dog.jpg",
      likes: 256,
      comments: 89
    },
    {
      id: 3,
      title: "职场邮件助手",
      desc: "专业、得体的商务邮件模板",
      avatar: "https://img.yzcdn.cn/vant/cat.jpg",
      image: "https://img.yzcdn.cn/vant/cat.jpg",
      likes: 89,
      comments: 23
    },
    {
      id: 4,
      title: "学习计划制定",
      desc: "个性化学习路径规划，高效提升技能",
      avatar: "https://img.yzcdn.cn/vant/dog.jpg",
      image: "https://img.yzcdn.cn/vant/dog.jpg",
      likes: 167,
      comments: 56
    },
    {
      id: 5,
      title: "社交媒体文案",
      desc: "朋友圈、微博、小红书文案一键生成",
      avatar: "https://img.yzcdn.cn/vant/cat.jpg",
      image: "https://img.yzcdn.cn/vant/cat.jpg",
      likes: 342,
      comments: 123
    },
    {
      id: 6,
      title: "创意写作助手",
      desc: "小说、故事、诗歌创作灵感来源",
      avatar: "https://img.yzcdn.cn/vant/dog.jpg",
      image: "https://img.yzcdn.cn/vant/dog.jpg",
      likes: 201,
      comments: 67
    }
  ]

  // 根据tab显示不同内容
  const renderContent = () => {
    if (activeTab === 0) {
      return <PromptSquare data={promptData} />
    } else if (activeTab === 1) {
      return <AddPage />
    } else if (activeTab === 2) {
      return <MyPage />
    }
  }

  return (
    <View className='w-screen h-screen bg-white flex flex-col'>
      {/* 主要内容区域 */}
      <View className='flex-1 overflow-hidden'>
        {renderContent()}
      </View>

      {/* 底部导航栏 */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  )
}
