import { Button, Col, Form, Input, Modal, Row } from "antd"
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
import { FunctionComponent, useEffect, useState } from "react";
import { IAssetRspModel, ISectionModel } from "models";
import { SectionService } from "services";
import { VideoSelectV2, KeywordInput, VideoForm } from "components";

export const SectionForm : FunctionComponent<{currentSection: ISectionModel | undefined, isEdit: boolean, validate: any, confirm: any, setIsEditing: any, isPublished?: boolean}> 
= ({currentSection, isEdit, validate, setIsEditing, confirm, isPublished}) => {
  const currentService = SectionService;

  const [sectionForm] = Form.useForm()

  const [videoModel, setVideoModel] = useState<IAssetRspModel>();

  const [sectionModel, setSectionModel] = useState<ISectionModel>();

  const [showVideoModal, setShowVideoModal] = useState(false)

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const section = sectionModel!;

  const setSection = (sectionProps: Partial<ISectionModel>) => {
    setSectionModel({ ...section, ...sectionProps });
    setIsEditing(true)
  }

  const handleOk = () => {
    sectionForm.validateFields().then(() =>{
      if(sectionModel) {
        confirm(sectionModel)
      }
    })
    .catch(() => {   
    })
  };

  const nameValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    const result = validate(value);
    if(result) {
      callback('章节名已存在!');
    }
    else{
      callback();
    }
  }

  const videoValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(!uploadInProgress) {
      if(sectionModel?.assetName) {
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

  const updateVideo = (videoModel : IAssetRspModel) => {
    setVideoModel(videoModel);
    if(videoModel.id !== '00000000-0000-0000-0000-000000000000') {      
      setSection({assetName: videoModel.contentPath});
      setShowVideoModal(true);
    }
  }

  const handleCancel = () => {
    setShowVideoModal(false) 
  };

  useEffect(() => {
    if(currentSection) {
      setSectionModel(currentSection)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  useEffect(() => {
    if(sectionModel) {
      sectionForm.setFieldsValue(sectionModel);
      if(sectionModel.assetName) {
        currentService.getVideo(sectionModel.assetName).then(rsp => {
          setVideoModel(rsp);
        })
      }
      else {
        setVideoModel(undefined);
      }
    }
  }, [currentService, sectionForm, sectionModel]);

  return (
    <>
      <Form 
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={sectionForm}
        layout="horizontal"
      >          
        <Form.Item 
          label="名称" 
          name="title"
          validateTrigger={['onBlur']}
          rules={[{required: true, whitespace: true, message: '请输入章节名称'}, { validator: nameValidator}]}
        >
          <Input disabled={isPublished} placeholder="请输入名称" value={sectionModel?.title} onChange ={(val: any) => setSection({ title: val.target.value})}/>
        </Form.Item>
        <Form.Item 
          label={'视频'}
          name="video"
          rules={[{required: true, validator: videoValidator}]}
        >
          <Row gutter={24}>
            <Col span={19}>
              <VideoSelectV2 
                currentVideo={videoModel} 
                disabled={isPublished || uploadInProgress} 
                setInProgress={(status: boolean) => {
                  setUploadInProgress(status)
                  sectionForm.validateFields(["video"])
                }}
                videoType="Video" 
                updateVideo={updateVideo} />
            </Col>
            <Col span={5}>
              <Button type="primary" onClick={()=> setShowVideoModal(true)}>查看</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="简介">
          <Input.TextArea disabled={isPublished} value={sectionModel?.description} onChange={(val: any) => setSection({ description: val.target.value})} rows={4}></Input.TextArea>
        </Form.Item>
        <Form.Item label="关键字">
          <KeywordInput currentKeywords={sectionModel?.keywords} disabled={isPublished} updateMethod={(keywords: any) => setSection({ keywords: keywords})} />
        </Form.Item>        
        <Form.Item hidden={isPublished} wrapperCol={{offset: 4}}>
          <Button type="primary" onClick={handleOk}>确认</Button>
        </Form.Item>
      </Form>
      <Modal 
        visible={showVideoModal}
        title="视频预览"
        centered={true}
        footer={null} 
        onCancel={handleCancel} 
        destroyOnClose={true}
      >
        <VideoForm 
          currentSection={sectionModel}
          setSection={setSection}
          disabled={true}
          save={handleCancel} />
      </Modal>
    </>
  )
}