# 智能提示词提取器 (Smart Prompt Extractor)

## 功能概述

`smartExtractPrompt` 是一个智能提示词提取函数，可以从多种数据格式中自动提取最佳的提示词内容。

## 支持的数据格式

### 1. 简单字符串
```typescript
const prompts = "a beautiful landscape with mountains";
const result = smartExtractPrompt(prompts);
// 返回: "a beautiful landscape with mountains"
```

### 2. 字符串数组
```typescript
const prompts = [
  "landscape view",  // 太短，会被跳过
  "a beautiful landscape with mountains and sunset",
  "another prompt"
];
const result = smartExtractPrompt(prompts);
// 返回: "a beautiful landscape with mountains and sunset" (最长的)
```

### 3. 对象数组（多种字段名）
```typescript
const prompts = [
  { prompt: "a beautiful landscape" },
  { zh: "美丽的山水风景", en: "beautiful landscape" },
  { positive: "mountains, sunset, high quality" }
];
const result = smartExtractPrompt(prompts);
// 返回: "mountains, sunset, high quality" (最长的有效内容)
```

### 4. 混合格式
```typescript
const prompts = [
  "simple prompt",
  { prompt: "detailed prompt with more information" },
  { zh: "中文提示词", content: "content field" }
];
const result = smartExtractPrompt(prompts);
// 返回: "detailed prompt with more information" (选择最长的有效内容)
```

### 5. Stable Diffusion 格式
```typescript
const prompts = {
  positive: "a beautiful landscape, mountains, sunset, highly detailed",
  negative: "ugly, blurry, low quality",
  steps: 30,
  cfg_scale: 7.5
};
const result = smartExtractPrompt(prompts);
// 返回: "a beautiful landscape, mountains, sunset, highly detailed"
```

## 提取优先级

函数按以下优先级提取提示词：

### 优先级 1: 明确的 prompt 关键字
- `prompt`, `Prompt`, `PROMPT`
- `提示词`
- `positive`, `positive_prompt`
- `text`, `content`

### 优先级 2: 语言特定字段
- `zh`, `cn`, `chinese` (中文)
- `en`, `english` (英文)

### 优先级 3: 最长的有效字符串
- 查找对象中所有字符串字段
- 过滤无效内容
- 选择最长的那个

## 内容质量验证

函数会自动过滤以下无效内容：

- 长度小于 10 字符的内容
- 默认占位符: `N/A`, `none`, `无`, `暂无`
- 纯 URL
- 纯数字
- 空的 JSON 结构

## 使用示例

```typescript
import { smartExtractPrompt } from '@/utils/promptExtractor';

// 示例 1: 处理从 API 返回的复杂结构
const apiResponse = {
  prompts: [
    {
      prompt: "masterpiece, best quality",
      zh: "杰作，最高质量",
      en: "masterpiece, best quality, ultra detailed"
    }
  ]
};

const extracted = smartExtractPrompt(apiResponse.prompts);
console.log(extracted);
// 输出: "masterpiece, best quality, ultra detailed" (选择了最长的)

// 示例 2: 在提示词详情页使用
const handleCreateSimilar = () => {
  const promptText = smartExtractPrompt(state.data.prompts);

  if (!promptText) {
    toast.error("提示词格式错误或内容为空");
    return;
  }

  // 使用提取的提示词
  Taro.setStorageSync('prompt_from_detail', promptText);
  Taro.switchTab({ url: '/pages/studio/index' });
};
```

## 调试日志

函数会在控制台输出详细的提取过程，方便调试：

```
=== [PromptExtractor] 开始提取提示词 ===
[PromptExtractor] 输入类型: object 数组
[PromptExtractor] 原始数据: [...]
[PromptExtractor] 处理数组，共 3 个元素
[PromptExtractor] 从字段 "prompt" 提取到提示词, 长度: 50
[PromptExtractor] 数组[1]提取到提示词, 长度: 80
[PromptExtractor] 从语言字段 "zh" 提取到提示词, 长度: 30
[PromptExtractor] ✅ 选择了最佳提示词 (数组索引1), 长度: 80
[PromptExtractor] 内容: master piece, best quality, ultra detailed
```

## 错误处理

如果提取失败，函数会返回空字符串，并输出警告日志：

```typescript
const result = smartExtractPrompt(invalidData);
if (!result) {
  console.error("提取失败");
}
```

## 类型安全

提供了带类型检查的安全版本：

```typescript
import { extractPromptsSafely } from '@/utils/promptExtractor';

const result = extractPromptsSafely(prompts);
// 自动捕获异常，保证不会抛出错误
```

## 最佳实践

1. **始终检查返回值**
   ```typescript
   const prompt = smartExtractPrompt(data);
   if (!prompt) {
     // 处理提取失败的情况
     return;
   }
   ```

2. **查看控制台日志**
   - 开发环境下可以查看详细的提取过程
   - 了解函数选择了哪个提示词

3. **处理多种数据源**
   - 函数会自动处理各种格式
   - 不需要预先判断数据类型

## 技术细节

- **类型支持**: 支持字符串、对象、数组及其嵌套组合
- **容错性**: 对无效数据有良好的容错处理
- **性能**: 遍历数组时只提取必要的信息，性能开销小
- **可扩展**: 易于添加新的字段名或验证规则

## 相关文件

- 实现文件: `src/utils/promptExtractor.ts`
- 使用示例: `src/packageDetail/pages/prompt-detail/index.tsx`
