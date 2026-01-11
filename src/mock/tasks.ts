/**
 * Mock任务数据
 */

export type TaskStatus = 'private' | 'public' | 'failed' | 'processing'

export interface MockTask {
  id: string
  imageUrl?: string
  category: string
  time: string
  status: TaskStatus
  progress?: number
  likes?: number
}

export const mockTasks: MockTask[] = [
  {
    id: '1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0EwshS4_b4_jIemoAE3D3LkNCwemtGMZXvLgOsiLTyuh214wMXd4yalpLnvRBl1o05H42kHhybIzzrjhv0eOdLgSRUIRbaPvycUzC3biy88LRDVTmsLQscFETanbLF9bc6uPARqNyCj_PzBQbjH_o072-08GP4h02WCSmT0Ji8SLkOgRq5nkQE79A_cGOoreOv988wO_uL0O79hcF7Dovj6dKZCE8kcdwvXjXMU-tC51moco90i-IFro9FsuV-74s8c5fNGHHMuL',
    category: '赛博朋克',
    time: '2分钟前',
    status: 'private',
  },
  {
    id: '2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2P1CTC2q63eNKzT2Mc3fZducA4rFw3fmJnrojDqVNyFU25lL6XuHIPN678wP89cTADkHBj4k4POytEhbtk8bcrkn_Ka60GUt_XOZ_lXlhkRA36uHn7XDyDi4Z2wnsJR_QvUYMDCVCISamsCW1cDURgL2Y5H0k97niQl0N54LrLMjUIEcOOB9yTLiLLSdmIlQnN9bbppO_VBAhZB03cB8kDW6DfJKTZfw1lXZB8Q1u_VfZ9vtAwLHNrfS0e1D_qJM95y9OzTvaLeZz',
    category: '3D写实',
    time: '15分钟前',
    status: 'public',
    likes: 128,
  },
  {
    id: '3',
    status: 'failed',
    category: '失败任务',
    time: '1小时前',
  },
  {
    id: '4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnYJ8OanFn5fqjh4pugl9e9iaZbD6sgjGRouUFrmhkYBgO10nYGlJMXxdFwEhJPmDlsMy02fm4zhSJ5z2WOFCSMzgYwUHy45coVHON4-wZ4qNUJrHIHosJpkrs35uUKAw4KEiPer29o7yC_YUWfSqcd-Q9WhOEr9hPvQo-r9nFw7HzONOROnyTtKINwNXFcSKNkWH-aR1k4otwr5-X2EF8zJ9IcQKIGv9P9No38A7jvXUuEMS8cJXiCsmUlNFn4gQp6P-_z1foxEZ',
    category: '生成中',
    time: '刚刚',
    status: 'processing',
    progress: 45,
  },
]
