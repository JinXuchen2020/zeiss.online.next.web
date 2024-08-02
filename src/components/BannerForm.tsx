import { Button, Col, Form, Input, Row, Space } from 'antd';
import { CourseUser, ImageSelectV2, Loading } from 'components';
import { IAssetRspModel, IBannerCourseRspModel, ICourseRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CourseService } from 'services';

export const BannerForm : FunctionComponent<{currentBanner: IBannerCourseRspModel | undefined, update: any, save: any, selectCourse: any}> 
= ({currentBanner, update, save, selectCourse}) => {

  const [courseModel, setCourseModel] = useState<ICourseRspModel>()
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  useEffect(() => {
    if(currentBanner?.course?.id) {
      setIsLoading(true)
      setLoadingTip("加载课程...")
      CourseService.getCourse(currentBanner.course?.id).then(rsp => {
        setCourseModel(rsp)
        setIsLoading(false)
      })
    };
  }, [currentBanner?.course?.id]);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip}  />
      <Form
        labelCol={{ span: 4 }}
        layout="horizontal"
      >
        <Form.Item label="图片" >
          <ImageSelectV2 
            currentImage={currentBanner?.imageLibrary}
            imageType='Banner'
            updateMethod={(asset: IAssetRspModel) => update({ imageLibrary: asset })}
            imageSize = {"168*343"} />
        </Form.Item> 
        <Form.Item label="课程" >
          <Row>
            <Col span={17}>
              <Input value={courseModel?.name} readOnly={true} />
            </Col>
            <Col offset={1} span={6}>
              <Button onClick={selectCourse}>{courseModel === undefined ? "选择课程" : "重新选择"}</Button>
            </Col>
          </Row>
        </Form.Item>
        <CourseUser currentCourse={courseModel} showPublish={true} />
        <Form.Item wrapperCol={{offset: 4}}>
          <Space>
            <Button type="primary" onClick={save}>确认</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
