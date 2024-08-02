import { Button, Col, Row, Space } from "antd"
import { FunctionComponent, useEffect, useState } from "react";
import { ISectionModel } from "models";
import { SectionService } from "services";
import { VideoPlayer } from "components";

export const VideoForm : FunctionComponent<{currentSection: ISectionModel | undefined, save: any, setSection: any, disabled?: boolean, handleDeleteItem?: any}> 
= ({currentSection, save, setSection, disabled, handleDeleteItem}) => {
  const currentService = SectionService;

  const [videoJsOptions, setVideoJsOptions] = useState<{src: string, type: string, token?: string}>();

  const [duration, setDuration] = useState<number>();

  const handleOk = () => {
    save();
  };

  const videoElement = () =>{
    let element = (<div className="preview-result">视频预览</div>);
    if(currentSection) {
      if(currentSection.assetName || currentSection.contentLink) {
        element = (<VideoPlayer
          options={videoJsOptions} 
          currentSection={currentSection}
          setSection={setSection}
          updateDuration={(duration: number) => {
            setDuration(duration);
            if(currentSection.nodes && currentSection.nodes.length > 0) {
              const nodes = currentSection.nodes;
              if(nodes[0].endNumber === 0) {
                nodes[0].endNumber = duration;
                setSection({nodes: nodes})
              }
            }
          }}
          isPublished={disabled}
          handleDeleteItem={handleDeleteItem}/>)
      }
    }

    return element;
  }

  useEffect(() => {
    if (duration && currentSection?.duration !== duration) {
      setSection({duration: duration})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  useEffect(() => {
    if (videoJsOptions && currentSection) {
      if (videoJsOptions.src && currentSection.contentLink !== videoJsOptions.src) {
        setSection({contentLink: videoJsOptions.src})
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoJsOptions?.src]);

  useEffect(() => {
    if(currentSection) {
      if(currentSection.contentType === 'PDF') {            
        const contentLink = currentSection.contentLink;
      }
      else {
        if(currentSection.assetName){
          currentService.getEncryptedVideo(currentSection.assetName).then(rsp=>{
            if(rsp){
              const videoOptions = {
                src: rsp.contentPath, 
                type: 'application/vnd.ms-sstr+xml', 
                token: rsp.token
              }
              setVideoJsOptions(videoOptions);
            }
          })
        }
        else if (currentSection.contentLink) {
          const videoOptions = {
            src: currentSection.contentLink, 
            type: 'video/mp4',
          }
          setVideoJsOptions(videoOptions);
        }
        else {
          setVideoJsOptions(undefined);
        }
      }
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection?.id, currentSection?.assetName, currentService]);

  return (
    <>
      <Row>
        <Col span={24}>
          { currentSection?.contentType === 'Pdf' 
              ? <div className="preview-result">PDF预览</div>
              : videoElement() }
        </Col>
      </Row>
      {
        !disabled && 
        <Row style={{marginTop: 20}}>
          <Col span={24} style={{textAlign: 'left'}}>
            <Space>                          
              <Button type="primary" onClick={handleOk}>确认</Button>
            </Space>
          </Col>
        </Row>
      }
    </>
  )
}