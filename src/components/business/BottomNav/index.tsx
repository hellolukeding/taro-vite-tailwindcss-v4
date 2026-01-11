import { Tabbar } from "@taroify/core"
import { BrushOutlined, ContactOutlined, EnvelopOutlined, HomeOutlined } from "@taroify/icons"
import './index.css'

type TabType = 'home' | 'create' | 'chat' | 'profile'

interface BottomNavProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
}

export function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  void activeTab
  void onTabChange
  return (
    <Tabbar fixed placeholder className='custom-tabbar' style={{
      height: 60,
      paddingBottom: 10,
    }}
    >
      <Tabbar.TabItem icon={<HomeOutlined size={20} />}>首页</Tabbar.TabItem>
      <Tabbar.TabItem icon={<BrushOutlined size={20} />}>创作</Tabbar.TabItem>
      <Tabbar.TabItem icon={<EnvelopOutlined size={20} />}>消息</Tabbar.TabItem>
      <Tabbar.TabItem icon={<ContactOutlined size={20} />}>我的</Tabbar.TabItem>
    </Tabbar>
  )
}
