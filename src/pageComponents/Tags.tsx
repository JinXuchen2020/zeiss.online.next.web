import { Button, Col, List, Modal, Row, Space, Tabs } from 'antd';
import { TableSearch, CategoryTable, Loading, SeriesNumberForm, TagGroup, TagInput } from 'components';
import { CategoryType, ICategoryQueryOption, ICategoryReqModel, IQuickSearchReqModel, ISeriesNumberReqModel, ISeriesNumberRspModel, ISingleCategoryReqModel, ISingleCategoryRspModel, isOfType, ITagGroupRspModel, ITagReqModel, ITagRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CategoryService, HomeService, TagService } from 'services';
import queryString from 'query-string';

const { TabPane } = Tabs;
export type Flag = "Base" | "Banner" | "HotCourse"| "SelectCourse";
export const Tags : FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [tagGroups, setTagGroups] = useState<ITagGroupRspModel[]>();

  const [singleCategories, setSingleCategories] = useState<ISingleCategoryRspModel[]>();

  const [singleCategoryModel, setSingleCategoryModel] = useState<ISingleCategoryRspModel>();

  const [userTagGroup, setUserTagGroup] = useState<ITagGroupRspModel>();

  const [searchTagGroup, setSearchTagGroup] = useState<ITagGroupRspModel>();

  const [isLoading, setIsLoading] = useState(false);

  const [loadingTip, setLoadingTip] = useState<string>()

  const [showSeriesNumbers, setShowSeriesNumbers] = useState(false);

  const [deleteSeriesNumbers, setDeleteSeriesNumbers] = useState<ISeriesNumberRspModel[]>([]);

  const [activeKey, setActiveKey] = useState('1');

  const [isEditing, setIsEditing] = useState(false)

  let singleCategory = singleCategoryModel!

  const setSingleCategory = (props: Partial<ISingleCategoryRspModel>) => {
    setSingleCategoryModel({ ...singleCategory, ...props });
    setIsEditing(true)
  }

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  }

  const handleTagAdd = (tagGroup: ITagGroupRspModel, newValue: ITagRspModel) => {
    if(newValue.tagType === "Search"){
      const searchInput : IQuickSearchReqModel = {
        content: newValue.name
      }
      HomeService.addQuickSearchConfig(searchInput).then(() => {
        refreshQuickSearch()
      })
    }
    else if(newValue.tagType === "User") {
      if (tagGroup.id === undefined) {
        const input: ITagGroupRspModel= {
          name: "用户",
          displayInFilter: true,
          tags:[]
        }
    
        TagService.addTagGroup(input).then(() => {
          TagService.getTagGroups({name: "用户"}).then(rsp => {
            if(rsp && rsp.data) {
              const userTagGroup = rsp.data.find(c=>c.name === "用户")
              setUserTagGroup(userTagGroup)
              const input : ITagReqModel = {
                ...newValue,
              }
      
              TagService.addTag(userTagGroup?.id!, input).then(() => {
                refreshTagGroups()
              })
            }
          })
        })
      }
      else {
        const input : ITagReqModel = {
          ...newValue,
        }

        TagService.addTag(tagGroup.id, input).then(() => {
          refreshTagGroups()
        })
      }
    }
    else {
      if(tagGroup.id) {
        const input : ITagReqModel = {
          ...newValue,
        }

        TagService.addTag(tagGroup.id, input).then(() => {
          refreshTagGroups()
        })
      }
    }
  }

  const handleTagUpdate = (tag: ITagRspModel) => {
    if(tag.tagType === "Search"){
      const searchInput : IQuickSearchReqModel = {
        content: tag.name
      }
      HomeService.updateQuickSearchConfig(tag.id!, searchInput).then(() => {
        refreshQuickSearch()
      })
    }    
    else {
      const input : ITagReqModel = {
        ...tag,
      }

      TagService.updateTag(tag.id!, input).then(() => {
        refreshTagGroups()
      })
    }
  }

  const handleTagDelete = (tag: ITagRspModel) => {    
    if (tag.tagType === "Course") {
      TagService.deleteTag(tag.id!).then(() => {
        refreshTagGroups()
      })
    }
    else if(tag.tagType === "User") {
      TagService.deleteTag(tag.id!).then(() => {
        refreshTagGroups()
      })
    }
    else if(tag.tagType === "Search"){
      HomeService.deleteQuickSearchConfig(tag.id!).then(() => {
        refreshQuickSearch()
      })
    }
  }

  const handleTagGroupAdd = (newValue: string) => {
    const input: ITagGroupRspModel= {
      name: newValue,
      displayInFilter: true,
      tags:[]
    }

    TagService.addTagGroup(input).then(() => {
      refreshTagGroups()
    })
  }

  const handleTagGroupDelete = (tagGroup: ITagGroupRspModel) => {
    TagService.deleteTagGroup(tagGroup.id!).then(() => {
      refreshTagGroups()
    })
  }

  const handleCategoryManage = (category: ISingleCategoryRspModel) => {
    setSingleCategoryModel(category)
    setShowSeriesNumbers(true)
  }

  const handleCategoryCreate = () => {
    if(singleCategories) {
      const sequences = singleCategories.map(c=>c.sequence)
      const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
      const category : ISingleCategoryRspModel = {
        title: "",
        description: "",
        displayInFilter: true,
        sequence: maxSequence + 1,
        seriesNumbers: []
      }
      setSingleCategoryModel(category)
      setShowSeriesNumbers(true)
    }    
  }

  const handleCategoryNameValidate = (value: string) =>{
    if(singleCategories && value){
      const result = singleCategories.find(c=>c.title === value);
      if(result && result.id !== singleCategoryModel?.id){
        return true
      }
      else{
        return false
      }
    }
    else {
      return false
    }
  }

  const handleCategorySave = async () => {
    if(singleCategoryModel && isEditing) {
      let parent = singleCategoryModel.parent!
      if (parent.id === undefined) {
        const parentInput : ICategoryReqModel = {
          ...singleCategoryModel.parent!,
          parent_Id: undefined,
        }
        
        parent = await CategoryService.createCategory(parentInput)
      }
      
      setShowSeriesNumbers(false)
      setIsLoading(true)
      setLoadingTip("保存分类...")
      if(singleCategoryModel.id) {
        let promiseList : Promise<unknown>[] = []
        deleteSeriesNumbers.forEach(sn => {
          promiseList.push(CategoryService.deleteSeriesNumber(sn.id!))
        })

        singleCategoryModel.seriesNumbers.forEach(sn => {
          const snInput : ISeriesNumberReqModel = {
            ...sn
          }

          if(sn.id) {
            promiseList.push(CategoryService.updateSeriesNumber(sn.id, snInput))
          }
          else {
            promiseList.push(CategoryService.addSeriesNumber(singleCategoryModel.id!, snInput))
          }
        })        

        const input : ICategoryReqModel = {
          ...singleCategoryModel,
          parent_Id: parent.id,
        }

        promiseList.push(CategoryService.updateCategory(singleCategoryModel.id, input))
        Promise.all(promiseList).then(() => {
          setIsLoading(false)
          setIsEditing(false)
          setDeleteSeriesNumbers([])
          refreshCategories()
        })
      }
      else {
        const input : ISingleCategoryReqModel = {
          ...singleCategoryModel,
          parent_Id: parent.id,
        }

        CategoryService.createSingleCategory(input).then(() => {
          setIsLoading(false)
          setIsEditing(false)
          setDeleteSeriesNumbers([])
          refreshCategories()
        })
      }
    }
    else {
      setShowSeriesNumbers(false)
      refreshCategories()
    }
  }

  const handleCategoryDelete = async () => {
    if(singleCategoryModel) {                
      setShowSeriesNumbers(false)     
      setIsLoading(true)
      setLoadingTip("删除分类...")
      CategoryService.deleteCategory(singleCategoryModel.id!).then(() => {
        setIsLoading(false)
        setIsEditing(false)
        setDeleteSeriesNumbers([])
        refreshCategories()
      })
    }
  }

  const handleDeleteItem = (item : any) => {
    if(isOfType<ISeriesNumberRspModel>(item,  "seriesNumbers")) {
      if(item.id && deleteSeriesNumbers.findIndex(c=>c.id === item.id) < 0) {
        setDeleteSeriesNumbers([...deleteSeriesNumbers, item])
      }
    }
  }

  const refreshTagGroups = () => {
    setIsLoading(true)
    setLoadingTip("加载标签...")
    TagService.getTagGroups({}).then(rsp => {
      if(rsp && rsp.data) {
        setTagGroups(rsp.data.filter(c=>c.name !== "用户"));
        setUserTagGroup(rsp.data.find(c=>c.name === "用户"))
      }
      
      setIsLoading(false)
    })
  }

  const refreshQuickSearch = () => {
    setIsLoading(true)
    setLoadingTip("加载快捷搜索...")
    HomeService.getQuickSearchConfig().then((rsp => {
      if(rsp && rsp instanceof Array) {
        const tagGroup: ITagGroupRspModel = {
          name: "",
          tags: rsp.map(c => { return { name: c.content, id: c.id, tagType: "Search" } as ITagRspModel}),
          displayInFilter: true
        }

        setSearchTagGroup(tagGroup)
      }

      setIsLoading(false)
    }))
  }

  const refreshCategories = () => {
    setIsLoading(true)
    setLoadingTip("加载分类...")
    const query: Partial<ICategoryQueryOption> = queryString.parse(searchParams.toString())
    CategoryService.getSingleCategories(query).then((singles => {
      if(singles && singles instanceof Array) {
        if(query.title === undefined) {
          CategoryService.getRootCategories().then(root => {
            if(root && root instanceof Array) {
              root.forEach(rt=> {
                if(singles.findIndex(c=>c.parent?.id === rt.id) === -1){
                  const sequences = singles.map(c=>c.sequence)
                  const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
                  const emptySingle : ISingleCategoryRspModel = {
                    title: "",
                    description: "",
                    displayInFilter: true,
                    sequence: maxSequence + 1,
                    seriesNumbers: [],
                    parent: rt
                  }
  
                  singles.push(emptySingle)
                }
              })
            }
            
            setSingleCategories(singles)
            setIsLoading(false)
          })
        }
        else {
          setSingleCategories(singles)
          setIsLoading(false)
        }        
      }
    }))
  }

  useEffect(() => {
    if(activeKey === "1") {
      setSearchParams("")
      refreshTagGroups()
      refreshQuickSearch()
    }
    else if(activeKey === "2") {
      refreshCategories()
    }
  }, [activeKey, searchParams]);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row style={{marginTop: 10}}>        
        <Col offset={1} span={22}>
          <Tabs activeKey={activeKey} onChange={handleActiveTab}>
            <TabPane tab="标签" key="1">
              <Row style={{margin: 20}}>
                <Col span={12}>                  
                  <Row>
                    <Col>
                      云课堂标签
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <List
                        itemLayout="horizontal"
                        loading={false}
                        rowKey={c=>c.id!}
                        dataSource={tagGroups}
                        renderItem={(group, index) => (
                          <TagGroup 
                            currentTagGroup={group}
                            tagType={"Course"}
                            handleAdd={handleTagAdd}
                            handleGroupDelete={handleTagGroupDelete}
                            handleTagDelete={handleTagDelete} 
                            handleUpdate={handleTagUpdate} />   
                        )}
                      />
                    </Col>
                  </Row>                  
                  <Row>
                    <Col style={{paddingLeft: 21, marginTop: 20}}>
                      <TagInput plusLabel="标签组" change={handleTagGroupAdd} />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col>
                      用户标签
                    </Col>
                  </Row>
                  <TagGroup 
                    currentTagGroup={userTagGroup}
                    tagType={"User"}
                    handleAdd={handleTagAdd}
                    handleGroupDelete={undefined}
                    handleTagDelete={handleTagDelete} 
                    handleUpdate={handleTagUpdate} />
                  <Row>
                    <Col>
                      热门搜索
                    </Col>
                  </Row>                  
                  <TagGroup 
                    currentTagGroup={searchTagGroup} 
                    tagType={"Search"}
                    handleAdd={handleTagAdd}
                    handleUpdate={handleTagUpdate}
                    handleGroupDelete={undefined} 
                    handleTagDelete={handleTagDelete} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={`${CategoryType[1]}分类`} key="2">
              <Row style={{marginBottom: 10}}>
                <Col span={18}>
                  <TableSearch 
                    optionKey={'title'} 
                    placeholder={'请输入分类名'} 
                    buttonText={'查找'} />
                </Col>
                <Col span={6}>
                  <Space style={{float: 'right'}}>
                    <Button type="primary" onClick={handleCategoryCreate} >新建</Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <CategoryTable 
                    currentCategories={singleCategories} 
                    loading={false} 
                    handleSelect={handleCategoryManage} />
                </Col>
              </Row>              
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Modal 
        title="序列号配置" 
        visible={showSeriesNumbers}
        centered={true}
        footer={null}
        onCancel={()=>{
          setShowSeriesNumbers(false)
          refreshCategories()
        }} 
        destroyOnClose={true}
      >
        <SeriesNumberForm 
          currentCategory={singleCategoryModel}
          update={setSingleCategory}
          save={handleCategorySave}
          handleDeleteItem={handleDeleteItem}
          validate={handleCategoryNameValidate} 
          handleDelete={handleCategoryDelete} />
      </Modal>
    </>
  )
}