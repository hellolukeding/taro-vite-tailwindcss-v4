/**
 * Mock用户数据
 */

export interface MockUser {
  userId: string
  nickname: string
  avatar: string
  isVIP: boolean
  credits: number
  todayCost: number
  totalWorks: number
}

export const mockUser: MockUser = {
  userId: '88392041',
  nickname: '创意大师_User',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnPh8i7otfD3F1XOmnNbggIEm5SBZ7VMTk1fUCo7ZlBUBaNJxbPb3A9ZIkWTVkNkdM40e4cfV22ZB_2_qNN6B7-j5MybcqVK3sJsGWQTkwQ2CCkCAdH7_1NHcMwmV0VMkuoH6tdlLkNHHehwW8xYvZDlQjqjjCT6LOZrOTGPdhAg4_KI8pX670Mypl3blnTWe1ccm7xgfkOK2H5uT-AKLHXTHF1UDKEMzP9BfbmrzOuvKrDON6m2fpsTWEnASCqPhPKANPNTp0xAj-',
  isVIP: true,
  credits: 2450,
  todayCost: 120,
  totalWorks: 342,
}
