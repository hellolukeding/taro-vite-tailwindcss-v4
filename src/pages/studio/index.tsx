import { studioApi } from "@/api";
import CommonWarp from "@/components/CommonWarp";
import { GenerateBar } from "@/components/business/GenerateBar";
import ImgUploader from "@/components/business/ImgUploader";
import { PromptInput } from "@/components/business/PromptInput";
import { RatioSelector } from "@/components/business/RatioSelector";
import ResolutionSelector from "@/components/business/ResolutionSelector";
import { StudioModelSelector } from "@/components/business/StudioModelSelector";
import { useAuth } from "@/hooks/useAuth";
import { mockPromptExamples, type MockModel } from "@/mock/studio";
import { receivePromptFromTransfer } from "@/utils/promptTransfer";
import { useUser } from "@/store";
import type { ModelInfo } from "@/types";
import { ArrowLeft } from "@taroify/icons";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import type { Uploader } from "@taroify/core";
import { useEffect, useState } from "react";

type ImageRatio =
  | "auto"
  | "1:1"
  | "3:4"
  | "4:3"
  | "16:9"
  | "9:16"
  | "21:9"
  | "3:2"
  | "2:3"
  | "5:4"
  | "4:5";

interface StudioProps { }

const Studio: React.FC<StudioProps> = (props) => {
  const { requireLogin } = useAuth();
  const { userInfo } = useUser();
  const [prompt, setPrompt] = useState("");
  const [models, setModels] = useState<MockModel[]>([]);
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>("auto");
  const [steps, setSteps] = useState(30);
  const [cfg, setCfg] = useState(7.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [userCredits, setUserCredits] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<Uploader.File[]>([]);

  // 加载模型列表
  useEffect(() => {
    loadModels();
  }, []);

  // 处理从提示词详情页传递过来的 prompt（通过智能传输）
  // 使用 useDidShow 而不是 useEffect，因为 tabBar 页面切换时不会重新 mount
  useDidShow(async () => {
    try {
      // 使用智能接收函数（自动检测来源：本地存储或后端接口）
      const promptContent = await receivePromptFromTransfer();

      if (promptContent) {
        // 智能处理不同类型的提示词内容
        let finalPrompt = "";

        if (typeof promptContent === 'string') {
          // 简单字符串，直接使用
          finalPrompt = promptContent;
        } else if (Array.isArray(promptContent)) {
          // 数组：提取最佳提示词
          // 优先选择中文，其次选择英文，否则选择最长的一个
          const candidates = promptContent.filter(p => typeof p === 'string' && p.trim().length > 0);
          if (candidates.length > 0) {
            // 尝试找到中文提示词
            const zhPrompt = candidates.find(p => /[\u4e00-\u9fa5]/.test(p));
            // 按长度排序，选择最长的（通常最完整）
            candidates.sort((a, b) => b.length - a.length);
            finalPrompt = zhPrompt || candidates[0];
          }
        } else if (typeof promptContent === 'object' && promptContent !== null) {
          // JSON对象：尝试常见字段
          const { prompt, zh, en, text, content } = promptContent as any;
          finalPrompt = prompt || zh || en || text || content || "";

          // 如果是嵌套对象，尝试提取最长字符串
          if (!finalPrompt) {
            const allStrings = Object.values(promptContent)
              .filter(v => typeof v === 'string' && v.trim().length > 0);
            if (allStrings.length > 0) {
              allStrings.sort((a, b) => b.length - a.length);
              finalPrompt = allStrings[0];
            }
          }
        }

        if (finalPrompt && finalPrompt.trim().length > 0) {
          setPrompt(finalPrompt);
          console.log('[Studio] ✅ 从提示词详情页接收到 prompt, 长度:', finalPrompt.length);

          // 显示提示，让用户知道提示词已填入
          Taro.showToast({
            title: '已填入提示词',
            icon: 'success',
            duration: 1500
          });
        } else {
          console.warn('[Studio] ⚠️ 接收到空提示词:', promptContent);
          Taro.showToast({
            title: '提示词格式错误',
            icon: 'none',
            duration: 2000
          });
        }
      }
    } catch (error) {
      console.error('[Studio] ❌ 读取 prompt 失败:', error);
    }
  });

  // 当prompt、模型、比例变化时重新估算成本
  useEffect(() => {
    if (prompt && models.find((m) => m.isSelected)) {
      estimateCost();
    }
  }, [prompt, selectedRatio, steps]);

  const loadModels = async () => {
    try {
      const modelInfos: ModelInfo[] = await studioApi.getModels(true);
      const formattedModels: MockModel[] = modelInfos.map((model) => ({
        id: model.model_id,
        name: model.name,
        imageUrl: model.icon,
        isVIP: model.is_vip,
        isSelected: false,
      }));
      setModels(formattedModels);
      // 不再自动选择模型，让用户主动选择
    } catch (error) {
      console.error("Load models error:", error);
      Taro.showToast({ title: "加载模型失败", icon: "none" });
    }
  };

  // 获取分辨率（辅助函数）
  const getResolutionFromRatio = (ratio: ImageRatio): [number, number] => {
    const resolutionMap: Record<ImageRatio, [number, number]> = {
      auto: [1024, 1024],
      "1:1": [1024, 1024],
      "3:4": [768, 1024],
      "4:3": [1024, 768],
      "16:9": [1344, 768],
      "9:16": [768, 1344],
      "21:9": [1536, 640],
      "3:2": [1152, 768],
      "2:3": [768, 1152],
      "5:4": [960, 1152],
      "4:5": [1152, 960],
    };
    return resolutionMap[ratio] || [1024, 1024];
  };

  // 成本估算
  const estimateCost = async () => {
    try {
      const selectedModel = models.find((m) => m.isSelected);
      if (!selectedModel) return;

      const [width, height] = getResolutionFromRatio(selectedRatio);

      const result = await studioApi.estimate({
        model_id: selectedModel.id,
        prompt: prompt,
        parameters: { width, height, steps },
      });

      setEstimatedCost(result.estimated_cost);
      setUserCredits(result.user_credits);

      if (!result.can_afford) {
        Taro.showToast({
          title: `积分不足，需要${result.estimated_cost}积分`,
          icon: "none",
        });
      }
    } catch (error) {
      console.error("Estimate error:", error);
    }
  };

  // Handle model selection (需要登录)
  const handleModelSelect = (modelId: string) => {
    if (!requireLogin()) return;

    setModels((prev) =>
      prev.map((model) => ({
        ...model,
        isSelected: model.id === modelId,
      })),
    );
  };

  // Handle translate (需要登录)
  const handleTranslate = async () => {
    if (!requireLogin()) return;

    if (!prompt.trim()) {
      Taro.showToast({ title: "请输入提示词", icon: "none" });
      return;
    }

    try {
      const result = await studioApi.translate(prompt);
      Taro.showModal({
        title: "翻译结果",
        content: `译文: ${result.translated}`,
        success: (res) => {
          if (res.confirm) setPrompt(result.translated);
        },
      });
    } catch (error) {
      console.error("Translate error:", error);
      Taro.showToast({ title: "翻译失败", icon: "none" });
    }
  };

  // Handle random prompt
  const handleRandom = async () => {
    try {
      const result = await studioApi.getRandomPrompt();
      setPrompt(result.prompt);
    } catch (error) {
      console.error("Random prompt error:", error);
      // 如果API失败，使用本地示例
      const randomIndex = Math.floor(Math.random() * mockPromptExamples.length);
      setPrompt(mockPromptExamples[randomIndex]);
    }
  };

  // Handle generate (需要登录)
  const handleGenerate = async () => {
    if (!requireLogin()) return;

    if (!prompt.trim()) {
      Taro.showToast({ title: "请输入提示词", icon: "none" });
      return;
    }

    const selectedModel = models.find((m) => m.isSelected);
    if (!selectedModel) {
      Taro.showToast({ title: "请选择模型", icon: "none" });
      return;
    }

    // 检查积分是否足够
    if (estimatedCost > userCredits) {
      Taro.showModal({
        title: "积分不足",
        content: "您的积分不足，是否前往充值？",
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: "/packageUser/pages/recharge/index" });
          }
        },
      });
      return;
    }

    setIsGenerating(true);
    try {
      // 请求订阅消息
      try {
        const templateId = process.env.TARO_WECHAT_TASK_COMPLETE_TEMPLATE_ID;
        if (!templateId) {
          console.warn('未配置模板ID（TARO_WECHAT_TASK_COMPLETE_TEMPLATE_ID），跳过订阅消息');
        } else {
          const subscribeResult = await Taro.requestSubscribeMessage({
            tmplIds: [templateId],
          });

          console.log('Subscribe result:', subscribeResult);

          // 检查用户是否同意订阅
          if (subscribeResult[templateId] === 'accept') {
            console.log('用户同意订阅消息');
            // 继续提交任务
          } else if (subscribeResult[templateId] === 'reject') {
            console.log('用户拒绝订阅消息');
            // 用户拒绝，但仍允许继续生成任务
            Taro.showToast({
              title: '您拒绝了订阅消息通知',
              icon: 'none',
              duration: 2000
            });
          } else {
            // 用户可能点击了关闭或其他情况，仍允许继续
            console.log('订阅消息状态:', subscribeResult[templateId]);
          }
        }
      } catch (subscribeError: any) {
        console.error('Request subscribe message error:', subscribeError);
        // 用户拒绝或出错，但仍允许继续生成任务
        // 可能是用户点击了关闭弹窗
        if (subscribeError.errMsg && !subscribeError.errMsg.includes('requestSubscribeMessage:fail')) {
          Taro.showToast({
            title: '订阅消息请求失败，将不接收通知',
            icon: 'none',
            duration: 2000
          });
        }
      }

      // 提交任务（无论用户是否同意订阅）
      const [width, height] = getResolutionFromRatio(selectedRatio);

      // 提取上传的图片路径
      const imageUrls = uploadedImages.map(file => file.url).filter(Boolean);

      const result = await studioApi.submitTask({
        model_id: selectedModel.id,
        prompt: prompt,
        parameters: { width, height, steps, cfg_scale: cfg },
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
      });

      // 显示提交成功的提示
      // client已经自动解包了data，所以result直接就是task数据
      console.log('Submit task result:', result);

      Taro.showToast({
        title: result.message || "任务已提交",
        icon: "success",
        duration: 1500,
      });

      // 清空表单
      setPrompt("");
      setUploadedImages([]);
      setEstimatedCost(0);

      // 延迟跳转到资产页面，让用户看到提示
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/assets/index`,
        });
      }, 500);
    } catch (error: any) {
      console.error("Submit task error:", error);
      Taro.showToast({
        title: error.message || "提交失败",
        icon: "none",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle resolution selection (需要登录)
  const handleResolutionSelect = (resolutionId: string) => {
    if (!requireLogin()) return;

    console.log("Selected resolution:", resolutionId);
  };

  return (
    <CommonWarp title="创作工坊" withHeader={false}>
      <ScrollView scrollY className="h-full bg-gray-50">
        {/* Header Section */}
        <View className="bg-black pt-20 pb-8 px-3 rounded-b-4xl shadow-xl relative z-10">
          {/* Top Bar */}
          <View className="flex justify-between items-center mb-6">
            <View
              className="flex items-center gap-2"
              onClick={() => Taro.navigateBack()}
            >
              <ArrowLeft size={20} color="#fff" />
              <Text className="text-white text-xl font-semibold tracking-wide">
                创作工坊
              </Text>
            </View>
          </View>

          {/* 图片上传 */}
          <ImgUploader
            value={uploadedImages}
            onChange={setUploadedImages}
          />

          {/* Prompt Input */}
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onTranslate={handleTranslate}
            onRandom={handleRandom}
          />
        </View>

        {/* Main Content */}
        <View className="px-5 pb-32">
          {/* Model Selector */}
          <StudioModelSelector models={models} onSelect={handleModelSelect} />

          {/* 选择分辨率 */}
          <ResolutionSelector onSelect={handleResolutionSelect} />

          {/* Ratio Selector */}
          <RatioSelector
            selectedRatio={selectedRatio}
            onSelect={setSelectedRatio}
          />
        </View>
      </ScrollView>

      {/* Generate Bar */}
      <GenerateBar
        cost={estimatedCost}
        balance={userCredits}
        onGenerate={handleGenerate}
        loading={isGenerating}
      />
    </CommonWarp>
  );
};

export default Studio;
