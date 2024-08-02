import { Table, Form, Input, message } from "antd"
import React, { FunctionComponent, useState } from "react";
import { ISectionNodeModel } from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { ConfirmModal } from "./ConfirmModal";
import { TableButtonGroup } from "components";
import { VideoTimePicker } from "./VideoTimePicker";
import { Rule } from "antd/lib/form";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'text' | "picker";
  record: ISectionNodeModel;
  index: number;
  children: React.ReactNode;
  update: any;
  pickerStart: number;
  rules?: Rule[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  update,
  pickerStart,
  rules,
  ...restProps
}) => {
  const inputNode = inputType === 'picker' ? 
    <VideoTimePicker 
      disabled={false}
      initialValues={moment.unix(record.startNumber).utc()}
      startTimeNumber= {pickerStart}
      endTimeNumber={record.endNumber}
      setStartNumber={update} 
      format={record.endNumber >= 60 * 60 ? 'HH:mm:ss' : 'mm:ss'} /> : 
    <Input size="small" />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0, width: '100%' }}
          rules={rules}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const SectionNodeTable : FunctionComponent<{originSectionNodes: ISectionNodeModel[] | undefined, loading: boolean, handleSave: any, handlePlay: any, handleDelete: any, isPublished?: boolean}> 
= ({originSectionNodes, loading, handleSave, handlePlay, handleDelete, isPublished}) => {
  
  const [editingNode, setEditingNode] = useState<number>();
  const [startNumber, setStartNumber] = useState<number>();

  const [form] = Form.useForm();

  const isEditing = (record: ISectionNodeModel) => record.sequence === editingNode;  

  const nameValidator = (rule: any, value: any, callback: any) =>{
    if(value && originSectionNodes) {
      const record = originSectionNodes.find(c=>c.title === value);
      if(record && record.sequence !== editingNode) {
        message.warning("节点名已存在!")
        callback("节点名已存在!");
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const columns : ColumnsType<ISectionNodeModel> = [
    {
      title: '节点名',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '20%',
      onCell: (record: ISectionNodeModel, index?: number) => ({
        record,
        inputType: 'text',
        dataIndex: 'title',
        title: '节点名',
        editing: isEditing(record),
        rules:[{required: true, whitespace: true, message: '请输入节点名'}, {validator: nameValidator}]
      }),
    },
    {
      title: '开始时间',
      dataIndex: 'startNumber',
      key: 'startNumber',
      width: '15%',
      onCell: (record: ISectionNodeModel, index?: number) => ({
        record,
        inputType: 'picker',
        dataIndex: 'startNumber',
        title: '开始时间',
        editing: isEditing(record) && record.sequence !== 0,
        pickerStart: originSectionNodes?.filter(c=>c.sequence < record.sequence).slice().pop()?.startNumber,
        update: setStartNumber
      }),
      render: (startNumber: number, record: ISectionNodeModel) => `${moment.unix(record.startNumber).utc().format('HH:mm:ss')}`,
    },
    {
      title: '结束时间',
      dataIndex: 'endNumber',
      key: 'endNumber',
      width: '10%',
      render: (endNumber: number, record: ISectionNodeModel) => `${moment.unix(record.endNumber).utc().format('HH:mm:ss')}`,
    },
    {
      title: '',
      key: 'action',
      width: '25%',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? 
          <TableButtonGroup btnProps={[
            {
              onClick: ()=> save(record),
              title: "保存"
            }, 
            {
              onClick: () => setEditingNode(undefined),
              hidden: isPublished,
              title: "取消"
            },
          ]} /> :
          <TableButtonGroup btnProps={[
            {
              onClick: ()=> edit(record),
              hidden: isPublished,
              title: "编辑"
            }, 
            {
              onClick: ()=> handlePlay(record),
              title: "播放"
            },
            {
              onClick: () => deleteConfirm(record),
              hidden: isPublished || record.sequence ===0,
              title: "删除"
            },
          ]} />
      }
    },
  ]

  const edit = (record: ISectionNodeModel) => {
    setEditingNode(record.sequence)
    form.setFieldsValue(record);
  }

  const deleteConfirm = (record: ISectionNodeModel) => {
    ConfirmModal({
      title: "是否删除节点", 
      confirm: () => handleDelete(record)
    })
  }

  const save = async (record: ISectionNodeModel) => {
    const newData = (await form.validateFields()) as ISectionNodeModel;
    if(startNumber) {
      newData.startNumber = startNumber
    }
       
    const previousNode =  originSectionNodes?.filter(c=>c.sequence < record.sequence).slice().pop()
    if(previousNode && startNumber && startNumber !== previousNode.endNumber) {
      previousNode.endNumber = startNumber
      handleSave(previousNode)
    }
    
    handleSave({...record, ...newData})
    setEditingNode(undefined)
    setStartNumber(undefined)
  }

  return (
    <Form form={form} component={false}>
      <Table
        loading={loading}
        showHeader={false}
        components={{
          body: {
            cell: EditableCell
          }
        }}
        dataSource={originSectionNodes}
        size={'small'}
        pagination={false}
        rowKey={record => record.sequence}
        columns={columns} />
    </Form>    
  )
}