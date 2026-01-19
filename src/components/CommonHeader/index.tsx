import { ArrowLeft } from "@taroify/icons";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

interface CommonHeaderProps {
  title?: string;
  withBack?: boolean;
  children?: React.ReactNode;
}

const CommonHeader: React.FC<CommonHeaderProps> = (props) => {
  return (
    <View className="bg-black pt-20 pb-8 px-3 rounded-b-4xl shadow-xl relative z-10">
      {/* Top Bar */}
      <View className="flex justify-between items-center mb-6">
        <View
          className="flex items-center gap-2"
          onClick={() => Taro.navigateBack()}
        >
          {props.withBack && <ArrowLeft size={20} color="#fff" />}
          <Text className="text-w hite text-xl font-semibold tracking-wide">
            {props.title}
          </Text>
        </View>
      </View>

      {props.children}
    </View>
  );
};

export default CommonHeader;
