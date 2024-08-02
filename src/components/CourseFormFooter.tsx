import { Button, FormInstance, Space } from 'antd';
import { ConfirmModal } from 'components';
import { CategoryType, ICourseRspModel } from 'models';
import React, { FunctionComponent } from 'react';

export const CourseFormFooter: FunctionComponent<{currentCourse: ICourseRspModel | undefined, form: FormInstance, handlePreview: any, save: any, handleDelete: any, isPublished?: boolean}> 
= ({currentCourse, form, handlePreview, save, handleDelete, isPublished}) => {

  const handleDeleteConfirm =() => {
    ConfirmModal({
      title: "是否删除课程？", 
      confirm: () => handleDelete()
    })
  }

  const handleSave = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = undefined
        save(currentCourse)
      })
      .catch(() => {
      })
    }
  }

  const handlePublish = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = true
        save(currentCourse)
      })
      .catch(() => {
      })
    }
  }

  const handleUnPublish = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = false
        save(currentCourse)
      })
      .catch(() => {
      })
    }
  }

  const handleSubmit = () => {
    if(currentCourse) {
      form.validateFields().then(() =>{
        currentCourse.isPublished = false
        save(currentCourse)
      })
      .catch(() => {
      })
    }
  }

  const canPreview = () => {
    let isDisabled = true
    if(currentCourse) {
      if(currentCourse?.categoryRootName === CategoryType[0]) {
        if(currentCourse.sections && currentCourse.sections.length === 1 && currentCourse.sections[0].assetName) {
          isDisabled = false
        }
      }
      else {
        if(currentCourse.sections && currentCourse.sections.length > 0) {
          isDisabled = false
        }
      }
    }

    return isDisabled
  }

  return (
    <Space>
      <Button disabled={(() => canPreview())()} type="primary" onClick={handlePreview}>预览</Button>
      {
        isPublished ? 
        <>
          {
            currentCourse?.isPublished ? 
            <Button type="primary" onClick={handleUnPublish}>下线</Button> :
            <Button type="primary" onClick={handlePublish}>发布</Button>
          }
        </> : 
        currentCourse?.isPublished ? undefined :
        <>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button type="primary" onClick={handleSubmit}>提交</Button>
          <Button type="default" onClick={handleDeleteConfirm}>删除</Button>
        </>
      }
    </Space>
  );
}

