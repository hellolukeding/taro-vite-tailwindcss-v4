/**
 * Mock Prompt Detail 数据
 *
 * ⚠️ 注意：这些是仅用于开发和演示的Mock数据
 * 生产环境应该从后端API获取真实数据
 * 不要在生产代码中直接使用这些Mock数据作为默认值
 */

export interface MockComment {
  id: string
  avatar: string
  username: string
  time: string
  content: string
  likes: number
}

export interface MockPromptDetail {
  id: string
  imageUrl: string
  prompt: string
  params: string
  model: string
  ratio: string
  steps: number
  seed: string
  sampler: string
  likes: number
  bookmarks: number
  liked: boolean
  bookmarked: boolean
  comments: MockComment[]
}

export const mockPromptDetail: MockPromptDetail = {
  id: '1',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEtdNt2OW29EcbEZig3L3ig8RUl0exIM8nck-DEQxWVXFr48AbXMJ2k5BsFZTXJVxfrIb5jHjrxEJ6d59EXnB5j4ZjSVG-4jQa7QZF2MlmNLbfwIarwp-99Ocb-7UlW8cs0ciocItC9WPs8LJpCywHq5Tz33S-vKYjgi49qhJLZi4Fe-AGdY7SxKQZeROchkAeoF30uENgiPPXFyuF9Nuhrd0U3am6dKOBsZsQdT-qIdhFEIp3TIeW1Ahanrna8_2RY9mZbYEjHeWg',
  prompt: 'A futuristic cyberpunk street scene at night, neon lights reflecting on wet pavement, towering skyscrapers with holographic advertisements, heavy rain, cinematic lighting, 8k resolution, highly detailed, photorealistic, wide angle shot',
  params: '--ar 4:5 --v 6.0 --s 250',
  model: 'SDXL 1.0',
  ratio: '4:5',
  steps: 30,
  seed: '2847102934',
  sampler: 'Euler a (Karras)',
  likes: 1200,
  bookmarks: 300,
  liked: false,
  bookmarked: false,
  comments: [
    {
      id: '1',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf5sWJhylhkSqQx2SOBguyftYXWdmho9bExxVJwAoIzKZN8yiZhdG4M4np-TPUm1GThqDUudp5aNxHS41AgKpmpXhCsSLVkvFJ5uVT5v3JC31H7EOi7VhvYw8BVB5T8MiR6H1AHg9JG8ZY93uVNyLZDiroM3YjsRo0yksUv5KorBn2LN58Qfwsbb9wh6VrC284JU-s3UqnIOuT2UdhOKi9zzSmyGy2Ca3zubIjr5HhC_JAjymwuwXRMfkGfoStqwpoJfvrNYrbEeev',
      username: 'CyberArtist',
      time: '2h ago',
      content: "太棒的构图! Can you share the LoRA you used for the neon effects? The details on the pavement reflections are insane.",
      likes: 24,
    },
    {
      id: '2',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4_sh2NKFU2mwquHXPuA0kw4tEff9qSfqPByMwgi8RDxRbcXiRtQ35M8KdVOWmxDHae23kLR862Iu7IrU1RYckvW3bLl6halQ5YzI0RDgLY7Tv0YQuypkLPDrfEgpAHUA8e2EYD5m6lw0c-lV2qIR5WzLMb2V4p-6jOwtGqxhGAy3ucGi0hoZj_RZ1-O1I0ujxYsdpmfkCymwVj6tmlABDjbMngbfH7MITc4jMFujoQlAM5NDq0UysM4L4YpD_h6A08HPpOSdLriLA',
      username: 'AnnieDesign',
      time: '5h ago',
      content: '这个光影处理得非常好，学习了！Prompt里的 "cinematic lighting" 真的很关键。希望下次能出个教程！',
      likes: 12,
    },
  ],
}
