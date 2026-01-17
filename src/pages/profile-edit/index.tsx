import CommonHeader from '@/components/CommonHeader'
import CommonWarp from '@/components/CommonWarp'
import { authApi, type UpdateProfileParams } from '@/api/auth'
import { useUser } from '@/store'
import { Button, Cell, DatetimePicker, Field, Form, Input, Picker, Toast } from '@taroify/core'
import { ArrowLeft, Photograph } from '@taroify/icons'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'

const GENDER_OPTIONS = [
  { label: '未知', value: '0' },
  { label: '男', value: '1' },
  { label: '女', value: '2' },
]

const INDUSTRY_OPTIONS = [
  { label: '互联网/IT', value: '互联网/IT' },
  { label: '金融', value: '金融' },
  { label: '教育', value: '教育' },
  { label: '医疗', value: '医疗' },
  { label: '制造业', value: '制造业' },
  { label: '服务业', value: '服务业' },
  { label: '文化/传媒', value: '文化/传媒' },
  { label: '房地产', value: '房地产' },
  { label: '零售', value: '零售' },
  { label: '其他', value: '其他' },
]

const ProfileEdit: React.FC = () => {
  const router = useRouter()
  const { userInfo, setUserInfo } = useUser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateProfileParams>({
    nickname: userInfo?.nickname || '',
    avatar_url: userInfo?.avatarUrl || '',
    gender: userInfo?.gender || '0',
    birthday: userInfo?.birthday || '',
    industry: userInfo?.industry || '',
  })

  // Pickers visibility state
  const [genderPickerVisible, setGenderPickerVisible] = useState(false)
  const [birthdayPickerVisible, setBirthdayPickerVisible] = useState(false)
  const [industryPickerVisible, setIndustryPickerVisible] = useState(false)
  const [tempBirthday, setTempBirthday] = useState<Date | null>(
    userInfo?.birthday ? new Date(userInfo.birthday) : null
  )

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        // TODO: 上传图片到服务器并获取URL
        // 目前使用本地临时路径
        setFormData((prev) => ({ ...prev, avatar_url: res.tempFilePaths[0] }))
        Toast.show({ content: '头像已选择（开发中）', type: 'success' })
      }
    } catch (error) {
      console.error('Choose image error:', error)
    }
  }

  // Handle gender change
  const handleGenderConfirm = (value: (string | number)[]) => {
    setFormData((prev) => ({ ...prev, gender: String(value[0]) }))
    setGenderPickerVisible(false)
  }

  // Handle birthday change
  const handleBirthdayConfirm = (value: Date) => {
    const dateStr = value.toISOString().split('T')[0]
    setFormData((prev) => ({ ...prev, birthday: dateStr }))
    setTempBirthday(value)
    setBirthdayPickerVisible(false)
  }

  // Handle industry change
  const handleIndustryConfirm = (value: (string | number)[]) => {
    setFormData((prev) => ({ ...prev, industry: String(value[0]) }))
    setIndustryPickerVisible(false)
  }

  // Handle save
  const handleSave = async () => {
    if (!formData.nickname || formData.nickname.trim() === '') {
      Toast.show({ content: '请输入昵称', type: 'fail' })
      return
    }

    if (formData.nickname && formData.nickname.length > 50) {
      Toast.show({ content: '昵称最多50个字符', type: 'fail' })
      return
    }

    setLoading(true)
    try {
      const updatedUserInfo = await authApi.updateProfile(formData)

      // Update user info in store
      setUserInfo({
        ...userInfo!,
        nickname: updatedUserInfo.nickname,
        avatarUrl: updatedUserInfo.avatarUrl,
        gender: updatedUserInfo.gender,
        birthday: updatedUserInfo.birthday,
        industry: updatedUserInfo.industry,
      })

      Toast.show({ content: '保存成功', type: 'success' })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error: any) {
      console.error('Update profile error:', error)
      Toast.show({
        content: error.message || '保存失败',
        type: 'fail',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <CommonWarp title='编辑资料' withHeader={false} className='w-screen h-screen'>
      <CommonHeader title='编辑资料' withBack onBack={handleBack}>
        <View className='w-full bg-white pb-20'>
          <ScrollView scrollY className='h-full'>
            {/* Avatar Section */}
            <View className='bg-white px-4 py-6 border-b border-gray-100'>
              <View className='flex items-center justify-between'>
                <Text className='text-gray-900 text-base font-medium'>头像</Text>
                <View
                  className='flex items-center'
                  onClick={handleAvatarUpload}
                >
                  {formData.avatar_url ? (
                    <Image
                      src={formData.avatar_url}
                      className='w-12 h-12 rounded-full mr-2'
                      mode='aspectFill'
                    />
                  ) : (
                    <View className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-2'>
                      <Photograph size={20} color='#999' />
                    </View>
                  )}
                  <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <Form className='bg-white'>
              <Field name='nickname' label='昵称'>
                <Input
                  placeholder='请输入昵称'
                  value={formData.nickname}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, nickname: value }))
                  }
                  maxlength={50}
                />
              </Field>

              <Cell
                title='性别'
                clickable
                onClick={() => setGenderPickerVisible(true)}
                extra={
                  <Text className='text-gray-500'>
                    {GENDER_OPTIONS.find((opt) => opt.value === formData.gender)?.label ||
                      '未知'}
                  </Text>
                }
              />

              <Cell
                title='生日'
                clickable
                onClick={() => setBirthdayPickerVisible(true)}
                extra={
                  <Text className='text-gray-500'>
                    {formData.birthday || '未设置'}
                  </Text>
                }
              />

              <Cell
                title='行业'
                clickable
                onClick={() => setIndustryPickerVisible(true)}
                extra={
                  <Text className='text-gray-500'>
                    {formData.industry || '未设置'}
                  </Text>
                }
              />
            </Form>

            {/* Save Button */}
            <View className='px-4 mt-8'>
              <Button
                color='black'
                size='large'
                block
                onClick={handleSave}
                loading={loading}
                disabled={loading}
              >
                保存
              </Button>
            </View>

            {/* Gender Picker */}
            <Picker
              visible={genderPickerVisible}
              columns={[GENDER_OPTIONS]}
              defaultValue={[formData.gender || '0']}
              onConfirm={handleGenderConfirm}
              onCancel={() => setGenderPickerVisible(false)}
            >
              <Picker.Toolbar>
                <Picker.Button onClick={() => setGenderPickerVisible(false)}>
                  取消
                </Picker.Button>
                <Picker.Button onClick={() => setGenderPickerVisible(false)}>
                  确认
                </Picker.Button>
              </Picker.Toolbar>
            </Picker>

            {/* Birthday Picker */}
            <DatetimePicker
              type='date'
              visible={birthdayPickerVisible}
              value={tempBirthday}
              max={new Date()}
              onConfirm={handleBirthdayConfirm}
              onCancel={() => setBirthdayPickerVisible(false)}
            >
              <DatetimePicker.Toolbar>
                <DatetimePicker.Button
                  onClick={() => setBirthdayPickerVisible(false)}
                >
                  取消
                </DatetimePicker.Button>
                <DatetimePicker.Button
                  onClick={() => setBirthdayPickerVisible(false)}
                >
                  确认
                </DatetimePicker.Button>
              </DatetimePicker.Toolbar>
            </DatetimePicker>

            {/* Industry Picker */}
            <Picker
              visible={industryPickerVisible}
              columns={[INDUSTRY_OPTIONS]}
              defaultValue={[formData.industry || '']}
              onConfirm={handleIndustryConfirm}
              onCancel={() => setIndustryPickerVisible(false)}
            >
              <Picker.Toolbar>
                <Picker.Button onClick={() => setIndustryPickerVisible(false)}>
                  取消
                </Picker.Button>
                <Picker.Button onClick={() => setIndustryPickerVisible(false)}>
                  确认
                </Picker.Button>
              </Picker.Toolbar>
            </Picker>
          </ScrollView>
        </View>
      </CommonHeader>
    </CommonWarp>
  )
}

export default ProfileEdit
