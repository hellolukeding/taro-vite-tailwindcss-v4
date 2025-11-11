import { Aim, FireOutlined, HomeOutlined, StarOutlined } from '@taroify/icons'

export const NaviBarConfig = {

  list: [
    {
      name: '首页',
      icon: <HomeOutlined size={25} />,
      activeColor: '#fff',
      inactiveColor: '#a8e6cf',
      path: "/pages/index/index",
    },
    {
      name: '工具',
      icon: <FireOutlined size={25} />,
      activeColor: '#fff',
      inactiveColor: '#a8e6cf',
      path: null
    },
    {
      name: '控制',
      icon: <Aim size={25} />,
      activeColor: '#fff',
      inactiveColor: '#a8e6cf',
      path: '/pages/ctrl/index',

    },
    {
      name: '我的',
      icon: <StarOutlined size={25} />,
      activeColor: '#fff',
      inactiveColor: '#a8e6cf',
      path: null

    }
  ]
}
