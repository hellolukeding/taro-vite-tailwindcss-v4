# 小程序用户体验优化设计方案

**日期：** 2025-01-28
**目标：** 优化首页性能、改进交互反馈、提升代码质量

## 一、问题分析

### 核心问题
1. **首页性能问题** - 图片加载多，滚动卡顿，等待时间长
2. **反馈不足** - 点击按钮后没反应，不知道是否成功或失败
3. **操作便利性** - 删除/发布没有确认，容易误操作

### 技术债务
- 代码重复：Loading、EmptyState 处理分散
- 缺少统一的组件库
- 错误处理不统一

## 二、架构设计

### 组件结构
```
Index (主页面)
├── SearchBar (已独立)
├── CategoryTabs (分类栏) - 新提取
├── VirtualWaterfall (虚拟瀑布流) - 核心组件
│   ├── WaterfallItem (瀑布流项)
│   │   ├── WorkCard (作品卡片)
│   │   │   ├── LazyImage (懒加载图片) - 新组件
│   │   │   └── WorkFooter (作品底部信息)
│   ├── LoadMoreTrigger (加载更多触发器)
│   └── PullToRefresh (下拉刷新)
└── FullScreenEdit (全屏编辑) - 待提取
```

### 数据流优化
1. **首屏快速渲染** - 只渲染可见区域 + 上下各 2-3 个卡片
2. **图片懒加载** - 使用 IntersectionObserver API
3. **智能预加载** - 预加载下一屏图片（低质量占位图 + 高质量图）
4. **列表缓存** - 使用 React.memo 和 useMemo

### 技术栈
- Taroify 的 `ScrollView` + `PullRefresh`
- Taro 的 `IntersectionObserver`
- React 的性能优化 hooks
- TailwindCSS（所有样式）
- 组件放在 `@/components/business/`

## 三、核心组件设计

### 1. LazyImage 组件
**文件：** `@/components/business/LazyImage/index.tsx`

**功能：**
- 默认显示灰色占位块（bg-gray-200 animate-pulse）
- 进入视口时加载真实图片
- 支持低质量占位图
- 加载失败显示占位图

**实现要点：**
- 使用 Taro 的 `IntersectionObserver` API
- 监听图片可见性
- 只有进入视口才加载

### 2. VirtualWaterfall 组件
**文件：** `@/components/business/VirtualWaterfall/index.tsx`

**功能：**
- 保持双列布局
- 优化渲染策略
- 使用 `ScrollView` 的事件
- React.memo 缓存已渲染项

**实现要点：**
- 分离左列和右列数据源
- 各自独立计算高度
- 只维护可见区域 items

### 3. Loading 组件
**文件：** `@/components/business/Loading/index.tsx`

**三种模式：**
- **Spinner** - 旋转图标（用于按钮、卡片内部）
- **Skeleton** - 骨架屏（用于列表、卡片占位）
- **FullScreen** - 全屏遮罩（用于页面级加载）

**样式：** 全部使用 TailwindCSS 动画

### 4. EmptyState 组件
**文件：** `@/components/business/EmptyState/index.tsx`

**功能：**
- 接收 `type` 参数：'no-data' | 'no-search-result' | 'network-error'
- 使用 emoji 或图标
- 提供可选的 `action` 按钮回调
- TailwindCSS 居中布局

### 5. CategoryTabs 组件
**文件：** `@/components/business/CategoryTabs/index.tsx`

**功能：**
- 从首页提取
- 使用 Taroify 的 `Tabs`
- 接收 `categories` 和 `value` props
- 回调 `onChange`

### 6. Confirm 组件
**文件：** `@/components/business/Confirm/index.tsx`

**功能：**
- 统一确认弹窗
- 用于删除、发布等危险操作
- 使用 Taroify 的 `Dialog`

## 四、操作反馈增强

### 现有工具扩展
在 `@/utils/toast` 基础上增加：

1. **操作确认** - `Confirm.confirm()` 统一确认弹窗
2. **操作成功反馈** - 成功动画 + 简短提示（Taroify Toast）
3. **加载进度** - 长时间操作显示进度（如上传图片）

## 五、实施计划

### 阶段一：公共组件库（1天）
- [ ] 创建 Loading 组件（Spinner/Skeleton/FullScreen）
- [ ] 创建 EmptyState 组件
- [ ] 创建 CategoryTabs 组件
- [ ] 创建 Confirm 组件

### 阶段二：图片懒加载（1天）
- [ ] 创建 LazyImage 组件
- [ ] IntersectionObserver 实现
- [ ] 占位图、错误处理、渐进加载
- [ ] 单元测试

### 阶段三：首页改造（1-2天）
- [ ] 创建 VirtualWaterfall 组件
- [ ] 重构首页组件架构
- [ ] 应用 LazyImage
- [ ] 添加 Skeleton 占位
- [ ] 性能测试和优化

### 阶段四：其他页面应用（半天）
- [ ] 资产页应用 LazyImage
- [ ] 统一 Loading/EmptyState 使用

## 六、文件结构

```
src/components/business/
├── Loading/
│   ├── index.tsx
│   ├── Spinner.tsx
│   ├── Skeleton.tsx
│   └── index.scss
├── EmptyState/
│   ├── index.tsx
│   └── index.scss
├── LazyImage/
│   ├── index.tsx
│   └── index.scss
├── VirtualWaterfall/
│   ├── index.tsx
│   ├── WaterfallItem.tsx
│   └── index.scss
├── CategoryTabs/
│   ├── index.tsx
│   └── index.scss
└── Confirm/
    ├── index.tsx
    └── index.scss
```

## 七、成功标准

### 性能指标
- 首屏渲染时间 < 1秒
- 滚动帧率 > 50fps
- 图片加载时间减少 50%

### 用户体验
- 加载状态清晰可见
- 操作反馈及时
- 误操作风险降低

### 代码质量
- 代码重复减少 > 30%
- 组件可复用性提高
- 维护成本降低

## 八、预计时间

**总计：** 3-4 天
