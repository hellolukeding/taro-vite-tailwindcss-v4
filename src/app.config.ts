export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/studio/index',
    'pages/result/index',
    'pages/tasks/index',
    'pages/prompt-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '点皴AI',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '广场',
        iconPath: 'assets/icons/square.png',
        selectedIconPath: 'assets/icons/square-active.png'
      },
      {
        pagePath: 'pages/studio/index',
        text: '创作',
        iconPath: 'assets/icons/studio.png',
        selectedIconPath: 'assets/icons/studio-active.png'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  }
})
