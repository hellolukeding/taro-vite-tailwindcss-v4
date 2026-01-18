/**
 * Mock进行中任务数据
 *
 * ⚠️ 注意：这些是仅用于开发和演示的Mock数据
 * 生产环境应该从后端API获取真实数据
 * 不要在生产代码中直接使用这些Mock数据作为默认值
 */

export interface InProgressTask {
  id: string
  title: string
  description: string
  progress?: number
  status: 'progress' | 'queued'
}

export const mockInProgressTasks: InProgressTask[] = [
  {
    id: '5',
    title: '赛博朋克风格的街道...',
    description: '霓虹灯，雨夜，未来城市，高对比度...',
    progress: 65,
    status: 'progress',
  },
  {
    id: '6',
    title: '印象派日落油画...',
    description: '莫奈风格，睡莲池塘，金色阳光...',
    status: 'queued',
  },
]
