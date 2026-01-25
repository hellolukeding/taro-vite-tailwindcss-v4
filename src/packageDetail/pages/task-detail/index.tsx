import { assetsApi, type TaskDetail as TaskDetailType } from "@/api/assets";
import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { PromptDetailHero } from "@/components/business/PromptDetailHero";
import { TaskDetailActions } from "@/components/business/TaskDetailActions";
import { TaskDetailContent } from "@/components/business/TaskDetailContent";
import { TaskDetailParameters } from "@/components/business/TaskDetailParameters";
import { TaskDetailStats } from "@/components/business/TaskDetailStats";
import { toast } from "@/utils/toast";
import { normalizeUrl } from "@/utils/url";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";

interface TaskDetailProps {
  id?: string;
}

interface TaskDetailState {
  loading: boolean;
  error: string | null;
  data: TaskDetailType | null;
  publishing: boolean;
  unpublishing: boolean;
}

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [state, setState] = useState<TaskDetailState>({
    loading: true,
    error: null,
    data: null,
    publishing: false,
    unpublishing: false,
  });

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const router = instance.router;
    const params = router?.params || {};
    const id = params.id || props.id;

    console.log("=== Task Detail Page ===");
    console.log("Router params:", params);
    console.log("Props.id:", props.id);
    console.log("TaskId:", id);

    if (!id) {
      console.error("No taskId provided!");
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "缺少任务ID参数",
      }));
    } else {
      setTaskId(id);
    }
  }, [props.id]);

  const handleFullscreen = useCallback(() => {
    if (!state.data?.image_url) return;

    Taro.previewImage({
      urls: [state.data.image_url],
    });
  }, [state.data?.image_url]);

  const handleShare = useCallback(async () => {
    if (!taskId) return;

    if (!state.data?.is_public) {
      toast.error("请先发布作品后再分享");
      return;
    }

    try {
      Taro.showShareMenu({
        withShareTicket: true,
      });
      toast.success("请点击右上角分享");
    } catch (err) {
      console.error("分享失败:", err);
      toast.error("分享失败");
    }
  }, [taskId, state.data?.is_public]);

  const handlePublish = useCallback(async () => {
    if (!taskId || state.publishing) return;

    setState((prev) => ({ ...prev, publishing: true }));

    try {
      const result = await assetsApi.publishTask(taskId);
      toast.success(result.message || "提交审核成功");

      // 重新加载详情
      await loadDetail();
    } catch (err: any) {
      console.error("发布失败:", err);
      toast.error(err.message || "发布失败");
    } finally {
      setState((prev) => ({ ...prev, publishing: false }));
    }
  }, [taskId, state.publishing]);

  const handleUnpublish = useCallback(async () => {
    if (!taskId || state.unpublishing) return;

    Taro.showModal({
      title: "确认取消发布",
      content: "取消发布后，作品将不再在广场中展示",
      success: async (res) => {
        if (res.confirm) {
          setState((prev) => ({ ...prev, unpublishing: true }));

          try {
            const result = await assetsApi.unpublishTask(taskId);
            toast.success(result.message || "已取消发布");

            // 重新加载详情
            await loadDetail();
          } catch (err: any) {
            console.error("取消发布失败:", err);
            toast.error(err.message || "取消发布失败");
          } finally {
            setState((prev) => ({ ...prev, unpublishing: false }));
          }
        }
      },
    });
  }, [taskId, state.unpublishing]);

  const handleDelete = useCallback(async () => {
    if (!taskId) return;

    Taro.showModal({
      title: "确认删除",
      content: "删除后将无法恢复，确认删除吗？",
      confirmColor: "#F43F5E",
      success: async (res) => {
        if (res.confirm) {
          try {
            await assetsApi.deleteTask(taskId);
            toast.success("删除成功");

            // 返回上一页
            setTimeout(() => {
              Taro.navigateBack();
            }, 500);
          } catch (err: any) {
            console.error("删除失败:", err);
            toast.error(err.message || "删除失败");
          }
        }
      },
    });
  }, [taskId]);

  const handleCopyPrompt = useCallback(() => {
    if (!state.data?.prompt) return;

    Taro.setClipboardData({
      data: state.data.prompt,
      success: () => {
        toast.success("复制成功");
      },
    });
  }, [state.data?.prompt]);

  // 数据加载函数
  const loadDetail = useCallback(async () => {
    if (!taskId) {
      console.log("No taskId provided");
      return;
    }

    console.log("Loading task detail for taskId:", taskId);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const detail = await assetsApi.getTaskDetail(taskId);
      console.log("Task detail loaded:", detail);

      setState((prev) => ({
        ...prev,
        loading: false,
        data: detail,
      }));
    } catch (err: any) {
      console.error("Failed to load task detail:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "加载失败",
      }));
    }
  }, [taskId]);

  // 数据加载
  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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
        <CommonHeader title="任务详情" withBack>
          {/* <TaskDetailHero
            imageUrl={normalizeUrl(state.data.image_url)}
            onFullscreen={handleFullscreen}
          /> */}

          <PromptDetailHero
            // imageUrl={state.data.image_url}
            imageUrl={normalizeUrl(state.data.image_url)}

            onFullscreen={handleFullscreen}
          />
        </CommonHeader>

        <ScrollView scrollY className="flex-1">
          <View className="px-5 pt-6 flex flex-col gap-6">
            {/* Prompt 内容 */}
            <TaskDetailContent
              prompt={state.data.prompt}
              onCopy={handleCopyPrompt}
            />

            {/* 参数展示 */}
            <TaskDetailParameters
              model={state.data.model_name}
              width={state.data.parameters?.width}
              height={state.data.parameters?.height}
              steps={state.data.parameters?.steps}
              cfg_scale={state.data.parameters?.cfg_scale}
              seed={state.data.parameters?.seed}
            />

            {/* 统计信息（如果已发布） */}
            {state.data.is_public && state.data.stats && (
              <TaskDetailStats
                likes={state.data.stats.likes_count}
                comments={state.data.stats.comments_count}
                favorites={state.data.stats.favorites_count}
              />
            )}

            <View className="h-px w-full bg-gray-100 my-2" />

            {/* 任务信息 */}
            <View className="flex flex-col gap-2">
              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-500">创建时间</Text>
                <Text className="text-sm text-gray-900">
                  {new Date(state.data.created_at).toLocaleString('zh-CN')}
                </Text>
              </View>

              {state.data.completed_at && (
                <View className="flex justify-between items-center">
                  <Text className="text-sm text-gray-500">完成时间</Text>
                  <Text className="text-sm text-gray-900">
                    {new Date(state.data.completed_at).toLocaleString('zh-CN')}
                  </Text>
                </View>
              )}

              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-500">消耗积分</Text>
                <Text className="text-sm text-gray-900 font-medium">
                  {state.data.cost} 积分
                </Text>
              </View>

              {state.data.error_message && (
                <View className="flex justify-between items-center">
                  <Text className="text-sm text-gray-500">错误信息</Text>
                  <Text className="text-sm text-red-500">
                    {state.data.error_message}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* 操作按钮 */}
        <TaskDetailActions
          canPublish={state.data.can_publish}
          isAuditing={state.data.is_auditing}
          isPublic={state.data.is_public}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDelete={handleDelete}
          onShare={handleShare}
          publishing={state.publishing}
          unpublishing={state.unpublishing}
        />
      </View>
    </CommonWarp>
  );
};

export default TaskDetail;
