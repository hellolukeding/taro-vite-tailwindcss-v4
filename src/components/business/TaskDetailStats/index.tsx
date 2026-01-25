import { EnvelopOutlined, Fire, GoodJobOutlined } from "@taroify/icons";
import { Text, View } from "@tarojs/components";

interface TaskDetailStatsProps {
  likes: number;
  comments: number;
  favorites: number;
}

export function TaskDetailStats({ likes, comments, favorites }: TaskDetailStatsProps) {
  const stats = [
    {
      icon: <GoodJobOutlined size={20} color="#F43F5E" />,
      label: "点赞",
      value: likes,
    },
    {
      icon: <EnvelopOutlined size={20} color="#3B82F6" />,
      label: "评论",
      value: comments,
    },
    {
      icon: <Fire size={20} color="#FBBF24" />,
      label: "收藏",
      value: favorites,
    },
  ];

  return (
    <View className="flex flex-col gap-3">
      <Text className="text-lg font-semibold text-gray-900">数据统计</Text>

      <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
        <View className="flex justify-around items-center">
          {stats.map((stat, index) => (
            <View key={index} className="flex flex-col items-center gap-2">
              <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                {stat.icon}
              </View>
              <View className="flex flex-col items-center">
                <Text className="text-lg font-bold text-gray-900">
                  {stat.value > 0 ? stat.value : "-"}
                </Text>
                <Text className="text-xs text-gray-500">{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
