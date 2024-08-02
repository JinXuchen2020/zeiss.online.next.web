import { Table, Image } from "antd"
import React, { FunctionComponent } from "react";
import { ICourseRspModel, IHotCourseRspModel } from "models";
import { ColumnsType } from "antd/lib/table";
import { CaretUpOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfirmModal, TableButtonGroup } from "components";

export const HotCourseTable : FunctionComponent<{originHotCourses: IHotCourseRspModel[] | undefined, loading: boolean, manage: any, handleDelete: any, changeSequence: any}> 
= ({originHotCourses, loading, manage, handleDelete, changeSequence}) => {

  const columns : ColumnsType<IHotCourseRspModel> = [
    {
      title: '缩略图',
      dataIndex: 'course',
      key: 'coverImage',
      width: 170,
      render: (course: ICourseRspModel| undefined) => (course?.coverImage && <Image style={{width: 150, height: 80}} preview={false} src={course.coverImage.contentPath} />)
    },
    {
      title: '课程名称',
      dataIndex: 'course',
      key: 'name',
      width: '35%',
      ellipsis: true,
      render: (course: ICourseRspModel| undefined) => course?.name
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: '20%',
      render: (sequence: number, record: IHotCourseRspModel) => caretIcons(record),
      responsive: ['sm'],
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: '10%',
      render: (sequence: number, record: IHotCourseRspModel) => caretSmallIcons(record),
      responsive: ['xs'],
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => manage(record),
            title: "编辑"
          }, 
          {
            onClick: () => deleteConfirm(record),
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
            onClick: () => manage(record),
            icon: <EditOutlined />
          }, 
          {
            onClick: () => deleteConfirm(record),
            icon: <DeleteOutlined />
          },
        ]} size="small" />
      ),
      responsive: ['xs'],
    }
  ]

  const caretIcons = (hotCourse: IHotCourseRspModel) => {
    if(originHotCourses) {
      const allSequences = originHotCourses.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(hotCourse, true),
            title: "上移",
            disabled: hotCourse.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(hotCourse, false),
            title: "下移",
            disabled: hotCourse.sequence === maxSequence
          },
        ]} />
      )
    }
  }

  const caretSmallIcons = (hotCourse: IHotCourseRspModel) => {
    if(originHotCourses) {
      const allSequences = originHotCourses.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(hotCourse, true),
            icon: <CaretUpOutlined />,
            disabled: hotCourse.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(hotCourse, false),
            icon: <CaretDownOutlined />,
            disabled: hotCourse.sequence === maxSequence
          },
        ]} size="small" />
      )
    }
  }

  const deleteConfirm = (record: IHotCourseRspModel) => {
    ConfirmModal({
      title: "是否删除热门课程", 
      confirm: () => handleDelete(record)
    })
  }

  return (
    <Table 
        loading={loading}
        dataSource={originHotCourses}
        size={'small'}
        rowKey={'id'}
        columns={columns} />
  )
}