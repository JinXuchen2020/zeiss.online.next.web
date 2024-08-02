import { Form, Input, Radio, Space, Typography } from "antd"
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
import React, { FunctionComponent, useEffect, useState } from "react";
import { IAssetRspModel, ICategoryRspModel, ICourseRspModel, ITagRspModel } from "models";
import { CourseService } from "services";
import { CategorySelectV2, ConfirmModal, CourseFormFooter, CourseUser, ImageSelectV2, KeywordInput, TagSelect } from "components";
import { useNavigate } from "react-router-dom";

export const OperationCourseForm : FunctionComponent<{currentCourse: ICourseRspModel | undefined, update: any, save: any, preview: any, handleDelete: any, showSections: any, showPaper: any, isPublished?: boolean, handleDeleteItem? : any}> 
= ({currentCourse, update, save, preview, handleDelete, showSections, showPaper, isPublished,handleDeleteItem}) => {
  const currentService = CourseService;
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const nameValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(value) {
      currentService.validateCourse(value).then(rsp=>{
        if(typeof rsp === "string" && rsp !== currentCourse?.id) {
          callback('课程名已存在!');
        }
        else {
          callback();
        }
      })
    }
    else{
      callback();
    }    
  }

  const imageValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(!uploadInProgress) {
      if(currentCourse?.coverImage) {
        callback();
      }
      else {
        callback('请上传封面!');
      }
    }
    else {
      callback();
    }
  }

  const categoryValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(currentCourse?.categories && currentCourse.categories.length > 0) {
      callback();
    }
    else {
      callback('请选择标签');
    }
  }

  const sectionsValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(currentCourse?.sections && currentCourse?.sections.length > 0) {
      callback();
    }
    else {
      callback('请至少创建一个章节');
    }
  }

  const paperValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(currentCourse?.level === 2 && currentCourse?.paper) {
      callback();
    }
    else {
      callback('请创建测试');
    }
  }

  const feedbackValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    const feedback = value as string
    if (feedback && feedback.length > 0) {
      const pattern = "^https://mscapp.jingsocial.com/[^\s]*"
      const reg = new RegExp(pattern)
      const result = reg.exec(feedback)
      if (result) {
        callback();
      }
      else {
        callback('请输入有效网址!  有效域名: mscapp.jingsocial.com');
      }
    }
    else {
      callback();
    }    
  }

  const editConfirm = (method :(arg: any) => any, arg: any) => {
    if(isPublished || currentCourse?.isPublished) {
      ConfirmModal({
        title: "该课程已发布, 请先下线此课程！",
        confirm: () => {
          !isPublished && navigate(`/publishCourses/${currentCourse?.id!}`)
        }
      })
    }
    else {
      method(arg)
    }
  }

  const handleDeleteTag = (tag: ITagRspModel) => {
    if(currentCourse) {
      handleDeleteItem(tag)
      let tags = currentCourse.tags;
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
      update({tags: tags});
    }
  }

  const handleAddTag = (tag: ITagRspModel) => {
    update({tags: [...currentCourse?.tags!, tag]});
  }

  const handleDeleteCategory = (item: ICategoryRspModel) => {
    if(currentCourse) {
      handleDeleteItem(item)
      let categories = currentCourse.categories!;
      const index = categories.indexOf(item);
      categories.splice(index, 1);
      update({categories: categories});
    }
  }

  const handleAddCategory = (item: ICategoryRspModel) => {
    if(currentCourse?.categories) {
      update({categories: [...currentCourse?.categories!, item]});
    }
    else {
      update({categories: [item]});
    }
  }

  useEffect(() => {
    if(currentCourse) {
      form.setFieldsValue(currentCourse);
    }
  }, [currentCourse, form]);

  return (
    <>    
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
      >        
        <Form.Item 
          label="标题" 
          name="name"
          wrapperCol={{ span: 10 }}
          validateTrigger={["onBlur", "onChange"]}
          rules={[{required: true, whitespace: true, message: '请输入课程名称'}, { validator: nameValidator}]}
        >
          <Input style={{width: '99.5%'}} autoFocus={true} autoComplete="off" readOnly={currentCourse?.isPublished} disabled={isPublished} placeholder="请输入名称" onChange ={(val: any) => editConfirm(update, { name: val.target.value})}/>
        </Form.Item>
        <Form.Item 
          label="简介"
          name="description"
          wrapperCol={{ span: 10 }}
          rules={[{required: true, whitespace: true, message: '请输入课程简介'}]}
        >
          <Input.TextArea style={{width: '99.5%'}} readOnly={currentCourse?.isPublished} disabled={isPublished} rows={4} value={currentCourse?.description} onChange={(val: any) => editConfirm(update,{ description: val.target.value})}></Input.TextArea>
        </Form.Item>
        <Form.Item label="类型">
          <Radio.Group disabled={isPublished} onChange={(e) => editConfirm(update, {level: e.target.value})} value={currentCourse?.level}>
            <Radio value={1}>公共课程</Radio>
            <Radio value={2}>系列课程</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item 
          label="封面" 
          name="coverImage"
          rules={[{required: true, validator: imageValidator}]}
        >
          <ImageSelectV2 
            currentImage={currentCourse?.coverImage} 
            imageType="Image" 
            disabled={isPublished}
            updateMethod={(asset: IAssetRspModel) => editConfirm(update, {coverImage: asset})}
            setInProgress={(status: boolean) => {
              setUploadInProgress(status)
              form.validateFields(["coverImage"])
            }}
            imageSize={"16*9"} />
        </Form.Item>
        <Form.Item 
          label="分类标签"
          name="categories"
          rules={[{required: true, validator: categoryValidator}]}
        >
          <CategorySelectV2
            currentCategories={currentCourse?.categories} 
            disabled={isPublished}
            add={(item: ICategoryRspModel) => editConfirm(handleAddCategory,item)} 
            handleDelete={(item: ICategoryRspModel) => editConfirm(handleDeleteCategory,item)} />
        </Form.Item>        
        <Form.Item label="章节"
          name="sections"
          rules={[{required: true, validator: sectionsValidator}]}
        >
          <Typography.Link underline={true} onClick={showSections}>
          {
            currentCourse?.sections && currentCourse?.sections.length > 0 ? `${currentCourse?.sections.length}个` : '设置' 
          }
          </Typography.Link>
        </Form.Item>
        <Form.Item label="关键字">
          <KeywordInput 
            currentKeywords={currentCourse?.keywords}
            disabled={isPublished}
            updateMethod={(keywords: any) => editConfirm(update,{keywords: keywords})} />
        </Form.Item>
        <Form.Item label="用户标签">
          <TagSelect 
            currentTags={currentCourse?.tags && currentCourse?.tags.filter(c=>c.tagType === "User")} 
            tagType={"User"}
            disabled={isPublished}
            handleAddTag={(item: ITagRspModel) => editConfirm(handleAddTag,item)} 
            handleDeleteTag={(item: ITagRspModel) => editConfirm(handleDeleteTag,item)} />
        </Form.Item>
        {
          currentCourse?.level === 2 && 
          <Form.Item 
            label="测试"
            name="paper"
            rules={[{required: true, validator: paperValidator}]}
          >
            <Space>
              {
                currentCourse?.paper && `每次出现${currentCourse?.paper.totalQuestionNumber}题， 答对${currentCourse?.paper.passedQuestionNumber}题通过测试`
              }            
              <Typography.Link underline={true} onClick={showPaper}>设置</Typography.Link>
            </Space>
          </Form.Item>
        }
        <Form.Item 
          label="反馈"
          name="feedBackLink"
          wrapperCol={{ span: 10 }}
          validateTrigger={["onBlur"]}
          rules={[{validator: feedbackValidator}]}
        >
          <Input readOnly={currentCourse?.isPublished} value={currentCourse?.feedBackLink} onChange={(val: any) => editConfirm(update,{feedBackLink: val.target.value})}></Input>
        </Form.Item>     
        <CourseUser currentCourse={currentCourse} showPublish={false} />
        <Form.Item wrapperCol={{offset: 4}}>
          <CourseFormFooter 
            currentCourse={currentCourse} 
            form={form}
            isPublished={isPublished}
            handlePreview={() => preview(currentCourse)}
            save={save}
            handleDelete={() => handleDelete(currentCourse)}  />
        </Form.Item>
      </Form>
    </>
  )
}
