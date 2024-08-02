import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { CategoryType, ICourseRspModel } from 'models';
import { SectionService } from 'services';
import { VideoStatus } from 'models/Enums';
import { Affix, Button, List, Modal, Space, Spin, Typography } from 'antd';
import { HeartFilled, ShareAltOutlined, HeartOutlined, DownloadOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import '../styles/azureLessons.scss';
import moment from 'moment';

export interface CourseHistoryModel{
  courseId?: string;
  sectionId?: string;
  sectionNodeId?: string;
  watchedTime: number;
  isCompleted: boolean;
}

let timer : any = null;
export const CourseReview : FunctionComponent<{currentCourse: ICourseRspModel | undefined }> = ({currentCourse}) => {
  const [collected, setCollect] = useState<boolean>(false);

  const isOperationGuide = currentCourse?.categoryRootName === CategoryType[1];
  const [currentSection, setCurrentSection] = useState<string | undefined>(undefined);

  const [options, setOptions] = useState<{src: string, type: string, protectionInfo: {type: string, authenticationToken: string}[]}>();
  const [videoStatus, setVideoStatus] = useState<VideoStatus>(VideoStatus.init);
  const [videoRecord, setVideoRecord] = useState<Map<string, boolean>>(new Map());
  const [shareCodeVisible, setShareCodeVisible] = useState<boolean>(false);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isResponsive: boolean = true;
  const [isBroken, setIsBroken] = useState<boolean>(false);

  const collectLessonHandle = async() => {
     
  }

  const shareLessonHandle = async() => {
  }

  // 云课堂视频跳转
  const handleChapterChange = async(id: string, startNumber: number) => {
    if(currentSection === id){
      if(videoStatus !== VideoStatus.pause){
        playerRef.current?.pause();
      }
      else
      {
        playerRef.current?.play();
      }
    }
    else{
      const player = playerRef.current;
      player?.currentTime(startNumber);
      player?.play();
      setCurrentSection(id);
      let currentNode = currentCourse?.sections[0].nodes.find(node => node.id === id);
      currentCourse?.sections[0].nodes.filter(node => node.sequence < (currentNode?.sequence ?? 0))?.forEach(item => {
        videoRecord.set(item.id!, true);
      })
      setVideoRecord(videoRecord);
    }
  }
  
  const handleSectionChange = (id: string) => {
    if(currentSection === id){
      if(videoStatus === VideoStatus.play){
        playerRef.current?.pause();
      }else{
        playerRef.current?.play();
      }
    }
    else
    {
      setCurrentSection(id);
    }
  }

  const handleStartExam = () => {
      // let falseValue = Array.from(videoRecord.values()).filter(item => item === false);
      // if(falseValue.length > 0){
      //     message.destroy();
      //     message.info('看完所有视频可以开始考试');
      // }else{
      //     navigate(`exam`);
      // }
  }

  const getFormatTime = (time: number) => {
    return `${moment.unix(time).utc().format('HH:mm:ss')}`
  }

  useEffect(() => {
    if(currentCourse) {
      let videoRecordMap = new Map();
      if(!isOperationGuide){
        handleVideoToken(currentCourse?.sections[0]?.id!);
        setCurrentSection(currentCourse.sections[0].nodes[0]?.id!)
        currentCourse?.sections[0].nodes.forEach((item) => {
          videoRecordMap.set(item.id!, false);
        })
      }
      else{
        if(currentCourse.sections.length > 0) {
          setCurrentSection(currentCourse.sections[0].id!);
        }

        currentCourse.sections.forEach((item) => {
          videoRecordMap.set(item.id, false);
        })
      }

      setVideoRecord(videoRecordMap);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourse]);

  useEffect(() => {
    if(currentSection) {
      if(isOperationGuide){
        handleVideoToken(currentSection);
      }
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  const handleVideoToken = (id: string) => {
    const section = currentCourse?.sections.find(c=>c.id === id)!
    SectionService.getEncryptedVideo(section.assetName).then(rsp=>{
      if(rsp){
        const videoOptions = {
          src: rsp.contentPath, 
          type: 'application/vnd.ms-sstr+xml', 
          protectionInfo: [{type: "AES", authenticationToken: rsp.token}]
        }
        setOptions(videoOptions);
      }
    })
  }

  const videoRef = useRef(null);
  const playerRef = useRef<amp.Player>();

  useEffect(() => {
    //make sure Video.js player is only initialized once
    if(options){
      if (!playerRef.current) {
        const videoElement = videoRef.current;
        if (!videoElement) return;
    
        var playerOptions = {
            autoplay: true,
            controls: true,
            height: 300,
            logo: {enabled: false}
        };
    
        playerRef.current = amp(videoElement, playerOptions)
      }
    }

    const player = playerRef.current;
    if(player){
      player.addEventListener('ended', () => {
        setVideoStatus(VideoStatus.ended);
        if(isOperationGuide){
          videoRecord.set(currentSection!, true);
          setVideoRecord(videoRecord);
          // 跳转至下一章节
          let currentVideoSequence = currentCourse?.sections.find(item => item.id === currentSection)?.sequence ?? 0;
          let nextSection = currentCourse?.sections.find(item => item.sequence === currentVideoSequence + 1);
          if(nextSection){
            setCurrentSection(nextSection.id!);
            handleVideoToken(nextSection.id!);
          }
        }else{
          videoRecord.set(currentSection!, true);
          setVideoRecord(videoRecord);
        }
      });

      player.addEventListener('pause', () => {
        setVideoStatus(VideoStatus.pause);
      });

      player.addEventListener('play', () => {
        setVideoStatus(VideoStatus.play);
        if(currentSection && !isOperationGuide && currentSection !== currentCourse?.sections[0].nodes[0].id){
          player.currentTime(currentCourse?.sections[0].nodes.find(item => item.id === currentSection)?.startNumber ?? 0);
        }
      });

        // 云课堂视频，拖动进度条后，当前时间节点之前的视频节点都为已完成状态
      player.addEventListener('seeked', () => {
        setVideoStatus(VideoStatus.seeked);
        player.play();
        if(!isOperationGuide){
          let currentTime = Math.floor(player.currentTime() ?? 0);
          let currentNode = currentCourse?.sections[0].nodes.find(node => currentTime > node.startNumber && currentTime < node.endNumber);
          currentCourse?.sections[0].nodes.filter(node => node.sequence < (currentNode?.sequence ?? 0))?.forEach(item => {
            videoRecord.set(item.id!, true);
          })
          setVideoRecord(videoRecord);
        }
      });
    }
    if(options){
      player?.src(options);
    }
    
    return () => {
      player?.pause();
      if(videoStatus){
          setVideoStatus(VideoStatus.disposing);
      }
      player?.removeEventListener('ended');
      player?.removeEventListener('pause');
      player?.removeEventListener('play');
      player?.removeEventListener('seeked');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, videoRef]);

  // 定时器
  useEffect(() => {
    if(!isOperationGuide && videoStatus === VideoStatus.play){
      timer = setInterval(() => {
        let currentTime = Math.floor(playerRef.current?.currentTime() ?? 0);
        let currentNode = currentCourse?.sections[0].nodes.find(node => currentTime > node.startNumber && currentTime < node.endNumber)?.id;
        if(currentSection && currentNode && currentNode !== currentSection){
          videoRecord.set(currentSection!, true);
          setVideoRecord(videoRecord);
          setCurrentSection(currentNode);
        }
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStatus, currentSection])

  return (
    <>
    {
      loading ? <div className='nodata'><Spin/></div> :
      <>
        <Typography.Title className='itemTop' level={4}>{currentCourse?.name}</Typography.Title>
        <Affix offsetTop={55}>
          <div className="section-video">
            <video id='zeiss-video' style={{width:'100%',height:isResponsive ? '200px' : '300px'}} ref={videoRef} className="azuremediaplayer amp-default-skin amp-big-play-centered"></video>
          </div>
        </Affix>
        <div className='detail'>
          <div className='detail-header'>
            <div className='detail-title'></div>
            <div className='detail-share'>
                {currentCourse?.feedBackLink && <a target='_blank' rel="noreferrer noopener" href={currentCourse?.feedBackLink}><Button style={{border: 'none'}} icon={<img src={process.env.PUBLIC_URL + '/assets/images/feedback.png'} className='icon'/>}>反馈</Button></a>}
                <Button style={{border: 'none'}} icon={collected ? <HeartFilled style={{color: '#008CD0'}}/> : <HeartOutlined/>} onClick={collectLessonHandle}>收藏</Button>
                <Button style={{border: 'none' }} icon={<img style={{marginTop:-2}} src={process.env.PUBLIC_URL + '/assets/images/share.png'} className='icon'/>}>网页打开</Button>
                {!isOperationGuide && <a target='_blank' rel="noreferrer noopener" href='https://app.jingsocial.com/microFrontend/contentCenterH5/center/LNDyn2nwMoQdacMSrVz2EF?appid=wx0fcf5f767046543b&formSurvey=true&tabid=EysMGgfRsyDSSpg7tdxN8H&openid=oXC1AxDlYjnrkEa2dN4RTKXXN_Mc'><Button style={{border: 'none'}} icon={<DownloadOutlined/>}>下载资料</Button></a>}
            </div>
          </div>
          <div className='detail-description'>{currentCourse?.description}</div>
        {isOperationGuide ? (<>
            {currentCourse?.level === 2 && <div className='examDiv'><Button type='primary' size='small' onClick={handleStartExam} className='examBtn'>测试</Button></div>}
            <List
              itemLayout="horizontal"
              dataSource={currentCourse?.sections.sort((a,b) => a.sequence - b.sequence)}
              renderItem={item => (
              <List.Item
                key={item.id!}
                onClick={() => {handleSectionChange(item.id!)}}
                >
                <List.Item.Meta
                  avatar={currentSection === item.id && videoStatus === VideoStatus.play ? <div style={{display: 'grid', color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F'}}><PauseCircleOutlined /><span>{getFormatTime(item.duration)}</span></div> : <div style={{display: 'grid', color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F'}}><PlayCircleOutlined /><span>{getFormatTime(item.duration)}</span></div>}
                  title={<Space style={{color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id!) ? 600 : 400}}>{item.title}</Space>}
                  description={<Space style={{color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id!) ? 600 : 400}}>{item.description}</Space>}
                />
              </List.Item>
            )}/>
            </>
        ) : 
        (
            <List
              itemLayout="horizontal"
              className='alesson'
              dataSource={currentCourse?.sections[0].nodes.sort((a,b) => a.sequence - b.sequence)}
              renderItem={item => (
              <List.Item
                key={item.id}
                onClick={() => {handleChapterChange(item.id!, item.startNumber)}}
              >
                <List.Item.Meta
                  avatar={currentSection === item.id && (videoStatus === VideoStatus.play || videoStatus === VideoStatus.seeked) ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  title={<Space style={{color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id!) ? 600 : 400}}>{item.title}</Space>}
                  description={<Space style={{color: videoRecord.get(item.id!) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id!) ? 600 : 400}}>{getFormatTime(item.startNumber)} - {getFormatTime(item.endNumber)}</Space>}
                />
              </List.Item>
            )}/>
        )}
        <Modal
          width={176}
          title='课程分享'
          visible={shareCodeVisible}
          closable={false}
          footer={[<Button type='default' size='small' onClick={() => {setShareCodeVisible(false)}}>取消</Button>]}
        >
            {/* <QRCode value={window.location.href} /> */}
        </Modal>
        </div>
      </>
    }
    </>
  )
}
