import { Form } from 'antd';
import { ICourseRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export const CourseUser : FunctionComponent<{currentCourse: ICourseRspModel | undefined, showPublish: boolean}> 
= ({currentCourse, showPublish}) => {
  return (
    <>
      {
        currentCourse?.id ? showPublish ? 
          <>
            <Form.Item label={"发布者"}>
              {currentCourse.publishedBy?.name}
            </Form.Item>
            <Form.Item label={"发布时间"}>
              {currentCourse.publishedDate && moment(currentCourse.publishedDate).format('YYYY-MM-DD')}
            </Form.Item>
          </> : 
          <>
            <Form.Item label={"最后修改者"}>
              {currentCourse.modifiedBy?.name}
            </Form.Item>
            <Form.Item label={"最后修改时间"}>
              {currentCourse.modifiedDate && moment(currentCourse.modifiedDate).format('YYYY-MM-DD')}
            </Form.Item>
            <Form.Item label={"创建者"}>
              {currentCourse.createdBy?.name}
            </Form.Item>
            <Form.Item label={"创建时间"}>
              {currentCourse.createdDate && moment(currentCourse.createdDate).format('YYYY-MM-DD')}
            </Form.Item>
          </> : 
        undefined
      }
    </>
  );
}
