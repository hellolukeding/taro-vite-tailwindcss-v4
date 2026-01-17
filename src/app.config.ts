export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/studio/index',
    'pages/assets/index',
    'pages/profile/index',
    'pages/user-detail/index',
    'pages/profile-edit/index',
  ],
  // 原生 tabBar 配置 - 提供零白屏的页面切换体验
  tabBar: {
    custom: false,
    color: '#999999',
    selectedColor: '#000000',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/studio/index',
        text: '创作',
        iconPath: 'assets/icons/studio.png',
        selectedIconPath: 'assets/icons/studio-active.png'
      },
      {
        pagePath: 'pages/assets/index',
        text: '资产',
        iconPath: 'assets/icons/assets.png',
        selectedIconPath: 'assets/icons/assets-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  },
  // 分包配置 - 将非核心页面移到分包，减少主包大小
  subPackages: [
    {
      root: 'packageTasks',
      pages: [
        'pages/tasks/index',
      ]
    },
    {
      root: 'packageUser',
      pages: [
        'pages/login/index',
        'pages/result/index',
        'pages/recharge/index',
        'pages/agreement/index',
      ]
    },
    {
      root: 'packageDetail',
      pages: [
        'pages/prompt-detail/index',
      ],
      independent: true // 独立分包
    }
  ],
  // 预加载规则 - 首页预加载详情页
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['packageDetail'] // 首页预加载详情页分包
    }
  },
  window: {
    navigationStyle: 'default', // 使用原生导航栏
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black'
  }
})
