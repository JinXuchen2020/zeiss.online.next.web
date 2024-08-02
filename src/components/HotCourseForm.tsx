import { Button, Col, Form, Input, Row, Space, Image } from 'antd';
import { CourseUser, Loading } from 'components';
import { ICourseRspModel, IHotCourseRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CourseService } from 'services';

export const HotCourseForm : FunctionComponent<{currentHotCourse: IHotCourseRspModel | undefined, save: any, selectCourse: any}> 
= ({currentHotCourse, save, selectCourse}) => {

  const [courseModel, setCourseModel] = useState<ICourseRspModel>()
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  useEffect(() => {
    if(currentHotCourse?.course?.id) {
      setIsLoading(true)
      setLoadingTip("加载课程...")
      CourseService.getCourse(currentHotCourse.course?.id).then(rsp => {
        setCourseModel(rsp)
        setIsLoading(false)
      })
    };
  }, [currentHotCourse?.course?.id]);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item hidden={courseModel?.coverImage === undefined} label="图片" >
          {
            courseModel?.coverImage && 
              <Image src={courseModel.coverImage.contentPath} alt="avatar" style={{ height: 100 }} />
          }
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
        {/* <Form.Item label="简介">
          <Input.TextArea rows={4}></Input.TextArea>
        </Form.Item> */}
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
