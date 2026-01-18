import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { CommentItem } from "@/components/business/CommentItem";
import { CommentInputBar } from "@/components/business/CommentInputBar";
import { PromptDetailHero } from "@/components/business/PromptDetailHero";
import { useAuth } from "@/hooks/useAuth";
import * as promptApi from "@/services/promptApi";
import { normalizeUrl } from "@/utils/url";
import { Button } from "@taroify/core";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/utils/toast";

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
  prompt: string;
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
  });

  const [promptExpanded, setPromptExpanded] = useState(false);

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

  const handleCopyPrompt = useCallback(() => {
    if (!state.data?.prompt) return;

    Taro.setClipboardData({
      data: state.data.prompt,
      success: () => {
        toast.success("复制成功");
      },
    });
  }, [state.data?.prompt]);

  const handleCreateSimilar = useCallback(async () => {
    const isLogin = await requireLoginRedirect();
    if (!isLogin) return;
    toast.success("即将跳转到创作页面");
  }, [requireLoginRedirect]);

  // 加载评论列表
  const loadComments = useCallback(async () => {
    if (!taskId) return;

    setState((prev) => ({ ...prev, commentsLoading: true }));

    try {
      const result = await promptApi.getComments("prompt", taskId);
      setState((prev) => ({
        ...prev,
        comments: result.items || [],
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

      try {
        await promptApi.createComment("prompt", taskId, content);
        // 重新加载评论列表
        await loadComments();
        toast.success("评论成功");
      } catch (err) {
        console.error("评论失败:", err);
        toast.error("评论失败");
      }
    },
    [taskId, loadComments, requireLoginRedirect]
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
        // prompts 是数组，取第一个元素
        prompt: Array.isArray(detail?.prompts)
          ? detail?.prompts[0]
          : detail?.prompts?.zh || detail?.prompts?.en || "",
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
      <View className="w-full h-full bg-white">
        <CommonHeader title="提示词详情" withBack>
          <PromptDetailHero
            imageUrl={state.data.imageUrl}
            onFullscreen={handleFullscreen}
          />
        </CommonHeader>
        <ScrollView scrollY className="flex-1">
          <View className="px-5 pt-6 flex flex-col gap-8">
            <View className="flex flex-col gap-4">
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-3">
                  <View
                    className="w-11 h-11 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100"
                    style={{ backgroundImage: `url(${state.data.avatar})` }}
                  />
                  <View className="flex flex-col">
                    <Text className="text-sm font-bold text-slate-900 leading-none mb-1">
                      {state.data.username}
                    </Text>
                    <Text className="text-[11px] text-slate-500 font-medium">
                      {state.data.followers} followers
                    </Text>
                  </View>
                </View>
                <Button
                  size="small"
                  shape="round"
                  className="px-5 py-2"
                  onClick={handleFollow}
                >
                  关注
                </Button>
              </View>
              <Text className="text-2xl font-bold text-slate-900 leading-tight mt-1">
                {state.data.title}
              </Text>
            </View>

            <View className="relative">
              <View className="bg-gray-50 dark:bg-surface-dark/50 rounded-2xl p-5 border border-gray-100 dark:border-white/5 transition-all">
                <View
                  className="flex items-center justify-between mb-2"
                  onClick={() => setPromptExpanded(!promptExpanded)}
                >
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Prompt
                  </Text>
                  <View className="flex items-center gap-2 text-slate-900">
                    <Text className="text-xs font-medium">
                      {promptExpanded ? "收起" : "展开"}
                    </Text>
                    <Text
                      className={`text-lg transform transition-transform ${promptExpanded ? "rotate-180" : ""}`}
                    >
                      ▼
                    </Text>
                  </View>
                </View>
                <Text
                  className={`text-slate-600 text-base font-normal leading-relaxed font-body ${!promptExpanded ? "line-clamp-3" : ""}`}
                >
                  {state.data.prompt}
                </Text>
                {!promptExpanded && (
                  <View className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                )}
                {promptExpanded && (
                  <View className="pt-3 mt-3 border-t border-black/5 flex justify-end">
                    <Button
                      size="mini"
                      shape="round"
                      className="px-3 py-1.5"
                      onClick={handleCopyPrompt}
                    >
                      复制
                    </Button>
                  </View>
                )}
              </View>
            </View>

            <View className="flex justify-center w-full -mx-2">
              <View className="flex items-center gap-6 px-8 py-3 bg-white border border-gray-100 rounded-full shadow-lg z-10">
                <View
                  className="flex flex-col items-center gap-1 w-12"
                  onClick={handleLike}
                >
                  <Text
                    className={`text-2xl ${state.data.liked ? "text-red-500" : "text-slate-400"}`}
                  >
                    {state.data.liked ? "♥" : "♡"}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-500">
                    {state.data.likes}
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-200" />
                <View
                  className="flex flex-col items-center gap-1 w-12"
                  onClick={handleBookmark}
                >
                  <Text
                    className={`text-2xl ${state.data.bookmarked ? "text-yellow-500" : "text-slate-400"}`}
                  >
                    {state.data.bookmarked ? "★" : "☆"}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-500">
                    {state.data.bookmarks}
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-200" />
                <View
                  className="flex flex-col items-center gap-1 w-12"
                  onClick={handleShare}
                >
                  <Text className="text-2xl text-slate-400">↗</Text>
                  <Text className="text-[10px] font-bold text-slate-500">
                    Share
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex flex-col gap-3">
              <Text className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Parameters
              </Text>
              <View className="flex flex-wrap gap-2">
                <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Text className="text-slate-400">Model:</Text>{" "}
                  {state.data.model}
                </View>
                <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Text className="text-slate-400">Ratio:</Text>{" "}
                  {state.data.ratio}
                </View>
                <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Text className="text-slate-400">Steps:</Text>{" "}
                  {state.data.steps}
                </View>
                <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Text className="text-slate-400">Seed:</Text>{" "}
                  {state.data.seed}
                </View>
                <View className="px-4 py-2 rounded-full border border-gray-200 bg-transparent text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Text className="text-slate-400">Sampler:</Text>{" "}
                  {state.data.sampler}
                </View>
              </View>
            </View>

            <View className="h-px w-full bg-gray-100 my-2" />

            <View className="flex flex-col gap-6 pb-30">
              <View className="flex items-center justify-between">
                <Text className="text-lg font-bold text-slate-900">
                  评论 ({state.comments.length})
                </Text>
              </View>

              {state.comments.length === 0 ? (
                <View className="flex flex-col items-center justify-center py-16">
                  <Text className="text-5xl mb-3">💬</Text>
                  <Text className="text-slate-900 text-base font-semibold mb-2">
                    暂无评论
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    快来发表第一条评论吧
                  </Text>
                </View>
              ) : (
                <View className="flex flex-col space-y-6">
                  {state.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      avatar={comment.avatar}
                      username={comment.username}
                      time={comment.time}
                      content={comment.content}
                      likes={comment.likes}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <CommentInputBar
          placeholder="说点什么..."
          onSubmit={handleSubmitComment}
        />
      </View>
    </CommonWarp>
  );
};

export default PromptDetail;
