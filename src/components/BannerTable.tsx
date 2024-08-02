import { Table, Image } from "antd"
import React, { FunctionComponent } from "react";
import { IAssetRspModel, IBannerCourseRspModel, ICourseRspModel } from "models";
import { ColumnsType } from "antd/lib/table";
import { CaretUpOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfirmModal, TableButtonGroup } from "components";

export const BannerTable : FunctionComponent<{originBanners: IBannerCourseRspModel[] | undefined, loading: boolean, manage: any, handleDelete: any, changeSequence: any}> 
= ({originBanners, loading, manage, handleDelete, changeSequence}) => {

  const columns : ColumnsType<IBannerCourseRspModel> = [
    {
      title: '横幅',
      dataIndex: 'imageLibrary',
      key: 'imageLibrary',
      width: 170,
      render: (asset: IAssetRspModel| undefined) => (asset && <Image style={{width: 150, height: 80}} preview={false} src={asset.contentPath} />)
    },
    {
      title: '课程名称',
      dataIndex: 'course',
      key: 'course',
      width: '35%',
      ellipsis: true,
      render: (course: ICourseRspModel| undefined) => course?.name
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: '20%',
      render: (sequence: number, record: IBannerCourseRspModel) => caretIcons(record),
      responsive: ['sm'],
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: '10%',
      render: (sequence: number, record: IBannerCourseRspModel) => caretSmallIcons(record),
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

  const caretIcons = (banner: IBannerCourseRspModel) => {
    if(originBanners) {
      const allSequences = originBanners.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(banner, true),
            title: "上移",
            disabled: banner.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(banner, false),
            title: "下移",
            disabled: banner.sequence === maxSequence
          },
        ]} />
      )
    }
  }

  const caretSmallIcons = (banner: IBannerCourseRspModel) => {
    if(originBanners) {
      const allSequences = originBanners.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(banner, true),
            icon: <CaretUpOutlined />,
            disabled: banner.sequence === minSequence
          }, 
          {
            onClick: () => changeSequence(banner, false),
            icon: <CaretDownOutlined />,
            disabled: banner.sequence === maxSequence
          },
        ]} size="small" />
      )
    }
  }

  const deleteConfirm = (record: IBannerCourseRspModel) => {
    ConfirmModal({
      title: "是否删除横幅", 
      confirm: () => handleDelete(record)
    })
  }

  return (
    <Table 
        loading={loading}
        dataSource={originBanners}
        size={'small'}
        rowKey={'id'}
        columns={columns} />
  )
}