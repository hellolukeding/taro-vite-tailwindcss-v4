import { Star } from "@taroify/icons";
import { View } from "@tarojs/components";


interface CusCardProps {
  title: React.ReactNode
  children?: React.ReactNode;
  className?: string;
}

const CusCard: React.FC<CusCardProps> = (props) => {
  return (
    <View className={`w-full bg-[#a8e6cf] text-gray-600 rounded-xl p-2  my-4 relative ${props.className ?? ''} overflow-hidden`}>

      <View className='text-lg font-bold  py-2 px-0' style={{
        borderBottom: "1px solid #59996e"
      }}
      >

        {props.title}</View>


      <View>
        {props.children}
      </View>

      <Star size={400} style={{
        position: "absolute",
        opacity: 0.3,
        userSelect: "none",
        transform: "rotate(20deg)",
      }}
        className='-top-40 -right-20 -z-10'
      />
    </View>
  );
};

export default CusCard;
