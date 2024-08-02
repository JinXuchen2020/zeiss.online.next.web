import { Table, Image, Row, Tag, Tooltip } from "antd"
import React, { FunctionComponent, useEffect, useState } from "react";
import { CategoryType, IAssetRspModel, ICourseQueryOption, ICourseReqModel, ICourseRspModel, ITagRspModel, IUserRspModel } from "models";
import { EditOutlined, ProfileOutlined } from '@ant-design/icons';
import { CourseService  } from "services";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import queryString from 'query-string';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Loading, TableButtonGroup } from "components";
import { TableCurrentDataSource } from "antd/lib/table/interface";

export const CourseTable : FunctionComponent<{originSelected: ICourseRspModel[] | undefined, categoryRootName: string, updateMethod: any, preview: any, isPublished?: boolean}> 
= ({originSelected, categoryRootName, isPublished, updateMethod, preview}) => {
  const navigate = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const currentService = CourseService;

  const [courses, setCourses] = useState<ICourseRspModel[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  const [filterCourses, setFilterCourses] = useState<ICourseRspModel[]>()
  
  const columns : ColumnsType<ICourseRspModel> = [
    {
      title: '缩略图',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 120,
      fixed: 'left',
      render: (asset: IAssetRspModel| undefined) => (asset ? <Image style={{width: 150, height: 80}} preview={false} src={asset.contentPath} /> : <div className="course-empty-image">课程封面</div>)
    },    
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      ellipsis: true,
      render: (tags: ITagRspModel[], record: ICourseRspModel) => tagElements(record),
    },
    {
      title: '类型',
      dataIndex: 'level',
      key: 'level',
      width: categoryRootName === CategoryType[0] ? 0 : 100,
      ellipsis: true,
      filters: [
        {
          text:'公共课程',
          value:1,
        },
        {
          text:'系列课程',
          value:2,
        }
      ],      
      onFilter: (value, record) => record.level === value,
      render: (value: number) => 
      {
        switch(value) {
          case 1:
            return '公共课程';
          case 2:
            return '系列课程';
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: categoryRootName === CategoryType[0] ? 180 : 80,
      ellipsis: true,
      filters: isPublished ?  [
        {
          text:'发布',
          value:true,
        },
        {
          text:'未发布',
          value:false,
        }
      ] :
      [
        {
          text:'发布',
          value:true,
        },
        {
          text:'未发布',
          value:false,
        },
        {
          text:'草稿',
          value:0,
        }
      ],
      onFilter: (value, record) => {
        return value === 0 ? record.isPublished === null : record.isPublished === value
      },
      render: (state: boolean) => 
      {
        switch(state) {
          case false:
            return '未发布';
          case true:
            return '发布';
          default:
            return '草稿'
        }
      }
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 80,
      render: (createdBy: IUserRspModel | undefined ) => createdBy && createdBy.name,
    },
    {
      title: '发布时间',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      width: 80,
      ellipsis: true,
      render: (publishedDate: Date | undefined) => publishedDate && moment(publishedDate).format('YYYY-MM-DD'),
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: '顺序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: 40,
      fixed: 'right',
      render: (sequence: number, record: ICourseRspModel) => caretIcons(record),
    },
    {
      title: '',
      key: 'action',
      width: 40,
      fixed: 'right',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => handleEdit(record),
            title: "查看"
          }, 
          {
            onClick: ()=> preview(record),
            disabled: disablePreview(record),
            title: "预览"
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
            onClick: () => handleEdit(record),
            icon: <EditOutlined />
          }, 
          {
            onClick: ()=> preview(record),
            disabled: disablePreview(record),
            icon: <ProfileOutlined />
          },
        ]} size="small" />
      ),
      responsive: ['xs'],
    }
  ]

  const handleEdit = (record: ICourseRspModel) => {
    let url = `/courses/${record.id}`
    if(isPublished !== undefined) {
      url = `/publishCourses/${record.id}`
    }

    navigate.push(url)
  }

  const disablePreview = (record: ICourseRspModel) => {
    let isDisabled = true
    if(record) {
      if(record.categoryRootName === CategoryType[0]) {
        if(record.sections && record.sections.length >0 && record.sections[0].assetName) {
          isDisabled = false
        }
      }
      else {
        if(record.sections && record.sections.length > 0) {
          isDisabled = false
        }
      }
    }

    return isDisabled
  }

  const caretIcons = (item: ICourseRspModel) => {
    if(courses) {
      const allSequences = courses.map(c=>c.sequence);
      const maxSequence = Math.max(...allSequences);
      const minSequence = Math.min(...allSequences);

      return (
        <TableButtonGroup btnProps={[
          {
            onClick: () => changeSequence(item, true),
            title: "上移",
            disabled: item.sequence === maxSequence
          }, 
          {
            onClick: () => changeSequence(item, false),
            title: "下移",
            disabled: item.sequence === minSequence
          },
        ]} />
      )
    }
  }

  const tagElements = (record: ICourseRspModel) => {
    return (
      <Row>
        {
          record.categoryRootName === CategoryType[0] ? 
          record.tags.filter(c=>c.tagType !== "User").map((tag, index)=> {
            const isLongTag = tag.name.length > 8;  
            const tagElem = (
              <Tag
                style={{marginTop: 2}}
                key = {index}
                closable={false}
              >
                {isLongTag ? `${tag.name.slice(0, 8)}...` : tag.name}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag.name} key={index}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          }) : 
          record.categories?.map((tag, index)=> {
            const isLongTag = tag.title.length > 8;  
            const tagElem = (
              <Tag
                style={{marginTop: 2}}
                key = {index}
                closable={false}
              >
                {isLongTag ? `${tag.title.slice(0, 8)}...` : tag.title}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag.title} key={index}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })
        }
      </Row>
    )    
  }

  const compareDate = (a: ICourseRspModel, b: ICourseRspModel)=> {
    const left = a.publishedDate ? moment(a.publishedDate).unix() : 0;
    const right = b.publishedDate ? moment(b.publishedDate).unix() : 0;
    return left - right;
  }

  const refresh = (query: Partial<ICourseQueryOption>) => {
    query.categoryRootName = categoryRootName
    setIsLoading(true);
    setLoadingTip("加载课程...")
    if(isPublished === undefined) {
      currentService.getCourses(query).then(rsp => {
        if(rsp && rsp.data instanceof Array) {
          setCourses([...rsp.data.sort((a,b)=> b.sequence - a.sequence)]);
        }
        setIsLoading(false);
      });
    }
    else {
      currentService.getPublishCourses(query).then(rsp => {
        if(rsp && rsp.data instanceof Array) {
          setCourses([...rsp.data.sort((a,b)=> b.sequence - a.sequence)]);
        }
        setIsLoading(false);
      });
    }
  }

  const changeSequence = (item: ICourseRspModel, isUp: boolean) => {
    let sourceCoureses = courses
    if(filterCourses) {
      sourceCoureses = filterCourses
    }
    if(sourceCoureses) {
      let relatedItem: ICourseRspModel;
      if(isUp) {        
        relatedItem = sourceCoureses.filter(c=>c.sequence > item.sequence).slice().pop()!;
      }
      else {        
        relatedItem = sourceCoureses.find(c=>c.sequence < item.sequence)!;
      }

      const sequence = item.sequence;
      item.sequence = relatedItem.sequence;
      relatedItem.sequence = sequence;
      
      let promiseList : Promise<unknown>[] = []

      const itemInput : ICourseReqModel = {
        ...item, 
        sections: [],
        courseTags: [], 
        coverImageId: item.coverImage?.id,
        paper: undefined,
        courseCategories: []
      };

      promiseList.push(currentService.putCourse(item.id!, itemInput))

      const relatedInput : ICourseReqModel = {
        ...relatedItem, 
        sections: [],
        courseTags: [], 
        coverImageId: relatedItem.coverImage?.id,
        paper: undefined,
        courseCategories: []
      };

      promiseList.push(currentService.putCourse(relatedItem.id!, relatedInput))

      setIsLoading(true);
      setLoadingTip("课程更新...")
      Promise.all(promiseList).then(() => {
        setIsLoading(false);
        const query: Partial<ICourseQueryOption> = queryString.parse(searchParams.toString())
        refresh(query)
      })
    }
  }

  const handleSelect = (selectedRowKeys: React.Key[], selectedRows: ICourseRspModel[])=> 
  {
    updateMethod(selectedRows);
  }

  const handleChange = (pagination: any, filters: any, sorter:any, extra: TableCurrentDataSource<ICourseRspModel>) => {
    if(extra.action === "filter") {
      setFilterCourses(extra.currentDataSource)
    }
  }

  const getSelectRowKeys =() => {
    if(originSelected) {
      return originSelected.map(c=>c.id!);
    }
    else {
      return []
    }
  }

  useEffect(() => {
    const query: Partial<ICourseQueryOption> = queryString.parse(searchParams.toString())
    refresh(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isPublished]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip}  />
      <Table
        onRow={(record) => {
          return {
            onClick: () => {
              if(originSelected) {
                const index = originSelected.findIndex(c=>c.id === record.id);
                if(index < 0){
                  updateMethod([...originSelected, record])
                }
                else {
                  const oldSelected = originSelected;
                  oldSelected.splice(index, 1);
                  updateMethod([...oldSelected])
                }
              }
              else {
                updateMethod([record])
              }
            }
          }
        }}
        dataSource={courses}
        size={'small'}
        rowKey={'id'}
        scroll={{ x: 1300 }}
        onChange={handleChange}
        columns={columns} />
    </>
    
  )
}