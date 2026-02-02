import { assetsApi } from "@/api";
import CommonWarp from "@/components/CommonWarp";
import { EmptyState } from "@/components/business/EmptyState";
import { InProgressTaskCard } from "@/components/business/InProgressTaskCard";
import { VirtualWaterfall, WorkItem } from "@/components/business/VirtualWaterfall";
import { useAuth } from "@/hooks/useAuth";
import type { MockTask } from "@/mock/tasks";
import type { TaskItem } from "@/types";
import { formatRelativeTime } from "@/utils/timeFormat";
import { normalizeUrl } from "@/utils/url";
import { UnderwayOutlined } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

interface AssetsProps { }

const Assets: React.FC<AssetsProps> = () => {
  const { isLogin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // 加载任务列表
  const loadTasks = useCallback(
    async (loadMore = false) => {
      if (loadingRef.current) return;

      // 未登录时直接设置空数据
      if (!isLogin) {
        setTasks([]);
        setHasMore(false);
        return;
      }

      loadingRef.current = true;
      setLoadingTasks(true);
      try {
        const status = activeTab === 0 ? "pending" : "success";
        const result = await assetsApi.getTasks({
          status,
          limit: 20,
          offset: loadMore ? tasks.length : 0,
        });

        if (loadMore) {
          setTasks((prevTasks) => [...prevTasks, ...result.items]);
        } else {
          setTasks(result.items);
        }
        setHasMore(result.has_more);
      } catch (error) {
        console.error("Load tasks error:", error);
        Taro.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loadingRef.current = false;
        setLoadingTasks(false);
      }
    },
    [activeTab, isLogin], // ✅ 移除 tasks.length 依赖，使用函数式更新
  );

  // 切换标签时重新加载
  useEffect(() => {
    loadTasks(false);
  }, [activeTab, isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  // 下拉刷新
  usePullDownRefresh(() => {
    loadTasks(false).then(() => {
      Taro.stopPullDownRefresh();
    });
  });

  // 上拉加载更多
  useReachBottom(() => {
    if (hasMore && !loadingTasks) {
      loadTasks(true);
    }
  });

  // 处理登录按钮点击
  const handleLogin = () => {
    Taro.navigateTo({
      url: "/packageUser/pages/login/index",
    });
  };

  // 发布/取消发布
  const handleTogglePublish = async (taskId: string, isPublic: boolean) => {
    // 检查登录状态
    if (!isLogin) {
      Taro.showModal({
        title: "提示",
        content: "请先登录后进行操作",
        confirmText: "去登录",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: "/packageUser/pages/login/index" });
          }
        },
      });
      return;
    }

    try {
      if (isPublic) {
        await assetsApi.unpublishTask(taskId);
        Taro.showToast({ title: "已取消发布", icon: "success" });
      } else {
        await assetsApi.publishTask(taskId);
        Taro.showToast({ title: "已提交审核", icon: "success" });
      }
      loadTasks(false);
    } catch (error) {
      console.error("Toggle publish error:", error);
      Taro.showToast({ title: "操作失败", icon: "none" });
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    // 检查登录状态
    if (!isLogin) {
      Taro.showModal({
        title: "提示",
        content: "请先登录后进行操作",
        confirmText: "去登录",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: "/packageUser/pages/login/index" });
          }
        },
      });
      return;
    }

    Taro.showModal({
      title: "确认删除",
      content: "删除后无法恢复，确定要删除吗？",
      success: async (res) => {
        if (res.confirm) {
          try {
            await assetsApi.deleteTask(taskId);
            Taro.showToast({ title: "删除成功", icon: "success" });
            setTasks(tasks.filter((t) => t.task_id !== taskId));
          } catch (error) {
            console.error("Delete task error:", error);
            Taro.showToast({ title: "删除失败", icon: "none" });
          }
        }
      },
    });
  };

  // 取消任务
  const handleCancelTask = (_id: string) => {
    // 检查登录状态
    if (!isLogin) {
      Taro.showModal({
        title: "提示",
        content: "请先登录后进行操作",
        confirmText: "去登录",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: "/packageUser/pages/login/index" });
          }
        },
      });
      return;
    }

    Taro.showModal({
      title: "确认取消",
      content: "确定要取消这个任务吗？",
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: "任务已取消", icon: "success" });
        }
      },
    });
  };

  // 点击任务查看详情
  const handleTaskClick = (task: TaskItem) => {
    // 检查登录状态
    if (!isLogin) {
      Taro.showModal({
        title: "提示",
        content: "请先登录后进行操作",
        confirmText: "去登录",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: "/packageUser/pages/login/index" });
          }
        },
      });
      return;
    }

    // 只允许查看已完成的任务
    if (task.status !== 3) {
      Taro.showToast({
        title: "任务未完成，无法查看详情",
        icon: "none"
      });
      return;
    }

    // 跳转到任务详情页面，传递任务ID
    Taro.navigateTo({
      url: `/packageDetail/pages/task-detail/index?id=${task.task_id}`,
    });
  };

  // 转换 TaskItem 到 MockTask 格式
  const transformToMockTask = (task: TaskItem): MockTask => {
    // 使用时间格式化工具函数
    const time = formatRelativeTime(task.created_at);

    // 根据状态映射
    let status: MockTask["status"] = "private";
    if (task.is_public) {
      status = "public";
    } else if (task.status === 4) {
      status = "failed";
    }

    return {
      id: task.task_id,
      imageUrl: task.thumbnail_url || task.image_url || undefined,
      category: task.model_name,
      time,
      status,
      likes: 0, // API 返回的数据中没有 likes
    };
  };

  // 转换 TaskItem 到 WorkItem 格式（用于 VirtualWaterfall）
  const workItems = useMemo(() => {
    return tasks.map((task) => ({
      id: task.task_id,
      title: task.prompt.length > 50 ? task.prompt.substring(0, 50) + '...' : task.prompt,
      cover_image: task.image_url,
      creator: {
        nickname: task.model_name || task.model_id,
      },
      model: task.model_name,
      likes_count: 0,
      views_count: 0,
    } as WorkItem));
  }, [tasks]);

  // 加载中
  if (loading) {
    return (
      <View className="w-full h-full flex items-center justify-center">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <CommonWarp title="资产" withHeader={false}>
      <View className="w-full h-full bg-white ">
        <View className="bg-black pt-20 pb-8 px-3 rounded-b-4xl shadow-xl relative z-10">
          {/* Top Bar */}
          <View className="flex justify-between items-center mb-6">
            <View
              className="flex items-center gap-2"
              onClick={() => Taro.navigateBack()}
            >
              {/* <ArrowLeft size={20} color="#fff" /> */}
              <Text className="text-white text-xl font-semibold tracking-wide">
                资产中心
              </Text>
            </View>
          </View>
        </View>

        {/* Header */}
        <View className="sticky top-0 z-50 bg-white border-b border-gray-100">
          {/* Tabs */}
          <View className="px-4 py-4">
            <View className="flex p-1 w-full bg-gray-100 rounded-xl relative">
              {(["进行中", "已完成"] as const).map((tabTitle, index) => {
                return (
                  <View
                    key={tabTitle}
                    className={`flex-1 py-2 text-sm font-bold text-center rounded-lg transition-colors ${activeTab === index ? "text-white bg-black" : "text-gray-500"}`}
                    onClick={() => setActiveTab(index)}
                  >
                    <Text>{tabTitle}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView scrollY className="h-full pb-32">
          {activeTab === 0 ? (
            <View className="px-4 py-4 space-y-4">
              <Text className="text-xl font-bold px-1 pt-2">正在绘制</Text>
              {tasks.length === 0 && !loadingTasks ? (
                <View className="text-center py-8 text-gray-400">
                  <Text>暂无进行中的任务</Text>
                </View>
              ) : (
                tasks.map((task) => {
                  // 根据任务状态确定卡片状态
                  // status: 0=pending(排队中), 1=processing(处理中), 2=uploading(上传中), 4=failed(失败), 5=violation(违规)
                  const isQueued = task.status === 0;
                  const isFailed = task.status === 4 || task.status === 5;
                  const cardStatus = isQueued ? 'queued' : (isFailed ? 'failed' : 'progress');

                  return (
                    <InProgressTaskCard
                      key={task.task_id}
                      id={task.task_id}
                      title={
                        task.prompt.length > 30
                          ? task.prompt.substring(0, 30) + "..."
                          : task.prompt
                      }
                      description={task.model_name}
                      progress={task.progress || 0}
                      status={cardStatus}
                      errorMessage={task.error_message || undefined}
                      onCancel={handleCancelTask}
                      onDelete={handleDeleteTask}
                    />
                  );
                })
              )}
            </View>
          ) : (
            <View className="px-4 py-4">
              {/* 瀑布流作品列表 */}
              <VirtualWaterfall
                items={workItems}
                loading={loadingTasks}
                hasMore={hasMore}
                onItemClick={(work) => {
                  const task = tasks.find(t => t.task_id === work.id);
                  if (task) handleTaskClick(task);
                }}
                onRefresh={() => loadTasks(false)}
                onLoadMore={() => loadTasks(true)}
                renderEmpty={() => (
                  <EmptyState
                    type='no-tasks'
                    title='暂无已完成的任务'
                    description='快去创作你的第一个作品吧'
                  />
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </CommonWarp>
  );
};

export default Assets;
