import { Modal } from 'antd';
import { ReactNode } from 'react';

interface IConfirmProps {
  title: ReactNode, 
  confirm?: any, 
  content?: ReactNode, 
  cancel?: any,
  okText?: ReactNode,
  cancelText?: ReactNode
}

export const ConfirmModal = (props: IConfirmProps) => {
  return Modal.confirm({
    centered: true,
    icon: undefined,
    title: props.title,
    content: props.content,
    okCancel: props.confirm !== undefined,
    onOk: props.confirm,
    onCancel: props.cancel,
    okText: props.okText ?? "确认",
    cancelText: props.cancelText ?? "取消",
    style: { textAlign: 'center'}
  })
}
