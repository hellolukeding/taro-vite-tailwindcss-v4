import { Tabbar } from "@taroify/core"
import { BrushOutlined, ContactOutlined, FireOutlined, HomeOutlined } from "@taroify/icons"
import Taro, { useRouter } from "@tarojs/taro"
import { useEffect, useState } from "react"
import './index.css'




export function BottomNav() {
  const [activeTab, setActiveTab] = useState<string>('/pages/index/index')
  const router = useRouter()

  const items = [
    {
      label: '首页',
      icon: <HomeOutlined size={20} />,
      value: "/pages/index/index"
    },
    {
      label: '创作',
      icon: <BrushOutlined size={20} />,
      value: "/pages/studio/index"
    },
    {
      label: '资产',
      icon: <FireOutlined size={20} />,
      value: "/pages/assets/index"
    },
    {
      label: '我的',
      icon: <ContactOutlined size={20} />,
      value: "/pages/profile/index"
    },
  ]

  const handleChange = (value: any) => {
    if (value === router.path) {
      return
    }
    setActiveTab(value as string)
    // 使用 switchTab 跳转到 tabBar 页面（原生 tabBar 配置后）
    // 这将提供零白屏的页面切换体验
    Taro.switchTab({
      url: value
    })
  }


  /*------------------------------------------------------------------------------------------*/

  useEffect(() => {
    setActiveTab(router.path)
  }, [router])
  return (
    <Tabbar fixed placeholder className='custom-tabbar'
      style={{
        height: 60,
        paddingBottom: 10,
      }}
      value={activeTab}
      onChange={handleChange}
    >
      {
        items.map((item) => (
          <Tabbar.TabItem
            key={item.label} icon={item.icon}
            value={item.value}
          >{item.label}</Tabbar.TabItem>
        ))
      }

    </Tabbar>
  )
}


