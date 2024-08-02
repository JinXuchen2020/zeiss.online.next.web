import { Form, Input, Typography } from "antd"
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
import React, { FunctionComponent, useEffect, useState } from "react";
import { IAssetRspModel, ICourseRspModel, ITagRspModel } from "models";
import { CourseService, SectionService } from "services";
import { ConfirmModal, CourseFormFooter, TagSelect, CourseUser, ImageSelectV2, KeywordInput, VideoSelectV2 } from "components";
import { useNavigate } from "react-router";

export const PublicCourseForm : FunctionComponent<{currentCourse: ICourseRspModel | undefined, update: any, save: any, preview: any, handleDelete: any, showNodes: any, isPublished?: boolean, handleDeleteItem? : any}> 
= ({currentCourse, update, save, preview, handleDelete, showNodes, isPublished, handleDeleteItem}) => {
  const currentService = CourseService;
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const [videoModel, setVideoModel] = useState<IAssetRspModel>();

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

  const videoValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(!uploadInProgress) {
      const section = currentCourse?.sections[0]!;
      if(section.assetName) {
        callback();
      }
      else {
        callback('请上传视频!');
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

  const updateVideo = (videoModel : IAssetRspModel) => {
    setVideoModel(videoModel);
    if(videoModel.id !== '00000000-0000-0000-0000-000000000000') {
      const section = currentCourse?.sections[0]!;
      section.assetName = videoModel.contentPath;
      setUploadInProgress(false)
      const newNode = {
        title:'默认节点',
        description:'默认节点',
        sequence: 0,
        startNumber:0,
        endNumber: 0,
      };
      if(section.nodes.length > 0) {
        section.nodes.forEach(node => handleDeleteItem(node))
        section.nodes = [];
        section.nodes.push(newNode)
      }
      else {
        section.nodes.push(newNode)
      }

      update({sections: [section]});
      showNodes();
    }
  }
  
  useEffect(() => {
    if(currentCourse) {
      form.setFieldsValue(currentCourse);
      if(currentCourse.sections[0].assetName) {
        SectionService.getVideo(currentCourse.sections[0].assetName).then(rsp => {
          setVideoModel(rsp);
        })
      }
      else {
        setVideoModel(undefined);
      }
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
          <Input.TextArea style={{width: '99.5%'}} readOnly={currentCourse?.isPublished} disabled={isPublished} rows={4} value={currentCourse?.description} onChange={(val: any) => editConfirm(update, { description: val.target.value})}></Input.TextArea>
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
            updateMethod={(asset: IAssetRspModel) => editConfirm(update,{ coverImage: asset })}
            setInProgress={(status: boolean) => {
              setUploadInProgress(status)
              form.validateFields(["coverImage"])
            }}
            imageSize={"16*9"} />
        </Form.Item>
        <Form.Item label='视频'
          name="video"
          rules={[{required: true, validator: videoValidator}]}
        >
          <VideoSelectV2 
            currentVideo={videoModel} 
            videoType="Video" 
            disabled={isPublished || uploadInProgress}
            updateVideo={(video: IAssetRspModel) => editConfirm(updateVideo,video)}
            setInProgress={(status: boolean) => {
              setUploadInProgress(status)
              form.validateFields(["video"])
            }} />
        </Form.Item>
        <Form.Item label="课程标签">
          <TagSelect 
            currentTags={currentCourse?.tags && currentCourse?.tags.filter(c=>c.tagType === "Course")} 
            tagType={"Course"} 
            disabled={isPublished}
            handleAddTag={(tag: ITagRspModel)=> editConfirm(handleAddTag,tag)} 
            handleDeleteTag={(tag: ITagRspModel)=> editConfirm(handleDeleteTag,tag)}/>
        </Form.Item>
        <Form.Item label="关键字">
          <KeywordInput 
            currentKeywords={currentCourse?.keywords} 
            disabled={isPublished}
            updateMethod={(keywords: any) => editConfirm(update, {keywords: keywords})} />
        </Form.Item>
        <Form.Item label="用户标签">
          <TagSelect 
            currentTags={currentCourse?.tags && currentCourse?.tags.filter(c=>c.tagType === "User")} 
            tagType={"User"}
            disabled={isPublished}
            handleAddTag={(tag: ITagRspModel)=> editConfirm(handleAddTag,tag)} 
            handleDeleteTag={(tag: ITagRspModel)=> editConfirm(handleDeleteTag,tag)} />
        </Form.Item>
        <Form.Item label="段落">
          <Typography.Link underline={true} onClick={showNodes} disabled={videoModel === undefined}>
            {
              currentCourse?.sections[0].nodes && currentCourse?.sections[0].nodes.length > 0 ? currentCourse?.sections[0].nodes.length : '设置' 
            }
          </Typography.Link>
        </Form.Item>
        <CourseUser 
          currentCourse={currentCourse} 
          showPublish={false} />
        <Form.Item wrapperCol={{offset: 4}}>
          <CourseFormFooter 
            currentCourse={currentCourse} 
            form={form}
            handlePreview={() => preview(currentCourse)}
            save={save}
            handleDelete={() => handleDelete(currentCourse)}
            isPublished={isPublished}  />
        </Form.Item>
      </Form>
    </>
  )
}