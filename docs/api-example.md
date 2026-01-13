# 小程序API配置使用指南

## 概述

小程序使用Taro框架的HTTP客户端封装，已经配置完成并可直接使用。

## API基础配置

### 1. API Base URL
配置位置：`src/utils/constants.ts`
```typescript
export const API_BASE_URL = 'http://localhost:8000/api/v1'
```

### 2. HTTP客户端
配置位置：`src/api/client.ts`

特性：
- ✅ 自动添加认证Token
- ✅ 401错误自动处理和Token刷新
- ✅ 统一错误提示
- ✅ 请求/响应拦截
- ✅ 支持跳过认证（skipAuth）

## API使用方法

### 基础用法

```typescript
import { studioApi } from '@/api/studio'

// 获取模型列表
const models = await studioApi.getModels()

// 获取随机灵感
const prompt = await studioApi.getRandomPrompt()

// 提交任务
const result = await studioApi.submitTask({
  model_id: 'sdxl-turbo',
  prompt: '一只可爱的猫咪',
  parameters: {
    width: 1024,
    height: 1024,
    steps: 30
  }
})
```

### 获取标签分类列表（新接口）

```typescript
import { studioApi } from '@/api/studio'

// 获取所有提示词标签
const categories = await studioApi.getCategories()

console.log(categories.tags)    // 标签数组: ['architecture', 'cartoon', ...]
console.log(categories.total)   // 标签总数: 22
```

## 可用的API方法

### studioApi

| 方法 | 参数 | 返回类型 | 说明 |
|------|------|----------|------|
| `getModels()` | `isActive?: boolean` | `ModelInfo[]` | 获取可用模型列表 |
| `getRandomPrompt()` | `category?: string` | `RandomPrompt` | 获取随机灵感 |
| `translate()` | `prompt: string` | 翻译结果 | 提示词翻译 |
| `estimate()` | 估算参数 | `TaskEstimate` | 估算任务成本 |
| `submitTask()` | `TaskSubmitParams` | 提交结果 | 提交生图任务 |
| `getTaskStatus()` | `taskId: string` | `TaskStatus` | 查询任务状态 |
| `getCategories()` | - | `{tags: string[], total: number}` | **获取标签列表** |

### authApi

```typescript
import { authApi } from '@/api/auth'

// 微信小程序登录
await authApi.wechatLogin({ code: 'xxx' })

// 获取用户信息
const userInfo = await authApi.getUserInfo()
```

### squareApi

```typescript
import { squareApi } from '@/api/square'

// 获取广场作品列表
const works = await squareApi.getWorks({
  page: 1,
  page_size: 20,
  category: 'anime'
})

// 获取提示词详情
const detail = await squareApi.getPromptDetail('prompt-id')
```

## 在组件中使用

### React组件示例

```typescript
import { useState, useEffect } from 'react'
import { studioApi } from '@/api/studio'
import { View, Text } from '@tarojs/components'

function StudioPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const result = await studioApi.getCategories()
      setCategories(result.tags)
    } catch (error) {
      console.error('加载分类失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      {loading ? (
        <Text>加载中...</Text>
      ) : (
        categories.map(tag => (
          <View key={tag}>{tag}</View>
        ))
      )}
    </View>
  )
}
```

## 错误处理

HTTP客户端会自动处理以下错误：

1. **401 未授权**
   - 自动尝试刷新Token
   - 刷新失败则跳转登录页

2. **业务错误**
   - 自动显示Toast提示
   - 抛出异常供开发者处理

3. **网络错误**
   - 自动显示错误提示

### 手动处理错误

```typescript
try {
  const result = await studioApi.submitTask(params)
} catch (error) {
  // 自定义错误处理
  console.error('提交失败:', error.message)
}
```

### 跳过错误提示

```typescript
// 使用skipErrorTip选项跳过自动提示
const result = await client.get('/api/endpoint', {}, {
  skipErrorTip: true
})
```

## 无需认证的接口

某些接口不需要登录即可使用，通过 `skipAuth: true` 标记：

```typescript
// studioApi.getCategories 已经配置了 skipAuth
async getCategories(): Promise<{tags: string[], total: number}> {
  return client.get('/miniprogram/studio/categories', {}, { skipAuth: true })
}
```

## 开发调试

### 查看请求日志

HTTP客户端会在控制台输出错误日志：

```typescript
console.error('API Request Error:', error)
```

### 修改API地址

开发环境需要修改 `src/utils/constants.ts`：

```typescript
// 本地开发
export const API_BASE_URL = 'http://localhost:8000/api/v1'

// 生产环境
export const API_BASE_URL = 'https://your-api-domain.com/api/v1'
```

## 类型定义

所有API方法都有完整的TypeScript类型定义：

```typescript
// ModelInfo类型
interface ModelInfo {
  model_id: string
  name: string
  icon: string
  is_vip: boolean
  cost_per_image: number
  description: string
  supported_ratios: string[]
  default_ratio: string
}

// TaskStatus类型
interface TaskStatus {
  task_id: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  progress: number
  result_url?: string
}
```

## 常见问题

### Q: 如何处理Token过期？
A: HTTP客户端会自动处理Token刷新，无需手动干预。

### Q: 如何取消请求？
A: 当前版本不支持取消请求，如需要可以升级客户端。

### Q: 如何上传文件？
A: 请参考 `src/api/assets.ts` 中的文件上传方法。

### Q: 如何设置请求超时？
A: 在 `src/api/client.ts` 的 `Taro.request` 中添加 `timeout` 参数。
