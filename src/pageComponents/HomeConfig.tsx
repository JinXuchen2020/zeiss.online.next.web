import { Button, Col, Modal, Row, Space, Tabs } from 'antd';
import { BannerTable, BannerForm, CourseSelectTable, HotCourseTable, HotCourseForm, HomeReview, Loading, TableSearch, ConfirmModal } from 'components';
import { IBannerCourseReqModel, IBannerCourseRspModel, ICourseQueryOption, ICourseRspModel, IHotCourseReqModel, IHotCourseRspModel, isOfType } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CourseService, HomeService } from 'services';
import queryString from 'query-string';
import { LeftOutlined} from '@ant-design/icons';

const { TabPane } = Tabs;
export type Flag = "Base" | "Banner" | "HotCourse"| "SelectCourse";
export const HomeConfig : FunctionComponent = () => {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  
  const [bannerModels, setBannerModels] = useState<IBannerCourseRspModel[]>();
  const [bannerModel, setBannerModel] = useState<IBannerCourseRspModel>();

  const [hotCourseModels, setHotCourseModels] = useState<IHotCourseRspModel[]>();
  const [hotCourseModel, setHotCourseModel] = useState<IHotCourseRspModel>();

  const [isLoading, setIsLoading] = useState(false); 

  const [loadingTip, setLoadingTip] = useState<string>()

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [courses, setCourses] = useState<ICourseRspModel[]>();

  const [activeKey, setActiveKey] = useState('1');
  const [pageFlag, setPageFlag] = useState<Flag>("Base");

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  }

  const handlePreview = () => {
    setShowReviewModal(true)
  }

  const handleBack = () => {
    if(pageFlag === "Base") {
      navigate("/homeConfig")
    }
    else {
      setPageFlag("Base");
    }
  }

  const backBtnLabel = () => {
    if(pageFlag === "SelectCourse") {
      return "选择课程"
    }
    else {
      return `${bannerModel?.id || hotCourseModel?.id  ? "更新" : "新建"}${activeKey === "1" ? "横幅" : "热门课程"} `
    }
  }

  const handleBannerManage = (banner: IBannerCourseRspModel | undefined = undefined) => {
    if(bannerModels) {
      if(banner === undefined) {
        const sequences = bannerModels.map(c=>c.sequence);
        const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
        banner = {
          sequence : maxSequence + 1,
          isValid: true
        };
      }
      
      setBannerModel(banner);
      setPageFlag("Banner");
    }
  }

  const handleHotCourseManage = (item: IHotCourseRspModel | undefined = undefined) => {
    if(hotCourseModels) {
      if(item === undefined) {
        const sequences = hotCourseModels.map(c=>c.sequence);
        const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
        item = {
          sequence : maxSequence + 1
        };
      }
      
      setHotCourseModel(item);
      setPageFlag("HotCourse");
    }
  }

  const showSelectCourse = () => {
    setPageFlag("SelectCourse");
    refreshCourses({})
  }

  const handleSelectCourse = (course: ICourseRspModel) => {
    if(activeKey === "1") {      
      handleBannerUpdate({course: course});
      setPageFlag("Banner");
    }
    else if (activeKey === "2") {
      handleHotCourseUpdate({course: course});      
      setPageFlag("HotCourse");
    }
  }

  const handleBannerUpdate = (newValue: Partial<IBannerCourseRspModel>) => {
    setBannerModel({...bannerModel!, ...newValue})
  }

  const handleHotCourseUpdate = (newValue: Partial<IHotCourseRspModel>) => {
    setHotCourseModel({...hotCourseModel!, ...newValue})
  }

  const handleBannerSave = () => {
    if(bannerModel) {
      const input : IBannerCourseReqModel = {
        ...bannerModel,
        courseId: bannerModel.course?.id,
        assetLibraryId: bannerModel.imageLibrary?.id
      }

      setIsLoading(true)
      setLoadingTip("保存横幅...")
      if(bannerModel.id) {
        HomeService.updateBanner(bannerModel.id, input).then(()=> {
          setIsLoading(false)
          refreshBanners()
          setPageFlag("Base");
        })
      }
      else {
        HomeService.addBanner(input).then(() => {
          setIsLoading(false)
          refreshBanners()
          setPageFlag("Base");
        })
      }
    }
  }

  const handleHotCourseSave = () => {
    if(hotCourseModel) {
      const input : IHotCourseReqModel = {
        ...hotCourseModel,
        courseId: hotCourseModel.course?.id,
      }

      setIsLoading(true)
      setLoadingTip("保存热门课程...")
      if(hotCourseModel.id) {
        HomeService.updateHotCourse(hotCourseModel.id, input).then(()=> {
          setIsLoading(false)
          refreshHotCourses()
          setPageFlag("Base");
        })
      }
      else {
        HomeService.addHotCourse(input).then(() => {
          setIsLoading(false)
          refreshHotCourses()
          setPageFlag("Base");
        })
      }
    }
  }

  const handleChangeSequence = (banner: IBannerCourseRspModel, relatedBanner: IBannerCourseRspModel) => {
    const sequence = banner.sequence;
    banner.sequence = relatedBanner.sequence;
    relatedBanner.sequence = sequence;

    const relatedBannerInput : IBannerCourseReqModel ={
      ...relatedBanner,
      courseId: relatedBanner.course?.id,
      assetLibraryId: relatedBanner.imageLibrary?.id
    }

    const bannerInput : IBannerCourseReqModel ={
      ...banner,
      courseId: banner.course?.id,
      assetLibraryId: banner.imageLibrary?.id
    }
  
    let promiseList: Promise<unknown>[] = [];

    promiseList.push(HomeService.updateBanner(relatedBanner.id!, relatedBannerInput));
    promiseList.push(HomeService.updateBanner(banner.id!, bannerInput));

    Promise.all(promiseList).then(() => {
      refreshBanners()
    })
  }

  const ChangeSequenceConfirm = async (item: IHotCourseRspModel | IBannerCourseRspModel, isUp: boolean) => {    
    if (isOfType<IBannerCourseRspModel>(item, "imageLibrary")) {
      let related: IBannerCourseRspModel;
      if(isUp) {
        related = bannerModels?.filter(c=>c.sequence < item.sequence).slice().pop()!;
      }
      else{
        related = bannerModels?.find(c=>c.sequence > item.sequence)!;
      }

      const itemDbData = await HomeService.getBanner(item.id!);
      const relatedItemDbData = await HomeService.getBanner(related.id!);

      if (itemDbData.sequence !== item.sequence || relatedItemDbData.sequence !== related.sequence) {
        ConfirmModal({
          title: "当前横幅已更新，是否立即刷新！",
          confirm: () => {
            refreshBanners()
          },
          okText: "是",
          cancelText:"否"
        })
      }
      else {
        handleChangeSequence(item, related)
      }
    }
    else {      
      let related: IHotCourseRspModel;
      if(isUp) {
        related = hotCourseModels?.filter(c=>c.sequence < item.sequence).slice().pop()!;
      }
      else{
        related = hotCourseModels?.find(c=>c.sequence > item.sequence)!;
      }

      const itemDbData = await HomeService.getHotCourse(item.id!);
      const relatedItemDbData = await HomeService.getHotCourse(related.id!);
      if (itemDbData.sequence !== item.sequence || relatedItemDbData.sequence !== related.sequence) {
        ConfirmModal({
          title: "当前热门课程已更新，是否立即刷新！",
          confirm: () => {
            refreshHotCourses()
          },
          okText: "是",
          cancelText:"否"
        })
      }
      else {
        handleChangeHotCourseSequence(item, related)
      }
    }    
  }

  const handleChangeHotCourseSequence = (item: IHotCourseRspModel, relatedItem: IHotCourseRspModel) => {
    const sequence = item.sequence;
    item.sequence = relatedItem.sequence;
    relatedItem.sequence = sequence;

    const relatedInput : IHotCourseReqModel ={
      ...relatedItem,
      courseId: relatedItem.course?.id
    }

    const input : IHotCourseReqModel ={
      ...item,
      courseId: item.course?.id,
    }
  
    let promiseList: Promise<unknown>[] = [];

    promiseList.push(HomeService.updateHotCourse(relatedItem.id!, relatedInput));
    promiseList.push(HomeService.updateHotCourse(item.id!, input));

    Promise.all(promiseList).then(() => {
      refreshHotCourses()
    })
  }

  const handleBannerDelete = (banner: IBannerCourseRspModel) => {
    if(bannerModels) {
      if(banner.id) {
        setIsLoading(true)
        setLoadingTip("删除横幅...")
        HomeService.deleteBanner(banner.id).then(() => {
          setIsLoading(false)
          refreshBanners()
        })
      }
      else {
        const index  = bannerModels.indexOf(banner);
        bannerModels?.splice(index, 1);
        setBannerModels([...bannerModels])
      }
    }
  }

  const handleHotCourseDelete = (hotCourse: IHotCourseRspModel) => {
    if(hotCourseModels) {
      if(hotCourse.id) {
        setIsLoading(true)
        setLoadingTip("删除热门课程...")
        HomeService.deleteHotCourse(hotCourse.id).then(() => {
          setIsLoading(false)
          refreshHotCourses()
        })
      }
      else {
        const index  = hotCourseModels.indexOf(hotCourse);
        hotCourseModels.splice(index, 1);
        setHotCourseModels([...hotCourseModels])
      }
    }
  }

  const refreshBanners = () => {
    setIsLoading(true)
    setLoadingTip("加载横幅...")
    HomeService.getBanners().then(rsp => {
      if(rsp && rsp instanceof Array) {
        setBannerModels(rsp);
      }

      setIsLoading(false)
    })
  }

  const refreshHotCourses = () => {
    setIsLoading(true)
    setLoadingTip("加载热门课程...")
    HomeService.getHotCourses().then(rsp => {
      if(rsp && rsp instanceof Array) {
        setHotCourseModels(rsp);
      }

      setIsLoading(false)
    })
  }

  const refreshCourses = (query: Partial<ICourseQueryOption>) => {
    query.isPublished= true
    setIsLoading(true);
    setLoadingTip("加载课程...")
    CourseService.getCourses(query).then(rsp => {
      if(rsp && rsp.data instanceof Array) {
        setCourses([...rsp.data]);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {    
    const query: Partial<ICourseQueryOption> = queryString.parse(searchParams.toString())
    refreshCourses(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  useEffect(() => {
    if(activeKey === "1") {
      refreshBanners()
    }
    else if(activeKey === "2") {
      refreshHotCourses()
    }
  }, [activeKey]);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row>
        <Col>
          {
            pageFlag !== "Base" ? 
              <Button type="text" icon ={<LeftOutlined />} onClick={handleBack}>{backBtnLabel()}</Button> : undefined
          }
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>        
        {
          pageFlag === "Banner" ?
            <Col offset={5} span={14}>
              <BannerForm 
                currentBanner={bannerModel}
                update={handleBannerUpdate} 
                save={handleBannerSave}
                selectCourse={showSelectCourse} />
            </Col> :
          pageFlag === "HotCourse" ?
           <Col offset={5} span={14}>
             <HotCourseForm 
              currentHotCourse={hotCourseModel}
              save={handleHotCourseSave}
              selectCourse={showSelectCourse} />
           </Col> :
          pageFlag === "SelectCourse" ?
            <Col offset={1} span={22}>
              <Row style={{marginBottom: 10}}>
                <Col span={18}>
                  <TableSearch 
                    optionKey={'name'} 
                    placeholder={'请输入课程名'} 
                    buttonText={'查找'} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <CourseSelectTable 
                    currentCourses={activeKey === "1" ? 
                      courses?.filter(c=> bannerModels ? bannerModels.findIndex(t=> t.course?.id === c.id) < 0 : true) : 
                      courses?.filter(c=> hotCourseModels ? hotCourseModels.findIndex(t=> t.course?.id === c.id) < 0 : true)
                    }
                    loading={false}
                    handleSelect={handleSelectCourse} />
                </Col>
              </Row>
            </Col> :
            <Col offset={1} span={22}>
              <Tabs activeKey={activeKey} onChange={handleActiveTab}>
                <TabPane tab="横幅" key="1">
                  <Row style={{marginBottom: 10}}>
                    <Col span={24}>
                      <Space style={{float: 'right'}}>
                        <Button type="primary" onClick={() => handlePreview()}>预览</Button>
                        <Button type="primary" onClick={() => handleBannerManage()} >新建</Button>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BannerTable 
                        originBanners={bannerModels} 
                        loading={false} 
                        manage={handleBannerManage} 
                        handleDelete={handleBannerDelete} 
                        changeSequence={ChangeSequenceConfirm} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="热门课程" key="2">
                  <Row style={{marginBottom: 10}}>
                    <Col span={24}>
                      <Space style={{float: 'right'}}>
                        <Button type="primary" onClick={() => handlePreview()}>预览</Button>
                        <Button type="primary" onClick={() => handleHotCourseManage()}>新建</Button>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <HotCourseTable 
                        originHotCourses={hotCourseModels} 
                        loading={false} 
                        manage={handleHotCourseManage} 
                        handleDelete={handleHotCourseDelete} 
                        changeSequence={ChangeSequenceConfirm} />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Col>            
        }
      </Row>
      <Modal 
        title="首页预览" 
        visible={showReviewModal}
        centered={true}
        destroyOnClose={true} 
        footer={(<Button onClick={()=>setShowReviewModal(false)} type="primary">返回</Button>)} 
        onCancel={()=>setShowReviewModal(false)}
      >
        <HomeReview />
      </Modal>  
    </>
  )
}
