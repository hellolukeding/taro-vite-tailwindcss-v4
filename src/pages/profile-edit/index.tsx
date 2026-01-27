import { authApi, type UpdateProfileParams } from "@/api/auth";
import CommonHeader from "@/components/CommonHeader";
import CommonWarp from "@/components/CommonWarp";
import { useUser } from "@/store";
import { normalizeUrl } from "@/utils/url";
import {
  Button,
  DatetimePicker,
  Field,
  Form,
  Input,
  Picker,
  Popup,
} from "@taroify/core";
import type { FormItemInstance } from "@taroify/core/form";
import { PhotoOutlined } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemo, useRef, useState } from "react";

const GENDER_COLUMNS = [
  { label: "未知", value: "0" },
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];

const INDUSTRY_COLUMNS = [
  { label: "互联网/IT", value: "互联网/IT" },
  { label: "金融", value: "金融" },
  { label: "教育", value: "教育" },
  { label: "医疗", value: "医疗" },
  { label: "制造业", value: "制造业" },
  { label: "服务业", value: "服务业" },
  { label: "文化/传媒", value: "文化/传媒" },
  { label: "房地产", value: "房地产" },
  { label: "零售", value: "零售" },
  { label: "其他", value: "其他" },
];

const ProfileEdit: React.FC = () => {
  const { userInfo, setUser: setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userInfo?.avatarUrl || "");

  // Form refs for picker fields
  const genderFieldRef = useRef<FormItemInstance>(null);
  const birthdayFieldRef = useRef<FormItemInstance>(null);
  const industryFieldRef = useRef<FormItemInstance>(null);

  // Pickers state
  const [genderPickerOpen, setGenderPickerOpen] = useState(false);
  const [birthdayPickerOpen, setBirthdayPickerOpen] = useState(false);
  const [industryPickerOpen, setIndustryPickerOpen] = useState(false);

  // Memoized columns
  const genderColumns = useMemo(() => GENDER_COLUMNS, []);
  const industryColumns = useMemo(() => INDUSTRY_COLUMNS, []);

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
      });

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        const tempFilePath = res.tempFilePaths[0];

        // 显示加载提示
        Taro.showLoading({
          title: "上传中...",
          mask: true,
        });

        try {
          // ✅ 先上传到服务器
          const uploadedUrl = await authApi.uploadAvatar(tempFilePath);

          // ✅ 保存服务器返回的HTTP URL
          setAvatarUrl(uploadedUrl);

          Taro.hideLoading();
          Taro.showToast({
            title: "头像已上传",
            icon: "success",
            duration: 2000,
          });
        } catch (uploadError: any) {
          Taro.hideLoading();
          console.error("Upload avatar error:", uploadError);
          Taro.showToast({
            title: uploadError.message || "上传失败",
            icon: "error",
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Choose image error:", error);
    }
  };

  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Get display label for gender
  const getGenderLabel = (value: string | undefined) => {
    if (!value) return "未设置";
    return genderColumns.find((opt) => opt.value === value)?.label || "未知";
  };

  // Handle form submit
  const handleSubmit = async (event: any) => {
    const values = event.detail.value;

    if (!values.nickname || values.nickname.trim() === "") {
      Taro.showToast({ title: "请输入昵称", icon: "none", duration: 2000 });
      return;
    }

    if (values.nickname && values.nickname.length > 50) {
      Taro.showToast({
        title: "昵称最多50个字符",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      // Convert birthday from Date to string if present
      const birthdayValue =
        values.birthday instanceof Date
          ? values.birthday.toISOString().split("T")[0]
          : values.birthday;

      // Include avatar_url from state
      const updateData: UpdateProfileParams = {
        nickname: values.nickname,
        avatar_url: avatarUrl || userInfo?.avatarUrl || "",
        gender: values.gender,
        birthday: birthdayValue,
        industry: values.industry,
      };

      const updatedUserInfo = await authApi.updateProfile(updateData);

      setUserInfo({
        ...userInfo!,
        nickname: updatedUserInfo.nickname,
        avatarUrl: updatedUserInfo.avatarUrl,
        gender: updatedUserInfo.gender,
        birthday: updatedUserInfo.birthday,
        industry: updatedUserInfo.industry,
        tags: updatedUserInfo.tags,
      });

      Taro.showToast({ title: "保存成功", icon: "success", duration: 2000 });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error: any) {
      console.error("Update profile error:", error);
      Taro.showToast({
        title: error.message || "保存失败",
        icon: "error",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonWarp title="编辑资料" withHeader={false} className="bg-gray-50">
      <CommonHeader title="编辑资料" withBack>
        <ScrollView scrollY className="h-screen bg-gray-50">
          {/* Avatar Section */}
          <View className="bg-gradient-to-br from-gray-900 to-black pt-8 pb-12 px-6 mb-4">
            <View className="flex flex-col items-center">
              <View
                className="w-24 h-24 rounded-full border-4 border-white shadow-2xl mb-4 overflow-hidden relative"
                onClick={handleAvatarUpload}
              >
                <Image
                  src={normalizeUrl(
                    avatarUrl ||
                    userInfo?.avatarUrl ||
                    "https://i.urusai.cc/PlyC9.png"
                  )}
                  className="w-full h-full"
                  mode="aspectFill"
                />
                <View className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <PhotoOutlined size={16} />
                </View>
              </View>
              <Text className="text-white text-lg font-semibold mb-1">
                {userInfo?.nickname || "未设置昵称"}
              </Text>
              <Text className="text-gray-400 text-sm">点击头像更换</Text>
            </View>
          </View>

          {/* Form */}
          <View className="px-4 pb-32">
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <Form
                onSubmit={handleSubmit}
                defaultValues={{
                  nickname: userInfo?.nickname || "",
                  gender: userInfo?.gender || "0",
                  birthday: userInfo?.birthday
                    ? new Date(userInfo.birthday)
                    : null,
                  industry: userInfo?.industry || "",
                }}
              >
                {/* 昵称 */}
                <Field
                  name="nickname"
                  label="昵称"
                  rules={[{ required: true, message: "请输入昵称" }]}
                >
                  <Input placeholder="请输入昵称" maxlength={50} />
                </Field>

                {/* 性别 */}
                <Field
                  ref={genderFieldRef}
                  name="gender"
                  label="性别"
                  clickable
                  isLink
                >
                  {(controller) => (
                    <Input
                      value={getGenderLabel(controller.value)}
                      readonly
                      placeholder="点击选择性别"
                      onClick={() => setGenderPickerOpen(true)}
                    />
                  )}
                </Field>

                {/* 生日 */}
                <Field
                  ref={birthdayFieldRef}
                  name="birthday"
                  label="生日"
                  clickable
                  isLink
                >
                  {(controller) => (
                    <Input
                      value={formatDate(controller.value)}
                      readonly
                      placeholder="点击选择生日"
                      onClick={() => setBirthdayPickerOpen(true)}
                    />
                  )}
                </Field>

                {/* 行业 */}
                <Field
                  ref={industryFieldRef}
                  name="industry"
                  label="行业"
                  clickable
                  isLink
                >
                  {(controller) => (
                    <Input
                      value={controller.value || "未设置"}
                      readonly
                      placeholder="点击选择行业"
                      onClick={() => setIndustryPickerOpen(true)}
                    />
                  )}
                </Field>

                {/* Submit Button - 必须在Form内部才能使用formType="submit" */}
                <View className="mt-6 px-4">
                  <Button
                    size="large"
                    block
                    shape="round"
                    formType="submit"
                    loading={loading}
                    disabled={loading}
                    style={{
                      backgroundColor: "#000",
                      color: "#fff",
                    }}
                  >
                    保存修改
                  </Button>
                </View>
              </Form>
            </View>

            {/* Tips */}
            <View className="mt-4 mx-2">
              <Text className="text-gray-400 text-xs text-center leading-relaxed">
                完善个人资料可以让我们更好地了解您，为您提供更精准的服务
              </Text>
            </View>
          </View>
        </ScrollView>
      </CommonHeader>

      {/* Gender Picker */}
      <Popup
        open={genderPickerOpen}
        rounded
        placement="bottom"
        onClose={() => setGenderPickerOpen(false)}
      >
        <Picker
          title="选择性别"
          columns={genderColumns}
          onCancel={() => setGenderPickerOpen(false)}
          onConfirm={(value) => {
            genderFieldRef.current?.setValue(value[0]);
            setGenderPickerOpen(false);
          }}
        />
      </Popup>

      {/* Birthday Picker */}
      <Popup
        open={birthdayPickerOpen}
        rounded
        placement="bottom"
        onClose={() => setBirthdayPickerOpen(false)}
      >
        <DatetimePicker
          type="date"
          max={new Date()}
          onCancel={() => setBirthdayPickerOpen(false)}
          onConfirm={(value) => {
            birthdayFieldRef.current?.setValue(value);
            setBirthdayPickerOpen(false);
          }}
        />
      </Popup>

      {/* Industry Picker */}
      <Popup
        open={industryPickerOpen}
        rounded
        placement="bottom"
        onClose={() => setIndustryPickerOpen(false)}
      >
        <Picker
          title="选择行业"
          columns={industryColumns}
          onCancel={() => setIndustryPickerOpen(false)}
          onConfirm={(value) => {
            industryFieldRef.current?.setValue(value[0]);
            setIndustryPickerOpen(false);
          }}
        />
      </Popup>
    </CommonWarp>
  );
};

export default ProfileEdit;
