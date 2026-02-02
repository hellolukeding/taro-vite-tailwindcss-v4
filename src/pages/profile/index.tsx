import { authApi } from "@/api";
import { squareApi } from "@/api/square";
import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { EmptyState } from "@/components/business/EmptyState";
import { VirtualWaterfall, WorkItem as VirtualWaterfallItem } from "@/components/business/VirtualWaterfall";
import { Icon } from "@/components/common/Icon";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/store";
import { generateAvatarUrl } from "@/utils/constants";
import { normalizeUrl } from "@/utils/url";
import { Add, Arrow, Fire, Warning } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../index/index.css"; // 引入首页的瀑布流样式

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {
  const { isLogin, loading } = useAuth();
  const { userInfo, refreshUserInfo } = useUser();

  // 使用 ref 跟踪页面是否已经加载过
  const hasLoaded = useRef(false);

  const [stats, setStats] = useState({
    totalWorks: 0,
    likes: 0,
    favorites: 0,
    todayConsumed: userInfo?.vipInfo?.today_used || 0,
    totalCreated: 0,
  });

  // 恢复自动加载 - 只在首次挂载时执行
  useEffect(() => {
    if (!isLogin) return;

    // 首次加载用户信息
    if (!hasLoaded.current) {
      refreshUserInfo();
      hasLoaded.current = true;
    }

    // 加载统计数据和收藏列表
    loadUserStats();
    loadFavorites();
  }, [isLogin]);

  // 收藏作品列表状态
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // 将 API 数据转换为 VirtualWaterfall 格式
  const convertedFavorites = useMemo(() => {
    return favorites.map((item): VirtualWaterfallItem => ({
      id: item.id || item.prompt_id,
      title: item.title || item.prompt || '',
      cover_image: item.cover_image || item.image_url || item.thumbnail_url || '',
      creator: item.creator ? {
        nickname: item.creator.nickname,
        avatar_url: item.creator.avatar_url,
      } : undefined,
      model: item.model || item.model_name,
      likes_count: item.likes_count || 0,
      views_count: item.views_count || 0,
    }));
  }, [favorites]);

  // 加载收藏作品列表
  const loadFavorites = async () => {
    if (!isLogin) {
      setFavorites([]);
      return;
    }

    setFavoritesLoading(true);
    try {
      const data = await squareApi.getFavorites({ limit: 20 });
      setFavorites(data.items || []);
    } catch (error) {
      console.error("加载收藏列表失败:", error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // 处理收藏作品点击
  const handleFavoriteClick = useCallback((item: VirtualWaterfallItem) => {
    if (!isLogin) {
      Taro.showModal({
        title: "提示",
        content: "请先登录后查看",
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
    Taro.navigateTo({
      url: `/packageDetail/pages/prompt-detail/index?id=${item.id}`,
    });
  }, [isLogin]);

  // 刷新收藏列表
  const handleRefreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, []);

  // 当 userInfo 更新时同步更新今日消耗
  useEffect(() => {
    if (userInfo?.vipInfo) {
      setStats((prev) => ({
        ...prev,
        todayConsumed: userInfo.vipInfo.today_used,
      }));
    }
  }, [userInfo]);

  // 刷新统计数据
  const loadUserStats = async () => {
    // 未登录时使用默认值
    if (!isLogin) {
      setStats({
        totalWorks: 0,
        likes: 0,
        favorites: 0,
        todayConsumed: 0,
        totalCreated: 0,
      });
      return;
    }

    try {
      console.log('[Profile] 开始加载用户统计数据...');
      // 调用后端统计接口
      const statsData = await authApi.getUserStats();
      console.log('[Profile] 统计数据返回:', statsData);

      setStats({
        totalWorks: statsData.total_works,
        likes: statsData.total_likes,
        favorites: statsData.total_favorites,
        todayConsumed: userInfo?.vipInfo?.today_used || 0,
        totalCreated: statsData.total_created,
      });
      console.log('[Profile] 统计数据已更新');
    } catch (error) {
      console.error("[Profile] 加载统计数据失败:", error);
      // 如果接口调用失败，使用默认值
      setStats({
        totalWorks: 0,
        likes: 0,
        favorites: 0,
        todayConsumed: userInfo?.vipInfo?.today_used || 0,
        totalCreated: 0,
      });
    }
  };

  // ⚠️ 完全禁用 useDidShow，因为 tabBar 页面会在每次渲染时触发它
  // 改用 useEffect + 路由监听的方式，或者依赖下拉刷新
  // useDidShow(() => {
  //   // 代码已禁用，防止无限循环
  // });

  // 处理登录按钮点击
  const handleLogin = () => {
    Taro.navigateTo({
      url: "/packageUser/pages/login/index",
    });
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
    <CommonWarp title="我的" withHeader={false}>
      <View className="w-full h-full bg-white flex flex-col">
        <CommonHeader title="个人主页" withBack={false}>
          <View
            className="w-full flex items-center justify-between"
            onClick={() => Taro.navigateTo({ url: "/pages/user-detail/index" })}
          >
            <View
              className="w-20 h-20 overflow-hidden"
              style={{ borderRadius: '50%' }}
            >
              <Image
                src={normalizeUrl(userInfo?.avatarUrl || generateAvatarUrl(userInfo?.nickname))}
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            </View>

            <View className="ml-4 flex flex-col justify-center flex-1">
              <Text className="text-white text-xl font-semibold tracking-wide">
                {userInfo?.nickname || "未登录"}
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                {/* @{userInfo?.userId || "---"} */}
              </Text>
            </View>

            <Arrow size={20} style={{ color: "#fff" }} />
          </View>

          <View className="w-full text-white flex items-center justify-between mt-6 px-6">
            <View className="flex flex-col ">
              <Text className="text-sm">
                {stats.totalWorks > 0 ? stats.totalWorks : "-"}
              </Text>
              <Text className="text-xs mt-1">已创作</Text>
            </View>

            <View className="flex flex-col ">
              <Text className="text-sm">
                {stats.likes > 0 ? stats.likes : "-"}
              </Text>
              <Text className="text-xs mt-1">点赞</Text>
            </View>

            <View className="flex flex-col ">
              <Text className="text-sm">
                {stats.favorites > 0 ? stats.favorites : "-"}
              </Text>
              <Text className="text-xs mt-1">收藏</Text>
            </View>
          </View>
        </CommonHeader>

        <ScrollView scrollY className="flex-1 mt-2">
          {/* 积分卡片 */}
          <View className="px-5 mb-8">
            <View className="bg-linear-to-br from-gray-900 to-black rounded-3xl p-6 relative overflow-hidden shadow-xl">
              {/* 装饰光晕 */}
              <View className="absolute -top-10 -right-5 w-40 h-40 bg-gray-700/20 rounded-full blur-3xl pointer-events-none" />
              <View className="absolute -bottom-5 -left-5 w-32 h-32 bg-gray-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* 当前积分区 */}
              <View className="relative z-10 flex justify-between items-center">
                <View>
                  <View className="flex items-center gap-1.5 mb-2 opacity-80">
                    <Fire size={16} color="#FBBF24" />
                    <Text className="text-gray-300 text-xs font-medium tracking-wide">
                      当前积分
                    </Text>
                  </View>
                  <Text className="text-[32px] font-bold text-white tracking-tight leading-none">
                    {(userInfo?.credits || 0).toLocaleString()}
                  </Text>
                  {userInfo?.vipInfo?.is_vip && (
                    <View className="mt-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                      <Text className="text-xs text-yellow-300">VIP会员</Text>
                    </View>
                  )}
                </View>
                <View
                  onClick={() => {
                    // 检查登录状态
                    if (!isLogin) {
                      Taro.showModal({
                        title: "提示",
                        content: "请先登录后充值",
                        confirmText: "去登录",
                        cancelText: "取消",
                        success: (res) => {
                          if (res.confirm) {
                            Taro.navigateTo({
                              url: "/packageUser/pages/login/index",
                            });
                          }
                        },
                      });
                      return;
                    }

                    Taro.navigateTo({
                      url: "/packageUser/pages/recharge/index",
                    });
                  }}
                  className="flex items-center gap-1 bg-white text-black px-5 py-2.5 rounded-4xl shadow-lg active:scale-95 transition-transform"
                >
                  <Icon name="add" size={14} />
                  <Text className="text-xs font-bold">立即充值</Text>
                </View>
              </View>

              {/* 统计信息 */}
              <View className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-white text-xs">
                <View className="flex items-center">
                  <Warning className="mr-2" /> 今日消耗：
                  <Text className="font-bold">{stats.todayConsumed}</Text>
                </View>

                <View className="flex items-center">
                  <Add className="mr-2" /> 累计创作：
                  <Text className="font-bold">
                    {stats.totalCreated > 0 ? stats.totalCreated : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="w-full pb-8">
            <Text className="font-semibold tracking-wide text-lg mb-4 px-4">
              我的收藏
            </Text>

            {/* 提示词瀑布流列表（使用统一的 VirtualWaterfall 组件） */}
            <VirtualWaterfall
              items={convertedFavorites}
              loading={favoritesLoading}
              hasMore={false}
              onItemClick={handleFavoriteClick}
              onRefresh={handleRefreshFavorites}
              renderEmpty={() => (
                <EmptyState type="no-data" title="暂无收藏" description="还没有收藏任何作品" />
              )}
            />
          </View>
        </ScrollView>
      </View>
    </CommonWarp>
  );
};

export default Profile;
