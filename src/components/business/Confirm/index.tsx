import { Button, Dialog } from '@taroify/core'
import { FC, useState } from 'react'
import Taro from '@tarojs/taro'

export interface ConfirmOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

/**
 * Confirm 确认弹窗工具
 *
 * @param options - 弹窗配置
 * @returns Promise<boolean> - 用户是否确认
 */
export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  const {
    title = '提示',
    content,
    confirmText = '确认',
    cancelText = '取消',
    type = 'info'
  } = options

  return new Promise((resolve) => {
    Dialog.confirm({
      title,
      content,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: type === 'danger' ? '#ef4444' : '#000000',
      onConfirm: () => {
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      }
    })
  })
}

/**
 * Confirm 组件（用于声明式使用）
 */
export interface ConfirmProps {
  visible: boolean
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export const Confirm: FC<ConfirmProps> = ({
  visible,
  title = '提示',
  content,
  confirmText = '确认',
  cancelText = '取消',
  type = 'info',
  onConfirm,
  onCancel
}) => {
  const [open, setOpen] = useState(visible)

  const handleConfirm = () => {
    setOpen(false)
    onConfirm()
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <Dialog open={open} onClose={handleCancel} getContainer={false}>
      <Dialog.Header>{title}</Dialog.Header>
      <Dialog.Content>{content}</Dialog.Content>
      <Dialog.Footer>
        <Button onClick={handleCancel} className='confirm-cancel-btn'>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          className={type === 'danger' ? 'confirm-danger-btn' : 'confirm-confirm-btn'}
        >
          {confirmText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default Confirm
