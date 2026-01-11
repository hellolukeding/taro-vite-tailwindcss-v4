/**
 * Mock广场数据
 */

export interface MockCreator {
  name: string
  avatar: string
}

export interface MockWork {
  id: string
  imageUrl: string
  prompt: string
  category: string
  creator: MockCreator
  likes: number
  isVIP: boolean
}

export const mockWorks: MockWork[] = [
  {
    id: '1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0EwshS4_b4_jIemoAE3D3LkNCwemtGMZXvLgOsiLTyuh214wMXd4yalpLnvRBl1o05H42kHhybIzzrjhv0eOdLgSRUIRbaPvycUzC3biy88LRDVTmsLQscFETanbLF9bc6uPARqNyCj_PzBQbjH_o072-08GP4h02WCSmT0Ji8SLkOgRq5nkQE79A_cGOoreOv988wO_uL0O79hcF7Dovj6dKZCE8kcdwvXjXMU-tC51moco90i-IFro9FsuV-74s8c5fNGHHMuL',
    prompt: '赛博朋克风格的未来城市街道,霓虹灯闪烁,雨夜氛围,8k超高清,细节丰富,电影级光效',
    category: '赛博朋克',
    creator: {
      name: '设计师小王',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm09uryhmGHU1S6F7zgiL8YQDUzUJFi_yd7AaqRTo904_3mqbfje--1gdIp6XJJ1s3lEfWrLVPUaBGtXgnfu2PE8XwTBgDAXlNDKyG51lNUaJmEWrc79OHOLnhSG9tFhnAVLbCV-9QzQMYve39q1QADSoCHx0pF5XW_zDPikQ6wCWtvu-l1hxpqHFqRCk0RNRlNOtgYhGNFRiVEu09FKtNdV_rnDaNEIiIgh97pGh0dN73y_TidIfaGzZwioTRM1xrlOkOOzcV4grt',
    },
    likes: 328,
    isVIP: false,
  },
  {
    id: '2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2P1CTC2q63eNKzT2Mc3fZducA4rFw3fmJnrojDqVNyFU25lL6XuHIPN678wP89cTADkHBj4k4POytEhbtk8bcrkn_Ka60GUt_XOZ_lXlhkRA36uHn7XDyDi4Z2wnsJR_QvUYMDCVCISamsCW1cDURgL2Y5H0k97niQl0N54LrLMjUIEcOOB9yTLiLLSdmIlQnN9bbppO_VBAhZB03cB8kDW6DfJKTZfw1lXZB8Q1u_VfZ9vtAwLHNrfS0e1D_qJM95y9OzTvaLeZz',
    prompt: '3D写实风格的美少女角色,精致的面部特征,柔和的光照,高质量渲染',
    category: '3D写实',
    creator: {
      name: 'AI画师',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnYJ8OanFn5fqjh4pugl9e9iaZbD6sgjGRouUFrmhkYBgO10nYGlJMXxdFwEhJPmDlsMy02fm4zhSJ5z2WOFCSMzgYwUHy45coVHON4-wZ4qNUJrHIHosJpkrs35uUKAw4KEiPer29o7yC_YUWfSqcd-Q9WhOEr9hPvQo-r9nFw7HzONOROnyTtKINwNXFcSKNkWH-aR1k4otwr5-X2EF8zJ9IcQKIGv9P9No38A7jvXUuEMS8cJXiCsmUlNFn4gQp6P-_z1foxEZ',
    },
    likes: 128,
    isVIP: true,
  },
  {
    id: '3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKgx6migqU3IOsjPj7nWJcQ0Pr2R_sJVTo1l1SBtI_qXc_yjGp9Q-pD7kulfNEkpdFCrfqKUClBqSj4EZVqUtUfU3Y_bEouGM8BBTu-nEDoAXrO6IcQFfVP5rc620n59e4JWxk0j2vVyaBy0v0YahENY76yDWe_BCO3qj_oqPKqT31BNa7v-wedOGDXpz0rp8lM37jh-Rv6GZippV8AcM4nkh7up3-zoPqQS-Br9EjnPcfhWFyQhu06I2A7NjLQUsCqw17lgBypdot',
    prompt: '二次元动漫风格,樱花飞舞的街道,少女和服,唯美插画风格,精细的线条和色彩',
    category: '二次元',
    creator: {
      name: '动漫迷',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnPh8i7otfD3F1XOmnNbggIEm5SBZ7VMTk1fUCo7ZlBUBaNJxbPb3A9ZIkWTVkNkdM40e4cfV22ZB_2_qNN6B7-j5MybcqVK3sJsGWQTkwQ2CCkCAdH7_1NHcMwmV0VMkuoH6tdlLkNHHehwW8xYvZDlQjqjjCT6LOZrOTGPdhAg4_KI8pX670Mypl3blnTWe1ccm7xgfkOK2H5uT-AKLHXTHF1UDKEMzP9BfbmrzOuvKrDON6m2fpsTWEnASCqPhPKANPNTp0xAj-',
    },
    likes: 256,
    isVIP: true,
  },
  {
    id: '4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkGxHGzb777WkC7EyKkmLT-x2unPziDTcrhbYAko20t_z3tbJs90zO5DgicIH_e6N3IFcW7kOsTfdDjlabLHkC7sJONrtmNvMnONeuqZEovKuwY9a61k_kwYizrdcjwyvI9HVQe5kS06rzLq35h3dPdXqDKOFcAfGu8OyTcVuBR2d2yksB1cTQy8BdARxt6p_BulkUa-IFHPE4ZaLNH9K-IfJo4RlLxVMJwOFcj3Q_VwJSZ0YXJz-vCa2lLrHzJFtEStEucnGF9vJY',
    prompt: '超现实主义艺术作品,悬浮的岛屿,梦幻般的色彩,数字绘画,概念设计',
    category: '超现实',
    creator: {
      name: '艺术创作者',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZa08w_P13MRLV4DRurdk2AZRTfyZ0XSp49rvelLgudNsJk_-cX38ZTR3QW9g3WM0_QluwaIN9WA5sjDxNlHnug3ypAXuOPJdwh70Lp1H6LZdkvAsC-_d1Tf8prWSJmiWruKaEiN0x-PmgHLaeeg9njZMtf1p2j-eQr01WpU6bz4Xh1RLxHbeOtT9TsuFVs0jY3Mgc5BpG3w5YjOPGHoPOxN-JSjCN3uptpBR3MRKeBXdpvsVm8TGmKf5-Of7Wac6k-9kY7gk0EdTU',
    },
    likes: 189,
    isVIP: false,
  },
  {
    id: '5',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnYJ8OanFn5fqjh4pugl9e9iaZbD6sgjGRouUFrmhkYBgO10nYGlJMXxdFwEhJPmDlsMy02fm4zhSJ5z2WOFCSMzgYwUHy45coVHON4-wZ4qNUJrHIHosJpkrs35uUKAw4KEiPer29o7yC_YUWfSqcd-Q9WhOEr9hPvQo-r9nFw7HzONOROnyTtKINwNXFcSKNkWH-aR1k4otwr5-X2EF8zJ9IcQKIGv9P9No38A7jvXUuEMS8cJXiCsmUlNFn4gQp6P-_z1foxEZ',
    prompt: '写实风格肖像,老人肖像,皱纹细节,自然光照,人物摄影',
    category: '写实',
    creator: {
      name: '摄影师小李',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm09uryhmGHU1S6F7zgiL8YQDUzUJFi_yd7AaqRTo904_3mqbfje--1gdIp6XJJ1s3lEfWrLVPUaBGtXgnfu2PE8XwTBgDAXlNDKyG51lNUaJmEWrc79OHOLnhSG9tFhnAVLbCV-9QzQMYve39q1QADSoCHx0pF5XW_zDPikQ6wCWtvu-l1hxpqHFqRCk0RNRlNOtgYhGNFRiVEu09FKtNdV_rnDaNEIiIgh97pGh0dN73y_TidIfaGzZwioTRM1xrlOkOOzcV4grt',
    },
    likes: 412,
    isVIP: true,
  },
  {
    id: '6',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2P1CTC2q63eNKzT2Mc3fZducA4rFw3fmJnrojDqVNyFU25lL6XuHIPN678wP89cTADkHBj4k4POytEhbtk8bcrkn_Ka60GUt_XOZ_lXlhkRA36uHn7XDyDi4Z2wnsJR_QvUYMDCVCISamsCW1cDURgL2Y5H0k97niQl0N54LrLMjUIEcOOB9yTLiLLSdmIlQnN9bbppO_VBAhZB03cB8kDW6DfJKTZfw1lXZB8Q1u_VfZ9vtAwLHNrfS0e1D_qJM95y9OzTvaLeZz',
    prompt: '科幻机甲战士,未来科技感,金属质感,战斗姿态,动态效果',
    category: '机甲',
    creator: {
      name: '机甲爱好者',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnPh8i7otfD3F1XOmnNbggIEm5SBZ7VMTk1fUCo7ZlBUBaNJxbPb3A9ZIkWTVkNkdM40e4cfV22ZB_2_qNN6B7-j5MybcqVK3sJsGWQTkwQ2CCkCAdH7_1NHcMwmV0VMkuoH6tdlLkNHHehwW8xYvZDlQjqjjCT6LOZrOTGPdhAg4_KI8pX670Mypl3blnTWe1ccm7xgfkOK2H5uT-AKLHXTHF1UDKEMzP9BfbmrzOuvKrDON6m2fpsTWEnASCqPhPKANPNTp0xAj-',
    },
    likes: 567,
    isVIP: false,
  },
  {
    id: '7',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKgx6migqU3IOsjPj7nWJcQ0Pr2R_sJVTo1l1SBtI_qXc_yjGp9Q-pD7kulfNEkpdFCrfqKUClBqSj4EZVqUtUfU3Y_bEouGM8BBTu-nEDoAXrO6IcQFfVP5rc620n59e4JWxk0j2vVyaBy0v0YahENY76yDWe_BCO3qj_oqPKqT31BNa7v-wedOGDXpz0rp8lM37jh-Rv6GZippV8AcM4nkh7up3-zoPqQS-Br9EjnPcfhWFyQhu06I2A7NjLQUsCqw17lgBypdot',
    prompt: '水彩风格风景画,山间小屋,宁静祥和,手绘质感,艺术插画',
    category: '风景',
    creator: {
      name: '插画师M',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnYJ8OanFn5fqjh4pugl9e9iaZbD6sgjGRouUFrmhkYBgO10nYGlJMXxdFwEhJPmDlsMy02fm4zhSJ5z2WOFCSMzgYwUHy45coVHON4-wZ4qNUJrHIHosJpkrs35uUKAw4KEiPer29o7yC_YUWfSqcd-Q9WhOEr9hPvQo-r9nFw7HzONOROnyTtKINwNXFcSKNkWH-aR1k4otwr5-X2EF8zJ9IcQKIGv9P9No38A7jvXUuEMS8cJXiCsmUlNFn4gQp6P-_z1foxEZ',
    },
    likes: 234,
    isVIP: true,
  },
  {
    id: '8',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0EwshS4_b4_jIemoAE3D3LkNCwemtGMZXvLgOsiLTyuh214wMXd4yalpLnvRBl1o05H42kHhybIzzrjhv0eOdLgSRUIRbaPvycUzC3biy88LRDVTmsLQscFETanbLF9bc6uPARqNyCj_PzBQbjH_o072-08GP4h02WCSmT0Ji8SLkOgRq5nkQE79A_cGOoreOv988wO_uL0O79hcF7Dovj6dKZCE8kcdwvXjXMU-tC51moco90i-IFro9FsuV-74s8c5fNGHHMuL',
    prompt: '极简主义设计,几何图形构成,现代艺术,抽象风格,黑白灰配色',
    category: '极简',
    creator: {
      name: '设计师阿杰',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm09uryhmGHU1S6F7zgiL8YQDUzUJFi_yd7AaqRTo904_3mqbfje--1gdIp6XJJ1s3lEfWrLVPUaBGtXgnfu2PE8XwTBgDAXlNDKyG51lNUaJmEWrc79OHOLnhSG9tFhnAVLbCV-9QzQMYve39q1QADSoCHx0pF5XW_zDPikQ6wCWtvu-l1hxpqHFqRCk0RNRlNOtgYhGNFRiVEu09FKtNdV_rnDaNEIiIgh97pGh0dN73y_TidIfaGzZwioTRM1xrlOkOOzcV4grt',
    },
    likes: 145,
    isVIP: false,
  },
]

export const mockCategories = ['推荐', '最新', '二次元', '写实', '3D']

export const mockLocations = ['北京', '上海', '广州', '深圳']
