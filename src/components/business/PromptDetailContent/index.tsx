import { Text, View } from "@tarojs/components";
import { useState } from "react";

interface PromptData {
  language?: string;
  task?: string;
  consistency_id?: string;
  prompt?: string;
  input_images?: Array<{
    image: string;
    use_as: string;
    priority?: string;
  }>;
  negative_prompt?: string;
  style_parameters?: {
    render_style?: string;
    mood?: string;
    camera_look?: string;
  };
  composition?: {
    shot_type?: string;
    camera_angle?: string;
    subject_position?: string;
    secondary_subject_position?: string;
    background?: string;
    foreground_elements?: string;
  };
  technical_specifications?: {
    aspect_ratio?: string;
    resolution?: string;
    detail_level?: string;
    sharpness?: string;
  };
  output_settings?: {
    format?: string;
    quality?: string;
  };
}

interface StructuredPromptItemProps {
  prompt: string;
  index: number;
  onCopy: (prompt: string) => void;
}

export function StructuredPromptItem({
  prompt,
  index,
  onCopy,
}: StructuredPromptItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [parsedData, setParsedData] = useState<PromptData | null>(null);

  // 尝试解析JSON
  try {
    if (!parsedData) {
      const data = JSON.parse(prompt) as PromptData;
      setParsedData(data);
    }
  } catch {
    // 不是JSON，直接显示
    if (!parsedData) {
      return (
        <View className="bg-gray-50 dark:bg-surface-dark/50 rounded-2xl p-5 border border-gray-100 dark:border-white/5 transition-all mb-3">
          <View
            className="flex items-center justify-between mb-2"
            onClick={() => setExpanded(!expanded)}
          >
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Prompt {index + 1}
            </Text>
            <View className="flex items-center gap-3">
              <Text
                className="text-xs font-medium text-blue-600 dark:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(prompt);
                }}
              >
                复制
              </Text>
              <Text
                className={`text-lg transform transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                ▼
              </Text>
            </View>
          </View>
          <Text
            className={`text-slate-600 text-base font-normal leading-relaxed font-body whitespace-pre-wrap ${!expanded ? "line-clamp-2" : ""}`}
          >
            {prompt}
          </Text>
        </View>
      );
    }
  }

  if (!parsedData) return null;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all mb-3 overflow-hidden">
      {/* 标题栏 */}
      <View
        className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
        onClick={() => setExpanded(!expanded)}
      >
        <View className="flex flex-col">
          <Text className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Prompt {index + 1}
          </Text>
          {(parsedData.task || parsedData.consistency_id) && (
            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {parsedData.task && (
                <Text className="mr-2">📋 {parsedData.task}</Text>
              )}
              {parsedData.consistency_id && (
                <Text>🔗 {parsedData.consistency_id}</Text>
              )}
            </Text>
          )}
        </View>
        <View className="flex items-center gap-3">
          <Text
            className="text-xs font-medium text-blue-600 dark:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(parsedData.prompt || prompt);
            }}
          >
            复制
          </Text>
          <Text
            className={`text-lg transform transition-transform text-slate-500 ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </Text>
        </View>
      </View>

      {expanded && (
        <View className="p-5 flex flex-col gap-4">
          {/* 语言和任务 */}
          {(parsedData.language || parsedData.task) && (
            <View className="flex flex-wrap gap-2">
              {parsedData.language && (
                <View className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {parsedData.language}
                  </Text>
                </View>
              )}
              {parsedData.task && (
                <View className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    📋 {parsedData.task}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 提示词内容 */}
          {parsedData.prompt && (
            <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                提示词
              </Text>
              <Text className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {parsedData.prompt}
              </Text>
            </View>
          )}

          {/* 输入图片 */}
          {parsedData.input_images && parsedData.input_images.length > 0 && (
            <View>
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                输入图片
              </Text>
              {parsedData.input_images.map((img, i) => (
                <View
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 mb-2"
                >
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    用途: {img.use_as}
                    {img.priority && ` | 优先级: ${img.priority}`}
                  </Text>
                  <Text className="text-xs text-slate-600 dark:text-slate-300 font-mono break-all">
                    {img.image}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* 风格参数 */}
          {parsedData.style_parameters && (
            <View>
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                风格参数
              </Text>
              <View className="flex flex-wrap gap-2">
                {parsedData.style_parameters.render_style && (
                  <View className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Text className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {parsedData.style_parameters.render_style}
                    </Text>
                  </View>
                )}
                {parsedData.style_parameters.mood && (
                  <View className="px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                    <Text className="text-xs font-medium text-pink-700 dark:text-pink-300">
                      {parsedData.style_parameters.mood}
                    </Text>
                  </View>
                )}
                {parsedData.style_parameters.camera_look && (
                  <View className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Text className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      {parsedData.style_parameters.camera_look}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 作品构图 */}
          {parsedData.composition && (
            <View>
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                作品构图
              </Text>
              <View className="flex flex-wrap gap-2">
                {parsedData.composition.shot_type && (
                  <View className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                      {parsedData.composition.shot_type}
                    </Text>
                  </View>
                )}
                {parsedData.composition.camera_angle && (
                  <View className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
                    <Text className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                      {parsedData.composition.camera_angle}
                    </Text>
                  </View>
                )}
                {parsedData.composition.subject_position && (
                  <View className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                    <Text className="text-xs font-medium text-teal-700 dark:text-teal-300">
                      主体: {parsedData.composition.subject_position}
                    </Text>
                  </View>
                )}
                {parsedData.composition.secondary_subject_position && (
                  <View className="px-3 py-1.5 bg-lime-100 dark:bg-lime-900/30 rounded-full">
                    <Text className="text-xs font-medium text-lime-700 dark:text-lime-300">
                      次体: {parsedData.composition.secondary_subject_position}
                    </Text>
                  </View>
                )}
                {parsedData.composition.background && (
                  <View className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600/30 rounded-full">
                    <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      背景: {parsedData.composition.background}
                    </Text>
                  </View>
                )}
                {parsedData.composition.foreground_elements && (
                  <View className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Text className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      前景: {parsedData.composition.foreground_elements}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 技术规格 */}
          {parsedData.technical_specifications && (
            <View>
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                技术规格
              </Text>
              <View className="flex flex-wrap gap-2">
                {parsedData.technical_specifications.aspect_ratio && (
                  <View className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Text className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {parsedData.technical_specifications.aspect_ratio}
                    </Text>
                  </View>
                )}
                {parsedData.technical_specifications.resolution && (
                  <View className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Text className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {parsedData.technical_specifications.resolution}
                    </Text>
                  </View>
                )}
                {parsedData.technical_specifications.detail_level && (
                  <View className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Text className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {parsedData.technical_specifications.detail_level}
                    </Text>
                  </View>
                )}
                {parsedData.technical_specifications.sharpness && (
                  <View className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                    <Text className="text-xs font-medium text-violet-700 dark:text-violet-300">
                      {parsedData.technical_specifications.sharpness}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 负面提示词 */}
          {parsedData.negative_prompt && (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <Text className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                负面提示词
              </Text>
              <Text className="text-red-700 dark:text-red-300 text-sm leading-relaxed whitespace-pre-wrap">
                {parsedData.negative_prompt}
              </Text>
            </View>
          )}

          {/* 输出设置 */}
          {parsedData.output_settings && (
            <View className="flex flex-wrap gap-2">
              {parsedData.output_settings.format && (
                <View className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600/30 rounded-full">
                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    格式: {parsedData.output_settings.format}
                  </Text>
                </View>
              )}
              {parsedData.output_settings.quality && (
                <View className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600/30 rounded-full">
                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    质量: {parsedData.output_settings.quality}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

interface PromptDetailContentProps {
  prompts: string[];
  onCopy: (prompt: string) => void;
}

export function PromptDetailContent({
  prompts,
  onCopy,
}: PromptDetailContentProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <View className="flex flex-col gap-3">
      {prompts.map((prompt, index) => (
        <StructuredPromptItem
          key={index}
          prompt={prompt}
          index={index}
          onCopy={onCopy}
        />
      ))}
    </View>
  );
}
