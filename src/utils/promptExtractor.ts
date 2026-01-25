/**
 * 智能提示词提取工具
 * 支持多种数据格式，自动选择最佳提示词内容
 */

/**
 * 验证提示词内容是否有效
 */
function isValidPrompt(text: string): boolean {
  if (!text || text.trim().length < 10) return false;

  const trimmed = text.trim();

  // 过滤无效模式
  const invalidPatterns = [
    /^(N\/A|none|无|暂无|empty|null)$/i,  // 默认占位符
    /^https?:\/\//,  // 纯URL
    /^\d+$/,  // 纯数字
    /^[{}\[\]"]$/,  // 空的JSON
  ];

  return !invalidPatterns.some(pattern => pattern.test(trimmed));
}

/**
 * 从单个数据项中提取提示词
 */
function extractPromptFromItem(item: any): string | null {
  // 1. 如果是字符串，直接验证并返回
  if (typeof item === 'string') {
    const trimmed = item.trim();
    return isValidPrompt(trimmed) ? trimmed : null;
  }

  // 2. 如果不是对象，无法处理
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  // 3. 优先级1: 查找明确的 prompt 关键字
  const promptKeys = [
    'prompt', 'Prompt', 'PROMPT',
    '提示词',
    'positive', 'positive_prompt',  // Stable Diffusion 常见格式
    'text', 'content'  // 通用文本字段
  ];

  for (const key of promptKeys) {
    if (item[key] && typeof item[key] === 'string') {
      const trimmed = item[key].trim();
      if (isValidPrompt(trimmed)) {
        console.log(`[PromptExtractor] 从字段 "${key}" 提取到提示词, 长度:`, trimmed.length);
        return trimmed;
      }
    }
  }

  // 4. 优先级2: 语言特定内容（优先中文，然后英文）
  const langKeys = ['zh', 'cn', 'chinese', 'en', 'english'];
  for (const key of langKeys) {
    if (item[key] && typeof item[key] === 'string') {
      const trimmed = item[key].trim();
      if (isValidPrompt(trimmed)) {
        console.log(`[PromptExtractor] 从语言字段 "${key}" 提取到提示词, 长度:`, trimmed.length);
        return trimmed;
      }
    }
  }

  // 5. 优先级3: 查找最长的有效字符串字段
  const candidates = Object.values(item)
    .filter(v => typeof v === 'string')
    .map(s => s.trim())
    .filter(isValidPrompt);

  if (candidates.length > 0) {
    const best = candidates.sort((a, b) => b.length - a.length)[0];
    console.log(`[PromptExtractor] 从对象中找到 ${candidates.length} 个字符串候选, 选择最长的, 长度:`, best.length);
    return best;
  }

  console.warn('[PromptExtractor] 未能从对象中提取到有效提示词');
  return null;
}

/**
 * 智能提取最佳提示词（主函数）
 * 支持多种输入格式：
 * - 字符串: 直接使用
 * - 对象: 从字段中提取
 * - 数组: 遍历所有元素，选择最长的有效提示词
 *
 * @param prompts - 提示词数据（可能是字符串、对象或数组）
 * @returns 提取到的最佳提示词，如果失败则返回空字符串
 */
export function smartExtractPrompt(prompts: any): string {
  console.log('=== [PromptExtractor] 开始提取提示词 ===');
  console.log('[PromptExtractor] 输入类型:', typeof prompts, Array.isArray(prompts) ? '数组' : '');
  console.log('[PromptExtractor] 原始数据:', JSON.stringify(prompts, null, 2));

  // 情况1: 空值
  if (!prompts) {
    console.warn('[PromptExtractor] 输入为空或null');
    return "";
  }

  // 情况2: 单个字符串
  if (typeof prompts === 'string') {
    const trimmed = prompts.trim();
    if (isValidPrompt(trimmed)) {
      console.log('[PromptExtractor] ✅ 提取到字符串提示词, 长度:', trimmed.length);
      console.log('[PromptExtractor] 内容:', trimmed);
      return trimmed;
    } else {
      console.warn('[PromptExtractor] 字符串内容无效或太短');
      return "";
    }
  }

  // 情况3: 单个对象
  if (typeof prompts === 'object' && !Array.isArray(prompts)) {
    const extracted = extractPromptFromItem(prompts);
    if (extracted) {
      console.log('[PromptExtractor] ✅ 从对象提取到提示词, 长度:', extracted.length);
      console.log('[PromptExtractor] 内容:', extracted);
      return extracted;
    }
    return "";
  }

  // 情况4: 数组 - 遍历所有元素找到最佳提示词
  if (Array.isArray(prompts)) {
    console.log(`[PromptExtractor] 处理数组，共 ${prompts.length} 个元素`);

    const candidates: Array<{ index: number; content: string; length: number }> = [];

    for (let i = 0; i < prompts.length; i++) {
      const extracted = extractPromptFromItem(prompts[i]);
      if (extracted) {
        candidates.push({
          index: i,
          content: extracted,
          length: extracted.length
        });
        console.log(`[PromptExtractor] 数组[${i}]提取到提示词, 长度:`, extracted.length);
      }
    }

    if (candidates.length > 0) {
      // 按长度排序，选择最长的（通常最完整）
      candidates.sort((a, b) => b.length - a.length);
      const best = candidates[0];

      console.log(`[PromptExtractor] ✅ 选择了最佳提示词 (数组索引${best.index}), 长度:`, best.length);
      console.log('[PromptExtractor] 内容:', best.content);

      // 如果有多个候选，记录日志说明选择了哪个
      if (candidates.length > 1) {
        console.log('[PromptExtractor] 其他候选:', candidates.slice(1).map(c => `[${c.index}]长度${c.length}`));
      }

      return best.content;
    } else {
      console.warn('[PromptExtractor] 数组中未能提取到任何有效提示词');
    }
  }

  console.error('[PromptExtractor] ❌ 未能提取到有效提示词');
  return "";
}

/**
 * 提取提示词（带类型安全的版本）
 */
export function extractPromptsSafely(prompts: unknown): string {
  try {
    return smartExtractPrompt(prompts);
  } catch (error) {
    console.error('[PromptExtractor] 提取过程出错:', error);
    return "";
  }
}
