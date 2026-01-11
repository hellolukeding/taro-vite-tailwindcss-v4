/**
 * Mock创作工坊数据
 */

export interface MockModel {
  id: string
  name: string
  imageUrl: string
  isVIP: boolean
  isSelected: boolean
}

export const mockModels: MockModel[] = [
  {
    id: '1',
    name: 'SDXL Turbo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKgx6migqU3IOsjPj7nWJcQ0Pr2R_sJVTo1l1SBtI_qXc_yjGp9Q-pD7kulfNEkpdFCrfqKUClBqSj4EZVqUtUfU3Y_bEouGM8BBTu-nEDoAXrO6IcQFfVP5rc620n59e4JWxk0j2vVyaBy0v0YahENY76yDWe_BCO3qj_oqPKqT31BNa7v-wedOGDXpz0rp8lM37jh-Rv6GZippV8AcM4nkh7up3-zoPqQS-Br9EjnPcfhWFyQhu06I2A7NjLQUsCqw17lgBypdot',
    isVIP: true,
    isSelected: true,
  },
  {
    id: '2',
    name: '二次元 v3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkGxHGzb777WkC7EyKkmLT-x2unPziDTcrhbYAko20t_z3tbJs90zO5DgicIH_e6N3IFcW7kOsTfdDjlabLHkC7sJONrtmNvMnONeuqZEovKuwY9a61k_kwYizrdcjwyvI9HVQe5kS06rzLq35h3dPdXqDKOFcAfGu8OyTcVuBR2d2yksB1cTQy8BdARxt6p_BulkUa-IFHPE4ZaLNH9K-IfJo4RlLxVMJwOFcj3Q_VwJSZ0YXJz-vCa2lLrHzJFtEStEucnGF9vJY',
    isVIP: true,
    isSelected: false,
  },
  {
    id: '3',
    name: '写实模式',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZa08w_P13MRLV4DRurdk2AZRTfyZ0XSp49rvelLgudNsJk_-cX38ZTR3QW9g3WM0_QluwaIN9WA5sjDxNlHnug3ypAXuOPJdwh70Lp1H6LZdkvAsC-_d1Tf8prWSJmiWruKaEiN0x-PmgHLaeeg9njZMtf1p2j-eQr01WpU6bz4Xh1RLxHbeOtT9TsuFVs0jY3Mgc5BpG3w5YjOPGHoPOxN-JSjCN3uptpBR3MRKeBXdpvsVm8TGmKf5-Of7Wac6k-9kY7gk0EdTU',
    isVIP: false,
    isSelected: false,
  },
]

export const mockPromptExamples = [
  '一个未来城市的街道，霓虹灯光，8k分辨率',
  '唯美樱花树下，穿着和服的少女，动漫风格',
  '超现实主义画作，悬浮的岛屿，梦幻色彩',
  '写实人物肖像，自然光照，高清细节',
]
