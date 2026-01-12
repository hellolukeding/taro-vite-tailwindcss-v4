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
    id: '0',
    name: 'nano-banana-fast',
    imageUrl: "https://i.urusai.cc/1mHou.jpg",
    isVIP: true,
    isSelected: false,
  },
  {
    id: '1',
    name: 'nano-banana-pro',
    imageUrl: "https://l.urusai.cc/5JIDW.png",
    isVIP: true,
    isSelected: true,
  },
  {
    id: '2',
    name: 'nano-banana',
    imageUrl: "https://l.urusai.cc/04tJv.png",
    isVIP: true,
    isSelected: false,
  },
  {
    id: '3',
    name: 'nano-banana-pro-vt',
    imageUrl: "https://l.urusai.cc/MInkY.png",
    isVIP: false,
    isSelected: false,
  },
  {
    id: '4',
    name: 'nano-banana-pro-cl',
    imageUrl: "https://l.urusai.cc/kYvh8.png",
    isVIP: false,
    isSelected: false,
  },
  {
    id: '5',
    name: 'nano-banana-pro-vip',
    imageUrl: "https://l.urusai.cc/seBZI.png",
    isVIP: false,
    isSelected: false,
  },
  {
    id: '6',
    name: 'nano-banana-pro-4k-vip',
    imageUrl: "https://l.urusai.cc/FhTtW.png",
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
