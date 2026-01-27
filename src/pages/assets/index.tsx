import { assetsApi } from "@/api";
import CommonWarp from "@/components/CommonWarp";
import { InProgressTaskCard } from "@/components/business/InProgressTaskCard";
import { useAuth } from "@/hooks/useAuth";
import type { MockTask } from "@/mock/tasks";
import type { TaskItem } from "@/types";
import { formatRelativeTime } from "@/utils/timeFormat";
import { normalizeUrl } from "@/utils/url";
import { UnderwayOutlined } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidHide, useDidShow, usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

interface AssetsProps { }

const Assets: React.FC<AssetsProps> = () => {
  const { isLogin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tasksRef = useRef<TaskItem[]>([]);
  const loadingRef = useRef(false);

  // Smart polling state
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0);
  const maxPolls = 30; // Stop after 30 polls (about 5 minutes)
  const isTabActiveRef = useRef(true);

  // Keep ref in sync with state
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // Smart polling function with exponential backoff
  const startPolling = useCallback(() => {
    // Only poll for "in progress" tab (activeTab === 0)
    if (activeTab !== 0 || !isTabActiveRef.current) {
      stopPolling();
      return;
    }

    // Clear existing timer
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }

    // Check if there are active tasks
    const hasActiveTasks = tasksRef.current.some(t =>
      [0, 1, 2].includes(t.status) // pending, processing, uploading
    );

    if (!hasActiveTasks) {
      console.log('[Assets] No active tasks, stopping polling');
      stopPolling();
      return;
    }

    // Calculate poll interval with exponential backoff: 3s → 5s → 10s
    const getPollInterval = () => {
      const count = pollCountRef.current;
      if (count < 5) return 3000;      // First 5 polls: 3s
      if (count < 10) return 5000;     // Next 5 polls: 5s
      return 10000;                    // After that: 10s
    };

    pollingTimerRef.current = setInterval(() => {
      pollCountRef.current++;

      // Stop after max polls
      if (pollCountRef.current >= maxPolls) {
        console.log('[Assets] Max polls reached, stopping');
        stopPolling();
        return;
      }

      console.log(`[Assets] Polling... (${pollCountRef.current}/${maxPolls})`);

      // Refresh task list silently (no loading indicator)
      loadTasks(false);
    }, getPollInterval());

    console.log(`[Assets] Polling started: ${getPollInterval() / 1000}s interval`);
  }, [activeTab, loadTasks]);

  // Stop polling function
  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
      pollCountRef.current = 0;
      console.log('[Assets] Polling stopped');
    }
  }, []);

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
        const currentTasksLength = tasksRef.current.length;
        const result = await assetsApi.getTasks({
          status,
          limit: 20,
          offset: loadMore ? currentTasksLength : 0,
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
    [activeTab, isLogin],
  );

  // 切换标签时重新加载并控制轮询
  useEffect(() => {
    loadTasks(false);

    // Start polling for "in progress" tab (activeTab === 0)
    if (activeTab === 0 && isLogin) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [activeTab, isLogin, loadTasks, startPolling, stopPolling]);

  // Pause polling when page is hidden
  useDidHide(() => {
    console.log('[Assets] Page hidden, pausing polling');
    isTabActiveRef.current = false;
    stopPolling();
  });

  // Resume polling when page is shown
  useDidShow(() => {
    console.log('[Assets] Page shown, resuming polling');
    isTabActiveRef.current = true;
    if (activeTab === 0 && isLogin) {
      startPolling();
    }
  });

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      console.log('[Assets] Component unmounting, cleaning up polling');
      stopPolling();
    };
  }, [stopPolling]);

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
                    />
                  );
                })
              )}
            </View>
          ) : (
            <View className="px-4 py-4">
              {/* 瀑布流作品列表 */}
              <View className='works'>
                {/* 左列 */}
                <View className='column'>
                  {tasks.filter((_, i) => i % 2 === 0).map((task) => {
                    const mockTask = transformToMockTask(task);
                    return (
                      <View key={task.task_id} className='work-card' onClick={() => {
                        handleTaskClick(task);
                      }}
                      >
                        <Image
                          src={normalizeUrl(task.image_url) || ''}
                          className='work-img'
                          mode='aspectFill'
                          lazyLoad
                        />
                        <Text className='work-prompt text-lg'>
                          {task.prompt.length > 50 ? task.prompt.substring(0, 50) + '...' : task.prompt}
                        </Text>
                        <View className='work-footer'>
                          <View className='work-author'>
                            <Text className='author-name'>{task.model_name || task.model_id}</Text>
                          </View>
                          <View className='work-stats'>
                            <View className='work-likes text-lg'>
                              <UnderwayOutlined size={12} />
                              <Text className='stats-num ml-1'>{mockTask.time}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
                {/* 右列 */}
                <View className='column'>
                  {tasks.filter((_, i) => i % 2 === 1).map((task) => {
                    const mockTask = transformToMockTask(task);
                    return (
                      <View key={task.task_id} className='work-card' onClick={() => {
                        handleTaskClick(task);
                      }}
                      >
                        <Image
                          src={normalizeUrl(task.image_url) || ''}
                          className='work-img'
                          mode='aspectFill'
                          lazyLoad
                        />
                        <Text className='work-prompt text-lg'>
                          {task.prompt.length > 50 ? task.prompt.substring(0, 50) + '...' : task.prompt}
                        </Text>
                        <View className='work-footer'>
                          <View className='work-author'>
                            <Text className='author-name'>{task.model_name || task.model_id}</Text>
                          </View>
                          <View className='work-stats'>
                            <View className='work-likes text-lg'>
                              <UnderwayOutlined size={12} />
                              <Text className='stats-num ml-1'>{mockTask.time}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* 空状态 */}
              {tasks.length === 0 && !loadingTasks && (
                <View className="text-center py-8 text-gray-400">
                  <Text>暂无已完成的任务</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </CommonWarp>
  );
};

export default Assets;
