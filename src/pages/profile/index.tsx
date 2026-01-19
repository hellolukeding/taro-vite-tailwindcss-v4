import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { Icon } from "@/components/common/Icon";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/store";
import { Add, Arrow, Fire, Warning } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useState } from "react";

/**
 * TODO: 后端需要实现的统计接口
 * GET /api/user/stats
 *
 * Response:
 * {
 *   total_works: number,      // 总创作数
 *   total_likes: number,      // 获赞总数
 *   total_favorites: number,  // 收藏总数
 *   today_consumed: number,   // 今日消耗积分
 *   total_created: number     // 累计创作数
 * }
 */

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {
  const { isLogin, loading } = useAuth();
  const { userInfo } = useUser();

  const [stats, setStats] = useState({
    totalWorks: 0,
    likes: 0,
    favorites: 0,
    todayConsumed: userInfo?.vipInfo?.today_used || 0,
    totalCreated: 0,
  });

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

    // 当前后端暂无统计API，使用默认值
    // TODO: 等待后端实现 /api/user/stats 接口
    // const stats = await userApi.getStats()
    // setStats(stats)

    // 临时方案：使用 vipInfo 中的今日消耗
    if (userInfo?.vipInfo) {
      setStats((prev) => ({
        ...prev,
        todayConsumed: userInfo.vipInfo.today_used,
      }));
    }
  };

  useDidShow(() => {
    loadUserStats();
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
              <Text className="text-xs mt-1">收获点赞</Text>
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

          <View className="w-full px-4">
            <Text className="font-semibold tracking-wide text-lg">
              我的收藏
            </Text>

            <ScrollView scrollY className="w-full "></ScrollView>
          </View>
        </ScrollView>
      </View>
    </CommonWarp>
  );
};

export default Profile;
