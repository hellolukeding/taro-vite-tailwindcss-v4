import { ticketsApi } from '@/api'
import CommonWarp from '@/components/CommonWarp'
import { TicketImageUploader } from '@/components/business/TicketImageUploader'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft } from '@taroify/icons'
import { Button, Input } from '@taroify/core'
import { Picker, Text, Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './create.scss'

interface CreateProps {}

const TICKET_TYPES = [
  { label: '问题反馈', value: '问题反馈' },
  { label: '功能建议', value: '功能建议' },
  { label: '账号相关', value: '账号相关' },
  { label: '其他问题', value: '其他问题' },
]

const TICKET_PRIORITIES = [
  { label: 'P1 - 紧急', value: 'P1' },
  { label: 'P2 - 高', value: 'P2' },
  { label: 'P3 - 中', value: 'P3' },
  { label: 'P4 - 低', value: 'P4' },
  { label: 'P5 - 极低', value: 'P5' },
]

const Create: React.FC<CreateProps> = () => {
  const { requireLoginRedirect } = useAuth()

  const [type, setType] = useState('')
  const [priority, setPriority] = useState('P3')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [relatedOrderId, setRelatedOrderId] = useState('')
  const [relatedTaskId, setRelatedTaskId] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // 提交工单
  const handleSubmit = async () => {
    if (!type) {
      Taro.showToast({ title: '请选择工单类型', icon: 'none' })
      return
    }

    if (!title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' })
      return
    }

    if (!description.trim()) {
      Taro.showToast({ title: '请输入问题描述', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const ticket = await ticketsApi.createTicket({
        type,
        priority,
        title: title.trim(),
        description: description.trim(),
        related_order_id: relatedOrderId.trim() || undefined,
        related_task_id: relatedTaskId.trim() || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      })

      Taro.showToast({ title: '提交成功', icon: 'success' })

      setTimeout(() => {
        Taro.redirectTo({
          url: `/packageUser/pages/tickets/detail?id=${ticket.ticket_id}`,
        })
      }, 1500)
    } catch (error) {
      console.error('提交工单失败:', error)
      Taro.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CommonWarp withHeader={false}>
      <View className='create-ticket-page'>
        {/* Header */}
        <View className='bg-black pt-20 pb-8 px-4 rounded-b-4xl shadow-xl'>
          <View className='flex items-center gap-3 mb-2'>
            <View className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center' onClick={() => Taro.navigateBack()}>
              <ArrowLeft size={20} color='#fff' />
            </View>
            <Text className='text-white text-xl font-bold'>创建工单</Text>
          </View>
          <Text className='text-gray-400 text-sm ml-11'>我们会尽快为您处理</Text>
        </View>

        {/* Form */}
        <View className='px-4 py-6 space-y-4'>
          {/* 工单类型 */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>
              工单类型 <Text className='text-red-500'>*</Text>
            </Text>
            <Picker
              mode='selector'
              range={TICKET_TYPES}
              rangeKey='label'
              value={TICKET_TYPES.findIndex((t) => t.value === type)}
              onChange={(e) => setType(TICKET_TYPES[e.detail.value].value)}
            >
              <View className='flex items-center justify-between p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors'>
                <Text className={type ? 'text-black text-sm' : 'text-gray-400 text-sm'}>
                  {type || '请选择工单类型'}
                </Text>
                <Text className='text-gray-400 text-xs'>›</Text>
              </View>
            </Picker>
          </View>

          {/* 优先级 */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>优先级</Text>
            <Picker
              mode='selector'
              range={TICKET_PRIORITIES}
              rangeKey='label'
              value={TICKET_PRIORITIES.findIndex((p) => p.value === priority)}
              onChange={(e) => setPriority(TICKET_PRIORITIES[e.detail.value].value)}
            >
              <View className='flex items-center justify-between p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors'>
                <Text className='text-black text-sm'>{priority}</Text>
                <Text className='text-gray-400 text-xs'>›</Text>
              </View>
            </Picker>
          </View>

          {/* 标题 */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>
              标题 <Text className='text-red-500'>*</Text>
            </Text>
            <Input
              placeholder='请简要描述问题'
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              maxlength={200}
              className='custom-input'
            />
            <Text className='text-xs text-gray-400 mt-2 text-right'>{title.length}/200</Text>
          </View>

          {/* 问题描述 */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>
              问题描述 <Text className='text-red-500'>*</Text>
            </Text>
            <Textarea
              placeholder='请详细描述您遇到的问题'
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={2000}
              autoHeight
              className='w-full min-h-[120px] p-3 bg-gray-50 rounded-xl text-sm'
            />
            <Text className='text-xs text-gray-400 mt-2 text-right'>{description.length}/2000</Text>
          </View>

          {/* 截图附件 */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>截图附件（可选）</Text>
            <TicketImageUploader
              images={attachments}
              onChange={setAttachments}
              maxCount={4}
            />
          </View>

          {/* 关联订单ID（可选） */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>关联订单ID（可选）</Text>
            <Input
              placeholder='如有订单问题请填写'
              value={relatedOrderId}
              onInput={(e) => setRelatedOrderId(e.detail.value)}
              className='custom-input'
            />
          </View>

          {/* 关联任务ID（可选） */}
          <View className='bg-white p-4 rounded-2xl shadow-sm'>
            <Text className='text-sm font-bold text-black mb-3 block'>关联任务ID（可选）</Text>
            <Input
              placeholder='如有生成任务问题请填写'
              value={relatedTaskId}
              onInput={(e) => setRelatedTaskId(e.detail.value)}
              className='custom-input'
            />
          </View>

          {/* 提交按钮 */}
          <Button
            className='w-full py-3 bg-black text-white text-center rounded-full font-medium shadow-lg active:scale-95 transition-transform'
            loading={loading}
            onClick={handleSubmit}
          >
            提交工单
          </Button>
        </View>
      </View>
    </CommonWarp>
  )
}

export default Create
