import { authApi } from "@/api";
import { squareApi } from "@/api/square";
import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { Icon } from "@/components/common/Icon";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/store";
import { Add, Arrow, Fire, Warning } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useState } from "react";
import type { WorkItem } from "@/types";
import { normalizeUrl } from "@/utils/url";
import "../index/index.css"; // 引入首页的瀑布流样式

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {
  const { isLogin, loading } = useAuth();
  const { userInfo, refreshUserInfo } = useUser();

  const [stats, setStats] = useState({
    totalWorks: 0,
    likes: 0,
    favorites: 0,
    todayConsumed: userInfo?.vipInfo?.today_used || 0,
    totalCreated: 0,
  });

  // 收藏作品列表状态
  const [favorites, setFavorites] = useState<WorkItem[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

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

  useDidShow(() => {
    // 刷新用户信息（用户名、头像、积分等）
    if (isLogin) {
      refreshUserInfo();
    }
    // 刷新统计数据
    loadUserStats();
    // 刷新收藏列表（每次打开页面都重新加载）
    loadFavorites();
  });

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
        <CommonHeader title="个人主页" withBack>
          <View
            className="w-full flex items-center justify-between"
            onClick={() => Taro.navigateTo({ url: "/pages/user-detail/index" })}
          >
            <View className="rounded-full w-20 h-20 overflow-hidden">
              <Image
                src={userInfo?.avatarUrl || "https://i.urusai.cc/PlyC9.png"}
                className="w-full h-full object-cover "
              />
            </View>

            <View className="ml-4 flex flex-col justify-center flex-1">
              <Text className="text-white text-xl font-semibold tracking-wide">
                {userInfo?.nickname || "未登录"}
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                @{userInfo?.userId || "---"}
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

            {/* 提示词瀑布流列表（复用首页样式） */}
            {favoritesLoading ? (
              <View className="text-center py-8 text-gray-400">
                <Text>加载中...</Text>
              </View>
            ) : favorites.length === 0 ? (
              <View className="text-center py-8 text-gray-400">
                <Text>暂无收藏</Text>
              </View>
            ) : (
              <View className='works'>
                {/* 左列 */}
                <View className='column'>
                  {favorites.filter((_, i) => i % 2 === 0).map((work) => (
                    <View
                      key={work.id}
                      className='work-card'
                      onClick={() => {
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
                          url: `/packageDetail/pages/prompt-detail/index?id=${work.id}`,
                        });
                      }}
                    >
                      <Image
                        src={normalizeUrl(work.cover_image)}
                        className='work-img'
                        mode='aspectFill'
                        lazyLoad
                      />
                      <Text className='work-prompt text-lg'>{work.title}</Text>
                      <View className='work-footer'>
                        <View className='work-author'>
                          {work.creator?.avatar_url && (
                            <Image
                              src={normalizeUrl(work.creator.avatar_url)}
                              className='author-avatar'
                              mode='aspectFill'
                            />
                          )}
                          <Text className='author-name'>{work.creator?.nickname || work.model}</Text>
                        </View>
                        <View className='work-stats'>
                          <View className='work-likes text-lg'>
                            <Icon name="thumb_up" size={16} color="#F43F5E" />
                            <Text className='stats-num ml-2'>{work.likes_count || 0}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                {/* 右列 */}
                <View className='column'>
                  {favorites.filter((_, i) => i % 2 === 1).map((work) => (
                    <View
                      key={work.id}
                      className='work-card'
                      onClick={() => {
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
                          url: `/packageDetail/pages/prompt-detail/index?id=${work.id}`,
                        });
                      }}
                    >
                      <Image
                        src={normalizeUrl(work.cover_image)}
                        className='work-img'
                        mode='aspectFill'
                        lazyLoad
                      />
                      <Text className='work-prompt text-lg'>{work.title}</Text>
                      <View className='work-footer'>
                        <View className='work-author'>
                          {work.creator?.avatar_url && (
                            <Image
                              src={normalizeUrl(work.creator.avatar_url)}
                              className='author-avatar'
                              mode='aspectFill'
                            />
                          )}
                          <Text className='author-name'>{work.creator?.nickname || work.model}</Text>
                        </View>
                        <View className='work-stats'>
                          <View className='work-likes text-lg'>
                            <Icon name="thumb_up" size={16} color="#F43F5E" />
                            <Text className='stats-num ml-2'>{work.likes_count || 0}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </CommonWarp>
  );
};

export default Profile;
