# 任务详情页功能说明

## 功能概述

任务详情页允许用户查看已完成任务的详细信息，并控制任务的发布状态。已发布的任务会在广场中展示，其他用户可以点赞、收藏和评论。

## 页面位置

- **路由**: `/packageDetail/pages/task-detail/index`
- **参数**: `id` - 任务ID

## 功能特性

### 1. 任务展示

#### 1.1 图片展示
- 全屏显示任务生成的图片
- 支持点击预览大图
- 如果图片不存在，显示占位符
- 右下角显示"点击全屏"提示

#### 1.2 提示词内容
- 显示生成图片时使用的提示词
- 支持一键复制提示词
- 渐变背景卡片设计

#### 1.3 生成参数
- 模型名称
- 图片尺寸 (width x height)
- 生成步数 (steps)
- CFG 强度
- 随机种子 (seed)

#### 1.4 任务信息
- 创建时间
- 完成时间
- 消耗积分
- 错误信息（如果失败）

### 2. 发布控制

#### 2.1 私有状态 (can_publish)
- 显示"私有状态"提示
- 如果任务已完成，显示"发布作品"按钮
- 显示"💡 发布到广场后，其他用户可以点赞、收藏和评论"提示
- 提供删除按钮

#### 2.2 审核中状态 (is_auditing)
- 显示黄色"作品审核中"卡片
- 显示沙漏图标 ⏳
- 提示"审核通过后将公开展示，请耐心等待"
- 不显示任何操作按钮

#### 2.3 已公开状态 (is_public)
- 显示绿色"已公开发布"卡片
- 显示对勾图标 ✓
- 提示"作品正在广场中展示，其他用户可以点赞和收藏"
- 显示"取消发布"和"分享"按钮

### 3. 统计数据（仅已发布任务）

#### 3.1 点赞数
- 红色心形图标
- 显示点赞总数

#### 3.2 评论数
- 蓝色消息图标
- 显示评论总数

#### 3.3 收藏数
- 黄色火焰图标
- 显示收藏总数

### 4. 操作功能

#### 4.1 发布作品
- **条件**: 任务已完成 (status === 3) 且为私有状态 (publish_status === 0)
- **操作**: 调用 `assetsApi.publishTask(taskId)`
- **结果**: 任务状态变为"审核中"
- **提示**: "提交审核成功"

#### 4.2 取消发布
- **条件**: 任务已发布或审核中
- **操作**: 调用 `assetsApi.unpublishTask(taskId)`
- **确认**: 显示二次确认弹窗
- **结果**: 任务状态变为"私有"

#### 4.3 删除任务
- **条件**: 任务已完成或失败
- **操作**: 调用 `assetsApi.deleteTask(taskId)`
- **确认**: 显示二次确认弹窗（红色）
- **结果**: 任务被软删除，返回上一页

#### 4.4 分享作品
- **条件**: 任务已公开
- **操作**: 触发小程序分享菜单
- **提示**: "请点击右上角分享"
- **限制**: 如果任务未发布，提示"请先发布作品后再分享"

#### 4.5 复制提示词
- **操作**: 将提示词复制到剪贴板
- **提示**: "复制成功"

#### 4.6 全屏预览
- **操作**: 点击图片调用 `Taro.previewImage`
- **功能**: 支持缩放、保存等原生功能

## API 接口

### 后端接口

#### 1. 获取任务详情
```
GET /api/v1/miniprogram/assets/task/{task_id}
```

**响应**:
```typescript
{
  success: true,
  data: {
    task_id: string
    status: number
    status_text: string
    image_url: string
    thumbnail_url: string
    prompt: string
    model_id: string
    model_name: string
    cost: number
    is_vip: boolean
    created_at: string
    updated_at: string
    completed_at: string | null
    progress: number
    error_message: string | null
    publish_status: number
    publish_status_text: string
    can_publish: boolean
    is_auditing: boolean
    is_public: boolean
    parameters: {
      width?: number
      height?: number
      steps?: number
      cfg_scale?: number
      seed?: number
    } | null
    stats: {
      likes_count: number
      comments_count: number
      favorites_count: number
    } | null
  }
}
```

#### 2. 发布作品
```
POST /api/v1/miniprogram/assets/publish/{task_id}
```

**响应**:
```typescript
{
  success: true,
  message: "作品已提交审核,审核通过后将公开展示"
}
```

#### 3. 取消发布
```
DELETE /api/v1/miniprogram/assets/publish/{task_id}
```

**响应**:
```typescript
{
  success: true,
  message: "已取消公开"
}
```

#### 4. 删除任务
```
DELETE /api/v1/miniprogram/assets/task/{task_id}
```

**响应**:
```typescript
{
  success: true,
  message: "删除成功"
}
```

### 前端 API

文件位置: `src/api/assets.ts`

```typescript
export interface TaskDetail {
  // ... (详细类型定义见文件)
}

export const assetsApi = {
  // 获取任务详情
  async getTaskDetail(taskId: string): Promise<TaskDetail>

  // 发布作品
  async publishTask(taskId: string): Promise<{success: boolean, message: string}>

  // 取消发布
  async unpublishTask(taskId: string): Promise<{success: boolean, message: string}>

  // 删除任务
  async deleteTask(taskId: string): Promise<{success: boolean, message: string}>
}
```

## 组件结构

### TaskDetail (主页面)
- `packageDetail/pages/task-detail/index.tsx`
- 负责数据加载、状态管理、页面布局

### TaskDetailHero
- `components/business/TaskDetailHero/index.tsx`
- 显示任务图片，支持全屏预览

### TaskDetailContent
- `components/business/TaskDetailContent/index.tsx`
- 显示提示词内容，支持复制

### TaskDetailParameters
- `components/business/TaskDetailParameters/index.tsx`
- 显示生成参数（模型、尺寸、步数等）

### TaskDetailStats
- `components/business/TaskDetailStats/index.tsx`
- 显示统计数据（点赞、评论、收藏）

### TaskDetailActions
- `components/business/TaskDetailActions/index.tsx`
- 显示操作按钮（发布、取消、删除、分享）

## 样式设计

### 颜色方案
- **主色**: 蓝色 (#3B82F6)
- **成功色**: 绿色 (#10B981)
- **警告色**: 黄色 (#FBBF24)
- **危险色**: 红色 (#F43F5E)
- **灰色**: 灰色系 (#6B7280, #9CA3AF)

### 圆角
- **卡片**: 2rem (rounded-2xl)
- **按钮**: 1.5rem (rounded-2xl)
- **全屏图片**: 2.5rem (rounded-b-4xl)

### 渐变
- **背景**: `from-gray-50 to-gray-100`
- **主按钮**: `from-blue-500 to-blue-600`

## 使用示例

### 从资产页跳转
```typescript
// pages/assets/index.tsx
const handleTaskClick = (task: TaskItem) => {
  // 只允许查看已完成的任务
  if (task.status !== 3) {
    Taro.showToast({
      title: "任务未完成，无法查看详情",
      icon: "none"
    });
    return;
  }

  Taro.navigateTo({
    url: `/packageDetail/pages/task-detail/index?id=${task.task_id}`,
  });
};
```

### 直接访问
```typescript
Taro.navigateTo({
  url: '/packageDetail/pages/task-detail/index?id=task-xxx'
});
```

## 权限控制

### 登录检查
- 所有操作都需要用户登录
- 未登录用户会看到登录提示

### 权限验证
- 只能查看自己的任务
- 只能操作自己的任务

### 状态限制
- 只能发布已完成的任务
- 只能删除已完成或失败的任务
- 审核中的任务不能发布

## 错误处理

### 加载失败
- 显示友好的错误提示
- 提供重试按钮

### API 错误
- 显示具体错误信息
- 不崩溃，优雅降级

### 网络错误
- 提示用户检查网络
- 允许重试操作

## 性能优化

### 图片加载
- 使用 `lazyLoad` 懒加载
- 使用缩略图作为预览
- 全屏预览才加载原图

### 数据缓存
- 避免重复请求
- 操作后自动刷新数据

### 用户体验
- Loading 骨架屏
- 操作防抖
- 友好的提示信息

## 后续优化建议

### 功能增强
1. 添加"编辑提示词"功能
2. 添加"重新生成"功能
3. 添加"下载图片"功能
4. 添加"设置封面"功能

### 交互优化
1. 添加图片对比功能
2. 添加参数历史记录
3. 添加相似作品推荐
4. 添加评论功能

### 数据展示
1. 添加生成时间统计
2. 添加模型使用统计
3. 添加积分消耗趋势
4. 添加作品质量评分

## 相关文件

### 后端
- `src/interface/api/routers/assets.py` - 路由定义
- `src/application/services/asset_service.py` - 业务逻辑
- `src/infrastructure/database/models/image_task_model.py` - 数据模型

### 前端
- `src/api/assets.ts` - API 接口
- `src/pages/assets/index.tsx` - 资产列表页
- `packageDetail/pages/task-detail/index.tsx` - 任务详情页
- `src/components/business/TaskDetail*/` - 详情页组件

## 测试建议

### 功能测试
1. 测试不同状态的任务展示
2. 测试发布/取消发布流程
3. 测试删除任务确认
4. 测试复制提示词功能

### 边界测试
1. 测试未完成任务的访问限制
2. 测试网络错误处理
3. 测试权限验证
4. 测试并发操作

### UI 测试
1. 测试不同屏幕尺寸适配
2. 测试图片加载性能
3. 测试动画流畅性
4. 测试颜色对比度
