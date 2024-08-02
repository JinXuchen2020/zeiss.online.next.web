import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Carousel, Image, Row, Col, List, Avatar, Affix, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IAssetRspModel, IBannerCourseRspModel, IHotCourseRspModel } from 'models';
import { AssetService, HomeService } from 'services';
import { Loading } from 'components';

export const HomeReview: FunctionComponent = ()=> {
  const isResponsive = window.screen.width < 415;

  const [operationImage, setOperationImage] = useState<IAssetRspModel>()
  const [publicImage, setPublicImage] = useState<IAssetRspModel>()

  const [bannerModels, setBannerModels] = useState<IBannerCourseRspModel[]>();

  const [hotCourseModels, setHotCourseModels] = useState<IHotCourseRspModel[]>();

  const [isLoading, setIsLoading] = useState(false); 

  const [loadingTip, setLoadingTip] = useState<string>()

  const loadingData = useCallback(async() => {
    if(isLoading) {
      const banners = await HomeService.getBanners()
      setBannerModels(banners)

      const operation = await AssetService.getImages({type: "ButtonOperation"})
      setOperationImage(operation[0])

      const publicIm = await AssetService.getImages({type: "ButtonPublic"})
      setPublicImage(publicIm[0])

      const hotCourses = await HomeService.getHotCourses()
      setHotCourseModels(hotCourses)

      setIsLoading(false)
    }    
  }, [isLoading]) 

  useEffect(() => {
    if(!isLoading && operationImage === undefined) {
      setIsLoading(true)
      setLoadingTip("加载中...")
    }
    else if(operationImage === undefined) {
      loadingData()
    }  
  }, [isLoading]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Affix offsetTop={0}>
        <Row className='section_card itemTop'>
          <Col span={24}><Input placeholder="搜索课程" allowClear className='banner' addonAfter={<SearchOutlined/>}/></Col>
        </Row>
      </Affix>
      <Row>
        <Col span={24}>
          <Carousel autoplay className='banner section_card'>
            {
              bannerModels?.map((item: IBannerCourseRspModel) => {
                return <Image src={item.imageLibrary?.contentPath} width='100%' height={isResponsive ? 168 : 278} preview={false} key={item.id}/>
              })
            }
          </Carousel>
        </Col>
      </Row>
      <Row gutter={4} className='typeRow section_card'>
        <Col span={11} className='typeCol'>
          <Image src={publicImage?.contentPath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
          <div>云课堂</div>
        </Col> 
        <Col span={2} className='typeSeperateCol'>
          <div className='seperateLine'></div>
        </Col>
        <Col span={11} className='typeCol'>
          <Image src={operationImage?.contentPath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
          <div>培训课程</div>
        </Col>  
      </Row>
      <List
        split={true}
        className='home'
        itemLayout={'horizontal'}
        dataSource={hotCourseModels}
        loading={false}
        renderItem={item => (
          <List.Item
            key={item.id}
          >
          <List.Item.Meta
            avatar={<Avatar alt={item.course?.coverImage?.name} style={{width: 104, height: 64}} src={item.course?.coverImage?.contentPath} shape='square'/>}
            title={item.course?.name}
          />
          </List.Item> 
        )}
      />
    </> 
  )
}
