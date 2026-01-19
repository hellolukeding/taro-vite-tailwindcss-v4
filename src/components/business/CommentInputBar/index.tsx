import {
  ChatOutlined,
  Like,
  LikeOutlined,
  Star,
  StarOutlined,
} from "@taroify/icons";
import { Input, Text, View } from "@tarojs/components";

interface CommentInputBarProps {
  liked: boolean;
  likes: number;
  bookmarked: boolean;
  bookmarks: number;
  comments: number;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

const CommentInputBar: React.FC<CommentInputBarProps> = (props) => {
  return (
    <View className="w-full flex items-center justify-between px-4 h-28 pb-2 fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <View
        className=" h-full flex items-center justify-center "
        style={{ width: "50%" }}
      >
        <Input
          type="text"
          placeholder="说点什么"
          focus
          className="w-full border border-gray-200 text-sm h-8 rounded-full px-2"
        />
      </View>
      <View
        className=" h-full grid grid-cols-3 items-center justify-center"
        style={{ width: "50%" }}
      >
        <View className="flex items-center justify-center">
          {props.liked ? (
            <Like color="#f00" size={25} />
          ) : (
            <LikeOutlined size={25} />
          )}
          <Text className="ml-2 text-sm">{props.likes}</Text>
        </View>
        <View className="flex items-center justify-center">
          {props.bookmarked ? (
            <Star color="#e2b53d" size={25} />
          ) : (
            <StarOutlined size={25} />
          )}
          <Text className="ml-2 text-sm">{props.bookmarks}</Text>
        </View>
        <View className="flex items-center justify-center">
          <ChatOutlined size={25} />
          <Text className="ml-2 text-sm">{props.comments}</Text>
        </View>
      </View>
    </View>
  );
};

export default CommentInputBar;
