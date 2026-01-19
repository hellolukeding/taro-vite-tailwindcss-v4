import { Textarea, View, Text, Input } from "@tarojs/components";
import { useState } from "react";
import { toast } from "@/utils/toast";

interface CommentInputBarProps {
  liked: boolean;
  likes: number;
  bookmarked: boolean;
  bookmarks: number;
  comments: number;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onCommentSubmit: (content: string) => Promise<void>;
  loading?: boolean;
}

const CommentInputBar: React.FC<CommentInputBarProps> = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [focused, setFocused] = useState(false);

  const MAX_LENGTH = 500;

  // 处理输入变化
  const handleInputChange = (e: any) => {
    const value = e.detail.value;
    if (value.length <= MAX_LENGTH) {
      setInputValue(value);
    }
  };

  // 处理聚焦
  const handleFocus = () => {
    setFocused(true);
    setIsExpanded(true);
  };

  // 处理失焦
  const handleBlur = () => {
    setFocused(false);
    // 如果没有输入内容，延迟收起
    if (!inputValue.trim()) {
      setTimeout(() => setIsExpanded(false), 200);
    }
  };

  // 提交评论
  const handleSubmit = async () => {
    const content = inputValue.trim();

    if (!content) {
      toast.info("请输入评论内容");
      return;
    }

    if (content.length > MAX_LENGTH) {
      toast.info(`评论不能超过${MAX_LENGTH}字`);
      return;
    }

    try {
      await props.onCommentSubmit(content);
      setInputValue(""); // 清空输入
      setIsExpanded(false); // 收起
    } catch (error) {
      console.error("提交评论失败:", error);
      // 错误已在上层处理，这里只记录日志
    }
  };

  // 判断是否显示展开状态
  const showExpanded = isExpanded || focused;

  return (
    <View className="w-full flex flex-col bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40">
      {showExpanded ? (
        // 展开状态：多行输入框 + 字数统计 + 发送按钮 + 操作按钮
        <View className="flex flex-col px-4 py-3 pb-8">
          <View className="flex-1 relative mb-3">
            <Textarea
              value={inputValue}
              onInput={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="说点什么..."
              maxlength={MAX_LENGTH}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-20"
              style={{ resize: "none" }}
            />
            <View className="absolute bottom-2 right-2 text-xs text-gray-400">
              {inputValue.length}/{MAX_LENGTH}
            </View>
          </View>

          <View className="flex items-center justify-between">
            <View className="flex items-center gap-6">
              <View
                className="flex items-center"
                onClick={props.onLike}
              >
                <Text className={`text-2xl ${props.liked ? "text-red-500" : "text-slate-400"}`}>
                  {props.liked ? "♥" : "♡"}
                </Text>
                <Text className="ml-1 text-sm text-gray-600">{props.likes}</Text>
              </View>
              <View
                className="flex items-center"
                onClick={props.onBookmark}
              >
                <Text className={`text-2xl ${props.bookmarked ? "text-yellow-500" : "text-slate-400"}`}>
                  {props.bookmarked ? "★" : "☆"}
                </Text>
                <Text className="ml-1 text-sm text-gray-600">{props.bookmarks}</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-2xl text-slate-400">💬</Text>
                <Text className="ml-1 text-sm text-gray-600">{props.comments}</Text>
              </View>
            </View>

            <View
              className={`flex items-center justify-center px-6 py-2 rounded-full ${
                inputValue.trim() && !props.loading
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              onClick={handleSubmit}
            >
              <Text className="text-sm text-white font-medium">
                {props.loading ? "发送中..." : "发送"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // 收起状态：单行输入框 + 操作按钮
        <View className="flex items-center justify-between px-4 h-28 pb-2">
          <View className="flex-1 flex items-center justify-center pr-4">
            <Input
              type="text"
              placeholder="说点什么"
              onFocus={handleFocus}
              className="w-full border border-gray-200 text-sm h-8 rounded-full px-3"
            />
          </View>
          <View className="flex items-center gap-6">
            <View
              className="flex items-center"
              onClick={props.onLike}
            >
              <Text className={`text-2xl ${props.liked ? "text-red-500" : "text-slate-400"}`}>
                {props.liked ? "♥" : "♡"}
              </Text>
              <Text className="ml-2 text-sm">{props.likes}</Text>
            </View>
            <View
              className="flex items-center"
              onClick={props.onBookmark}
            >
              <Text className={`text-2xl ${props.bookmarked ? "text-yellow-500" : "text-slate-400"}`}>
                {props.bookmarked ? "★" : "☆"}
              </Text>
              <Text className="ml-2 text-sm">{props.bookmarks}</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-2xl text-slate-400">💬</Text>
              <Text className="ml-2 text-sm">{props.comments}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CommentInputBar;
