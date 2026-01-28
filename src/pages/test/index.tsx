import CommonWarp from "@/components/CommonWarp";
import { WECHAT_TASK_COMPLETE_TEMPLATE_ID, WECHAT_TICKET_REPLY_TEMPLATE_ID } from "@/utils/constants";
import { Button, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import "./index.css";

const TestPage = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 测试任务完成订阅消息
  const handleTestTaskSubscribe = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("📱 [测试] 开始测试任务完成订阅消息");
      console.log("  - 模板ID:", WECHAT_TASK_COMPLETE_TEMPLATE_ID);

      if (!WECHAT_TASK_COMPLETE_TEMPLATE_ID) {
        setResult("❌ 任务完成模板ID未配置");
        Taro.showToast({
          title: "模板ID未配置",
          icon: "none",
        });
        return;
      }

      const subscribeResult = await Taro.requestSubscribeMessage({
        tmplIds: [WECHAT_TASK_COMPLETE_TEMPLATE_ID],
      });

      console.log("📋 [测试] 订阅结果:", subscribeResult);
      setResult(`✅ 任务完成订阅成功!\n\n${JSON.stringify(subscribeResult, null, 2)}`);

      if (subscribeResult[WECHAT_TASK_COMPLETE_TEMPLATE_ID] === "accept") {
        Taro.showToast({
          title: "用户同意订阅",
          icon: "success",
        });
      } else if (subscribeResult[WECHAT_TASK_COMPLETE_TEMPLATE_ID] === "reject") {
        Taro.showToast({
          title: "用户拒绝订阅",
          icon: "none",
        });
      }
    } catch (error: any) {
      console.error("💥 [测试] 订阅异常:", error);
      setResult(`❌ 订阅失败\n\n${JSON.stringify(error, null, 2)}`);

      if (error.errMsg?.includes("requestSubscribeMessage:fail")) {
        Taro.showToast({
          title: "订阅授权失败",
          icon: "none",
        });
      } else {
        Taro.showToast({
          title: "发生错误",
          icon: "none",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 测试工单回复订阅消息
  const handleTestTicketSubscribe = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("📱 [测试] 开始测试工单回复订阅消息");
      console.log("  - 模板ID:", WECHAT_TICKET_REPLY_TEMPLATE_ID);

      if (!WECHAT_TICKET_REPLY_TEMPLATE_ID) {
        setResult("❌ 工单回复模板ID未配置");
        Taro.showToast({
          title: "模板ID未配置",
          icon: "none",
        });
        return;
      }

      const subscribeResult = await Taro.requestSubscribeMessage({
        tmplIds: [WECHAT_TICKET_REPLY_TEMPLATE_ID],
      });

      console.log("📋 [测试] 订阅结果:", subscribeResult);
      setResult(`✅ 工单回复订阅成功!\n\n${JSON.stringify(subscribeResult, null, 2)}`);

      if (subscribeResult[WECHAT_TICKET_REPLY_TEMPLATE_ID] === "accept") {
        Taro.showToast({
          title: "用户同意订阅",
          icon: "success",
        });
      } else if (subscribeResult[WECHAT_TICKET_REPLY_TEMPLATE_ID] === "reject") {
        Taro.showToast({
          title: "用户拒绝订阅",
          icon: "none",
        });
      }
    } catch (error: any) {
      console.error("💥 [测试] 订阅异常:", error);
      setResult(`❌ 订阅失败\n\n${JSON.stringify(error, null, 2)}`);

      if (error.errMsg?.includes("requestSubscribeMessage:fail")) {
        Taro.showToast({
          title: "订阅授权失败",
          icon: "none",
        });
      } else {
        Taro.showToast({
          title: "发生错误",
          icon: "none",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 同时测试两个订阅消息
  const handleTestAllSubscribe = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("📱 [测试] 开始测试所有订阅消息");

      const templateIds = [
        WECHAT_TASK_COMPLETE_TEMPLATE_ID,
        WECHAT_TICKET_REPLY_TEMPLATE_ID,
      ].filter(Boolean);

      if (templateIds.length === 0) {
        setResult("❌ 没有配置任何模板ID");
        Taro.showToast({
          title: "模板ID未配置",
          icon: "none",
        });
        return;
      }

      console.log("  - 模板ID列表:", templateIds);

      const subscribeResult = await Taro.requestSubscribeMessage({
        tmplIds: templateIds,
      });

      console.log("📋 [测试] 订阅结果:", subscribeResult);

      // 解析结果
      const results = templateIds.map((tid) => {
        const status = subscribeResult[tid];
        const name = tid === WECHAT_TASK_COMPLETE_TEMPLATE_ID ? "任务完成" : "工单回复";
        return `${name}: ${status === 'accept' ? '✅ 同意' : status === 'reject' ? '❌ 拒绝' : '⚠️ 未知'}`;
      });

      setResult(`✅ 批量订阅测试完成!\n\n${results.join('\n')}\n\n完整结果:\n${JSON.stringify(subscribeResult, null, 2)}`);

      const allAccepted = templateIds.every(tid => subscribeResult[tid] === 'accept');
      if (allAccepted) {
        Taro.showToast({
          title: "已订阅所有通知",
          icon: "success",
        });
      } else {
        Taro.showToast({
          title: "订阅完成",
          icon: "none",
        });
      }
    } catch (error: any) {
      console.error("💥 [测试] 订阅异常:", error);
      setResult(`❌ 订阅失败\n\n${JSON.stringify(error, null, 2)}`);

      if (error.errMsg?.includes("requestSubscribeMessage:fail")) {
        Taro.showToast({
          title: "订阅授权失败",
          icon: "none",
        });
      } else {
        Taro.showToast({
          title: "发生错误",
          icon: "none",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 查看当前配置
  const handleShowConfig = () => {
    const config = {
      taskCompleteTemplateId: WECHAT_TASK_COMPLETE_TEMPLATE_ID,
      ticketReplyTemplateId: WECHAT_TICKET_REPLY_TEMPLATE_ID,
      env: process.env.NODE_ENV,
    };

    console.log("📋 [测试] 当前配置:", config);
    setResult(`📋 当前配置:\n\n${JSON.stringify(config, null, 2)}`);
  };

  // 检查订阅状态
  const handleCheckSubscription = async () => {
    try {
      const settings = await Taro.getSetting({
        withSubscriptions: true,
      });

      console.log("📋 [测试] 订阅设置:", settings);
      setResult(`📋 订阅设置:\n\n${JSON.stringify(settings, null, 2)}`);

      if (settings.subscriptionsSetting) {
        const taskSettings = settings.subscriptionsSetting[WECHAT_TASK_COMPLETE_TEMPLATE_ID];
        const ticketSettings = settings.subscriptionsSetting[WECHAT_TICKET_REPLY_TEMPLATE_ID];

        if (taskSettings || ticketSettings) {
          Taro.showToast({
            title: "检查完成",
            icon: "success",
          });
        }
      }
    } catch (error: any) {
      console.error("💥 [测试] 检查失败:", error);
      setResult(`❌ 检查失败\n\n${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <CommonWarp title="测试页面" withHeader>
      <ScrollView scrollY className="h-full bg-gray-50">
        <View className="p-6 space-y-6">
          {/* 标题 */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-xl font-bold">订阅消息测试</Text>
            <Text className="text-sm text-gray-500 mt-2">
              用于测试微信小程序订阅消息功能
            </Text>
          </View>

          {/* 操作按钮 */}
          <View className="bg-white rounded-lg p-4 shadow-sm space-y-3">
            <Text className="font-medium text-lg mb-3">测试操作</Text>

            <Button
              className="w-full bg-black text-white"
              onClick={handleTestTaskSubscribe}
              disabled={loading}
            >
              {loading ? "测试中..." : "📱 测试任务完成订阅"}
            </Button>

            <Button
              className="w-full bg-blue-500 text-white"
              onClick={handleTestTicketSubscribe}
              disabled={loading}
            >
              {loading ? "测试中..." : "🎫 测试工单回复订阅"}
            </Button>

            <Button
              className="w-full bg-green-500 text-white"
              onClick={handleTestAllSubscribe}
              disabled={loading}
            >
              {loading ? "测试中..." : "🔄 批量测试所有订阅"}
            </Button>

            <Button
              className="w-full"
              onClick={handleShowConfig}
            >
              📋 查看配置
            </Button>

            <Button
              className="w-full"
              onClick={handleCheckSubscription}
            >
              🔍 检查订阅状态
            </Button>

            <Button
              className="w-full"
              onClick={() => setResult("")}
            >
              🗑️ 清空日志
            </Button>
          </View>

          {/* 结果显示 */}
          {result && (
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="font-medium text-lg mb-3">执行结果</Text>
              <View className="bg-gray-900 rounded-lg p-4 overflow-auto">
                <Text className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                  {result}
                </Text>
              </View>
            </View>
          )}

          {/* 说明文档 */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Text className="font-medium text-blue-900 mb-2">📖 使用说明</Text>
            <View className="text-sm text-blue-800 space-y-2">
              <Text>1. 点击"测试订阅消息"按钮</Text>
              <Text>2. 会弹出微信原生订阅弹窗</Text>
              <Text>3. 选择"同意"或"拒绝"</Text>
              <Text>4. 查看下方执行结果</Text>
              <Text className="font-medium mt-3">⚠️ 注意事项：</Text>
              <Text>• 必须在真机上测试，开发者工具无效</Text>
              <Text>• 用户拒绝后7天内不会再弹窗</Text>
              <Text>• 勾选"总是保持"后不会再弹窗</Text>
            </View>
          </View>

          {/* 常见问题 */}
          <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <Text className="font-medium text-yellow-900 mb-2">❓ 常见问题</Text>
            <View className="text-sm text-yellow-800 space-y-1">
              <Text className="font-medium">Q: 为什么没有弹窗？</Text>
              <Text>A: 必须在真机上测试，开发者工具模拟器无法触发</Text>
              <Text className="font-medium mt-2">Q: 之前拒绝了怎么办？</Text>
              <Text>A: 等待7天冷却期，或引导用户到设置页开启</Text>
              <Text className="font-medium mt-2">Q: 如何重置？</Text>
              <Text>A: 删除小程序重新进入，或在设置中关闭订阅</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </CommonWarp>
  );
};

export default TestPage;
