import { Table } from "antd"
import React, { FunctionComponent } from "react";
import { ISectionModel } from "models";
import { ColumnsType } from "antd/lib/table";
import { CaretUpOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfirmModal } from "./ConfirmModal";
import { TableButtonGroup } from "components";

export const SectionTable : FunctionComponent<{originSections: ISectionModel[] | undefined, loading: boolean, updateMethod: any, deleteMethod: any, changeSequence: any, isPublished?: boolean}> 
= ({originSections, loading, updateMethod, deleteMethod, changeSequence, isPublished}) => {  
  const columns : ColumnsType<ISectionModel> = [
    {
      title: '章节',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '25%'
    },
    {
      title: '关键字',
      dataIndex: 'keywords',
      key: 'keywords',
      width: '15%',
      responsive: ['sm'],
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: isPublished ? '0' : '25%',
      render: (sequence: number, record: ISectionModel) => caretIcons(record),
      responsive: ['sm'],
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: isPublished ? '0' : '25%',
      render: (sequence: number, record: ISectionModel) => caretSmallIcons(record),
      responsive: ['xs'],
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => updateMethod(record),
            title: "查看"
          }, 
          {
            onClick: ()=> deleteConfirm(record),
            hidden: isPublished,
            title: "删除"
          },
        ]} />
      ),
      responsive: ['sm'],
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => updateMethod(record),
            icon: <EditOutlined />
          }, 
          {
            onClick: ()=> deleteConfirm(record),
            hidden: isPublished,
            icon: <DeleteOutlined />
          },
        ]} size="small" />
      ),
      responsive: ['xs'],
    }
  ]

  const caretIcons = (section: ISectionModel) => {
    if(originSections) {
      const allSequences = originSections.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        isPublished ? undefined :
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(section, true),
            title: "上移",
            disabled: section.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(section, false),
            title: "下移",
            disabled: section.sequence === maxSequence
          },
        ]} />
      )
    }
  }

  const caretSmallIcons = (section: ISectionModel) => {
    if(originSections) {
      const allSequences = originSections.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        isPublished ? undefined :
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(section, true),
            icon: <CaretUpOutlined />,
            disabled: section.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(section, false),
            icon: <CaretDownOutlined />,
            disabled: section.sequence === maxSequence
          },
        ]} size="small" />
      )
    }
  }

  const deleteConfirm = (record: ISectionModel) => {
    ConfirmModal({
      title: "是否删除章节", 
      confirm: () => deleteMethod(record)
    })
  }

  return (
    <Table
      loading={loading}
      dataSource={originSections}
      size={'small'}
      rowKey={record => record.sequence}
      columns={columns} />
  )
}