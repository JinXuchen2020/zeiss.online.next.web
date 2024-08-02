import React, { FunctionComponent } from 'react';
import { Button, message, Image, Upload, Row, Col, Input } from "antd";
import { IAssetRspModel } from 'models';
import { RcFile } from 'antd/lib/upload';
import { AssetService } from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

export const ImageSelectV2 : FunctionComponent<{currentImage: IAssetRspModel | undefined, imageType: string, updateMethod: any, setInProgress?: any, disabled?: boolean, imageSize?: string }> 
= ({currentImage, imageType, updateMethod, disabled, imageSize, setInProgress})=> {
  const currentService = AssetService;

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleUpload =  async (options: RcCustomRequestOptions)=> 
  {
    const { file } = options;
    let fileData = new FormData();
    fileData.append("type", imageType);
    fileData.append("files", file);

    if(setInProgress) {      
      setInProgress(true)
    }
    currentService.postImage(fileData).then(rsp => {
      if(rsp && rsp.length > 0){
        updateMethod(rsp[0])
        if(setInProgress) {
          setInProgress(false)
        }
      }
    })
  }

  return (
    <>
      <Row>
        <Col span={17}>
          <Input value={currentImage?.name} readOnly={true} />
        </Col>
        <Col offset={1} span={6}>
          <Upload
            name="file"
            disabled={disabled}
            accept='image/png,image/jpeg'
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            <Button>{currentImage?.contentPath === undefined ? "上传图片" : "重新上传"}</Button>
          </Upload>
        </Col>
      </Row>
      <Row style={{marginTop: 5, fontSize:12}}>
        <Col className='ant-form-item-explain-error'>
          {`*支持jpg,png格式，尺寸为${imageSize}`}
        </Col>
      </Row>
      <Row style={{marginTop: 5}}>
        <Col>
          {currentImage && <Image src={currentImage.contentPath} alt="avatar" style={{ height: 100 }} />}
        </Col>
      </Row>
    </>
  );
}
