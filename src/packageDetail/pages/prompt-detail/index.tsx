import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import CommentInputBar from "@/components/business/CommentInputBar";
import { PromptDetailComments } from "@/components/business/PromptDetailComments";
import { PromptDetailContent } from "@/components/business/PromptDetailContent";
import { PromptDetailHeader } from "@/components/business/PromptDetailHeader";
import { PromptDetailHero } from "@/components/business/PromptDetailHero";
import { PromptDetailParameters } from "@/components/business/PromptDetailParameters";
import { useAuth } from "@/hooks/useAuth";
import * as promptApi from "@/services/promptApi";
import { mapCommentListFromApi } from "@/utils/commentMapper";
import { smartExtractPrompt } from "@/utils/promptExtractor";
import { transferPromptToStudio } from "@/utils/promptTransfer";
import { toast } from "@/utils/toast";
import { normalizeUrl } from "@/utils/url";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";

interface PromptDetailProps {
  id?: string;
}

interface Comment {
  id: string;
  avatar: string;
  username: string;
  time: string;
  content: string;
  likes: number;
}

interface PromptDetailData {
  id: string;
  imageUrl: string;
  avatar: string;
  username: string;
  followers: number;
  title: string;
  prompts: string[];
  promptParams: string;
  model: string;
  ratio: string;
  steps: number;
  seed: number;
  sampler: string;
  likes: number;
  bookmarks: number;
  liked: boolean;
  bookmarked: boolean;
  comments: Comment[];
}

interface PromptDetailState {
  loading: boolean;
  error: string | null;
  data: PromptDetailData | null;
  liking: boolean;
  bookmarking: boolean;
  comments: Comment[];
  commentsLoading: boolean;
  submittingComment: boolean;
}

const PromptDetail: React.FC<PromptDetailProps> = (props) => {
  // 从路由参数获取 taskId
  const [taskId, setTaskId] = useState<string | null>(null);

  const { requireLoginRedirect } = useAuth();
  const [state, setState] = useState<PromptDetailState>({
    loading: true,
    error: null,
    data: null,
    liking: false,
    bookmarking: false,
    comments: [],
    commentsLoading: false,
    submittingComment: false,
  });

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const router = instance.router;
    const params = router?.params || {};
    const id = params.id || props.id;

    console.log("=== Prompt Detail Page ===");
    console.log("Router params:", params);
    console.log("Props.id:", props.id);
    console.log("TaskId:", id);

    if (!id) {
      console.error("No taskId provided!");
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "缺少作品ID参数",
      }));
    } else {
      setTaskId(id);
    }
  }, [props.id]);

  const handleFullscreen = useCallback(() => {
    if (!state.data?.imageUrl) return;

    Taro.previewImage({
      urls: [state.data.imageUrl],
    });
  }, [state.data?.imageUrl]);

  const handleShare = useCallback(async () => {
    if (!taskId) return;

    try {
      // 不调用后端接口，直接触发小程序分享菜单
      Taro.showShareMenu({
        withShareTicket: true,
      });
      toast.success("请点击右上角分享");
    } catch (err) {
      console.error("分享失败:", err);
      toast.error("分享失败");
    }
  }, [taskId]);

  // 点赞处理
  const handleLike = useCallback(async () => {
    if (!taskId || state.liking || !state.data) return;

    // 检查登录
    const isLogin = await requireLoginRedirect();
    if (!isLogin) return;

    setState((prev) => ({ ...prev, liking: true }));

    try {
      // 根据当前状态调用不同接口
      const result = state.data.liked
        ? await promptApi.unlikePrompt(taskId)
        : await promptApi.likePrompt(taskId);

      // 更新状态（手动反转 liked，因为后端不返回）
      setState((prev) => ({
        ...prev,
        liking: false,
        data: prev.data
          ? {
            ...prev.data,
            liked: !prev.data.liked,
            likes: result.likes_count,
          }
          : null,
      }));
    } catch (err) {
      console.error("点赞失败:", err);
      setState((prev) => ({ ...prev, liking: false }));
    }
  }, [taskId, state.data?.liked, state.liking, requireLoginRedirect]);

  // 收藏处理
  const handleBookmark = useCallback(async () => {
    if (!taskId || state.bookmarking || !state.data) return;

    // 检查登录
    const isLogin = await requireLoginRedirect();
    if (!isLogin) return;

    setState((prev) => ({ ...prev, bookmarking: true }));

    try {
      // 根据当前状态调用不同接口
      const result = state.data.bookmarked
        ? await promptApi.unfavoritePrompt(taskId)
        : await promptApi.favoritePrompt(taskId);

      // 更新状态（手动反转 bookmarked，因为后端不返回）
      setState((prev) => ({
        ...prev,
        bookmarking: false,
        data: prev.data
          ? {
            ...prev.data,
            bookmarked: !prev.data.bookmarked,
            bookmarks: result.favorites_count,
          }
          : null,
      }));
    } catch (err) {
      console.error("收藏失败:", err);
      setState((prev) => ({ ...prev, bookmarking: false }));
    }
  }, [taskId, state.data?.bookmarked, state.bookmarking, requireLoginRedirect]);

  const handleFollow = useCallback(async () => {
    const isLogin = await requireLoginRedirect();
    if (!isLogin) return;
    toast.success("关注成功");
  }, [requireLoginRedirect]);

  // 一键使用：智能传输提示词到 Studio 页面
  const handleCreateSimilar = useCallback(async () => {
    const isLogin = await requireLoginRedirect();
    if (!isLogin) return;

    if (!state.data?.prompts) {
      toast.error("没有可用的提示词");
      return;
    }

    // 智能提取最佳提示词
    let promptContent: any;

    if (Array.isArray(state.data.prompts)) {
      // 如果是数组，取最后一个非空元素
      const nonEmptyPrompts = state.data.prompts.filter((p: any) => p && typeof p === 'string' && p.trim());
      if (nonEmptyPrompts.length > 0) {
        promptContent = nonEmptyPrompts[nonEmptyPrompts.length - 1];
        console.log("[handleCreateSimilar] 从数组中取最后一个提示词，共", nonEmptyPrompts.length, "个");
      } else {
        promptContent = state.data.prompts[state.data.prompts.length - 1];
      }
    } else if (typeof state.data.prompts === 'object' && state.data.prompts !== null) {
      // 如果是对象，优先使用 zh（中文），其次 en（英文）
      const { zh, en } = state.data.prompts as any;
      promptContent = zh || en;
      console.log("[handleCreateSimilar] 从对象中提取，优先中文:", zh ? '有' : '无', en ? '有' : '无');
    } else {
      // 其他情况（字符串），直接使用
      promptContent = state.data.prompts;
    }

    if (!promptContent) {
      toast.error("提示词格式错误或内容为空");
      console.error("[handleCreateSimilar] 提取失败, 原始数据:", state.data.prompts);
      return;
    }

    console.log("[handleCreateSimilar] ✅ 准备传输提示词, 类型:", typeof promptContent, "长度:", promptContent?.length);
    console.log("[handleCreateSimilar] 提示词内容预览:", promptContent?.substring(0, 50) + "...");

    try {
      // 使用智能传输函数（自动选择本地存储或后端接口）
      const success = await transferPromptToStudio(promptContent, {
        onSuccess: (method) => {
          console.log(`[handleCreateSimilar] ✅ 传输成功 (方式: ${method})`);
          toast.success(method === "backend" ? "已保存到云端" : "准备就绪");
        },
        onError: (error) => {
          console.error("[handleCreateSimilar] ❌ 传输失败:", error);
          toast.error("传输失败，请重试");
        },
      });

      if (success) {
        // 跳转到 tabBar 页面，使用 switchTab
        Taro.switchTab({
          url: '/pages/studio/index',
          fail: (err) => {
            console.error('[handleCreateSimilar] switchTab 失败，尝试 redirectTo:', err);
            // 降级方案：使用 redirectTo（如果小程序支持）
            Taro.redirectTo({
              url: '/pages/studio/index',
              fail: (err2) => {
                console.error('[handleCreateSimilar] redirectTo 也失败:', err2);
                toast.error("跳转失败，请手动前往创作页面");
              }
            });
          }
        });
      } else {
        toast.error("传输失败，请重试");
      }
    } catch (error) {
      console.error("跳转失败:", error);
      toast.error("操作失败");
    }
  }, [requireLoginRedirect, state.data?.prompts]);

  const handleCopyPrompt = useCallback((prompt: string) => {
    if (!prompt) return;

    Taro.setClipboardData({
      data: prompt,
      success: () => {
        toast.success("复制成功");
      },
    });
  }, []);

  // 加载评论列表
  const loadComments = useCallback(async () => {
    if (!taskId) return;

    setState((prev) => ({ ...prev, commentsLoading: true }));

    try {
      const result = await promptApi.getComments("prompt", taskId);
      const mappedComments = mapCommentListFromApi(result.items || []);
      setState((prev) => ({
        ...prev,
        comments: mappedComments,
        commentsLoading: false,
      }));
    } catch (err) {
      console.error("加载评论失败:", err);
      setState((prev) => ({ ...prev, commentsLoading: false }));
    }
  }, [taskId]);

  // 提交评论
  const handleSubmitComment = useCallback(
    async (content: string) => {
      if (!taskId) return;

      const isLogin = await requireLoginRedirect();
      if (!isLogin) return;

      setState((prev) => ({ ...prev, submittingComment: true }));

      try {
        await promptApi.createComment("prompt", taskId, content);
        // 重新加载评论列表
        await loadComments();
        toast.success("评论成功");
      } catch (err) {
        console.error("评论失败:", err);
        toast.error("评论失败");
      } finally {
        setState((prev) => ({ ...prev, submittingComment: false }));
      }
    },
    [taskId, loadComments, requireLoginRedirect],
  );

  // 数据加载函数 - 提升到顶层以便重试按钮调用
  const loadDetail = useCallback(async () => {
    if (!taskId) {
      console.log("No taskId provided");
      return;
    }

    console.log("Loading detail for taskId:", taskId);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 加载提示词详情
      const detail = await promptApi.getWorkDetail(taskId);
      console.log("Prompt detail loaded:", detail);

      // 数据映射：后端字段 → 前端字段
      const mappedData: PromptDetailData = {
        id: detail?.prompt_id || taskId,
        imageUrl: normalizeUrl(detail?.cover_image || detail?.examples?.[0]),
        avatar: normalizeUrl(detail?.user_avatar),
        username: detail?.user_nickname || "Unknown",
        followers: 0, // 后端暂未提供
        title: detail?.title || "Untitled",
        // prompts 是数组，保存完整数组
        prompts: Array.isArray(detail?.prompts)
          ? detail?.prompts
          : [detail?.prompts?.zh || detail?.prompts?.en || ""].filter(Boolean),
        promptParams: "",
        model: detail?.model || "Unknown",
        ratio: "1:1", // 提示词可能没有比例信息
        steps: 0,
        seed: 0,
        sampler: "Unknown",
        likes: detail?.likes_count || 0,
        bookmarks: detail?.favorites_count || 0,
        liked: detail?.is_liked || false,
        bookmarked: detail?.is_favorited || false,
        comments: [], // 提示词暂时不显示评论
      };

      console.log("Setting state with data:", mappedData);
      console.log("Image URL:", mappedData.imageUrl);
      console.log("Avatar URL:", mappedData.avatar);
      setState((prev) => ({
        ...prev,
        loading: false,
        data: mappedData,
      }));
    } catch (err) {
      console.error("Failed to load detail:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "加载失败",
      }));
    }
  }, [taskId]);

  // 数据加载
  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // 加载评论
  useEffect(() => {
    if (taskId) {
      loadComments();
    }
  }, [taskId, loadComments]);

  if (state.loading) {
    return (
      <View className="w-full h-full bg-white">
        <View
          className="w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse relative overflow-hidden"
          style={{
            borderBottomLeftRadius: "2.5rem",
            borderBottomRightRadius: "2.5rem",
          }}
        >
          <View className="absolute inset-0 bg-gradient-to-t from-gray-300/50 to-transparent" />
        </View>

        <View className="w-full px-5 pt-6 pb-8">
          <View className="flex flex-col space-y-6">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
                <View className="flex flex-col space-y-2">
                  <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <View className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                </View>
              </View>
              <View className="w-16 h-8 bg-gray-200 rounded-full animate-pulse" />
            </View>

            <View className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />

            <View className="bg-gray-50 rounded-2xl p-5">
              <View className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <View className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
              <View className="h-4 bg-gray-200 rounded animate-pulse w-3/5" />
            </View>

            <View className="flex items-center justify-around py-3 bg-white rounded-full border border-gray-100">
              <View className="flex flex-col items-center gap-1">
                <View className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                <View className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
              </View>
              <View className="flex flex-col items-center gap-1">
                <View className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                <View className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
              </View>
              <View className="flex flex-col items-center gap-1">
                <View className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                <View className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 错误状态 UI
  if (state.error) {
    return (
      <View className="w-full h-full bg-white flex flex-col items-center justify-center px-8">
        <View className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Text className="text-4xl">⚠️</Text>
        </View>
        <Text className="text-gray-700 text-lg font-medium mb-2">加载失败</Text>
        <Text className="text-gray-500 text-sm mb-6 text-center">
          {state.error}
        </Text>
        <View
          className="bg-blue-500 text-white px-8 py-3 rounded-full active:bg-blue-600"
          onClick={loadDetail}
        >
          <Text className="text-base font-medium">重试</Text>
        </View>
      </View>
    );
  }

  // 如果没有数据,返回空
  if (!state.data) {
    return null;
  }

  return (
    <CommonWarp title="" withHeader={false}>
      <View className="w-full bg-white flex flex-col h-screen relative">
        <CommonHeader title="提示词详情" withBack>
          <PromptDetailHero
            imageUrl={state.data.imageUrl}
            onFullscreen={handleFullscreen}
          />
        </CommonHeader>
        <ScrollView scrollY className="flex-1">
          <View className="px-5 pt-6 flex flex-col gap-8">
            {/* 用户信息和标题 */}
            <PromptDetailHeader
              avatar={state.data.avatar}
              username={state.data.username}
              followers={state.data.followers}
              title={state.data.title}
              onFollow={handleFollow}
              onUsePrompt={handleCreateSimilar}
            />

            {/* Prompt 内容 */}
            <PromptDetailContent
              prompts={state.data.prompts}
              onCopy={handleCopyPrompt}
            />



            {/* 参数展示 */}
            <PromptDetailParameters
              model={state.data.model}
              ratio={state.data.ratio}
              steps={state.data.steps}
              seed={state.data.seed}
              sampler={state.data.sampler}
            />

            <View className="h-px w-full bg-gray-100 my-2" />

            {/* 评论列表 */}
            <PromptDetailComments comments={state.comments} />
          </View>
        </ScrollView>

        <CommentInputBar
          liked={state.data.liked}
          likes={state.data.likes}
          bookmarked={state.data.bookmarked}
          bookmarks={state.data.bookmarks}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onShare={handleShare}
          comments={state.comments.length}
          onCommentSubmit={handleSubmitComment}
          loading={state.submittingComment}
        />
      </View>
    </CommonWarp>
  );
};

export default PromptDetail;
