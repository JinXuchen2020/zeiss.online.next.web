import { Button, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FunctionComponent, Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IQuestionRspModel } from "models";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const ExamTable : FunctionComponent<{loading: boolean, originQuestions: IQuestionRspModel[] | undefined, originSelectedQuestions: IQuestionRspModel[] | undefined, isEditable: boolean, isInDialog: boolean, handleSelect: (selQuestions: IQuestionRspModel[])=> void, handleDelete: ((question: IQuestionRspModel)=> void) | undefined }> = ({loading, originQuestions, originSelectedQuestions, isEditable, isInDialog, handleSelect, handleDelete}) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestionRspModel[] | undefined>();
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestionRspModel[]>();

  const columns : ColumnsType<IQuestionRspModel> = [
    {
      title: '习题题干',
      dataIndex: 'stem',
      key: 'stem',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '习题类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '习题难度',
      dataIndex: 'level',
      key: 'level'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space hidden={isInDialog} size="middle">
          <Button type="text" hidden={!isEditable} icon={<EditOutlined />} onClick={() => navigate(`/exams/${record.id}`)}>编辑</Button>
          <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete && handleDelete(record)}>删除</Button>
        </Space>
      )
    }
  ]

  const handleSelectRows = (selectedRowKeys: React.Key[], selectedRows: IQuestionRspModel[])=> 
  {
    handleSelect(selectedRows);
  }

  const getRowKeys = (examModels: IQuestionRspModel[] | undefined) => 
  {
    if (examModels) {
      return examModels.map(lp => lp.id as Key);
    }
  }

  useEffect(() => {
    setQuestions(originQuestions);
    setSelectedQuestions(originSelectedQuestions);
  },[originQuestions, originSelectedQuestions]);

  return (
    <>
      <Table 
        rowSelection=
        {
          { 
            onChange: handleSelectRows,
            selectedRowKeys: getRowKeys(selectedQuestions),
          }
        }
        size={'small'}
        loading={loading}
        rowKey={'id'}                 
        dataSource={questions}
        columns={columns} />
    </>
  );
}
