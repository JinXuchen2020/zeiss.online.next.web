import { Button, Form, Input, InputRef, Row } from "antd";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CategoryType, ISectionModel, ISectionNodeModel } from "models";
import { SectionNodeTable, VideoTimePicker } from "components";
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
import moment from "moment";

export const VideoPlayer : FunctionComponent<{options: any, currentSection: ISectionModel, setSection: any, updateDuration: any, isPublished?: boolean, handleDeleteItem?: any}> 
= ({options, currentSection, setSection, updateDuration, isPublished, handleDeleteItem}) => 
{
  const videoRef = useRef(null);
  const playerRef = useRef<amp.Player>();
  const titleInputRef = useRef<InputRef>(null);
  const desInputRef = useRef<InputRef>(null);
  const categoryRootName = sessionStorage.getItem("CategoryName")
  const [form] = Form.useForm();

  const [sectionNodeModels, setSectionNodeModels] = useState<ISectionNodeModel[]>();
  const [startNumber, setStartNumber] = useState<number>();

  const [isReady, setIsReady] = useState(false)

  const changeTimeTrack = (startTime: number)=>{
    const player = playerRef.current;
    player?.currentTime(startTime);
    player?.play();
  }

  const nameValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(value && sectionNodeModels) {
      const record = sectionNodeModels.find(c=>c.title === value);
      if(record) {
        callback('节点名已存在!');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const startNumberValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(startNumber && sectionNodeModels) {
      const record = sectionNodeModels.find(c=>c.startNumber === startNumber);
      if(record) {
        callback('开始时间已存在!');
      }
      else {
        callback();
      }
    }
    else {
      callback('请选择开始时间!');
    }
  }

  const startNumberMaxValidator = (rule: RuleObject, value: StoreValue, callback: any) =>{
    if(startNumber && playerRef.current) {
      const record = playerRef.current.duration() === startNumber;
      if(record) {
        callback('开始时间必须小于视频时长');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const handleAdd = async ()=> {
    form.validateFields().then(() =>{
      const player = playerRef.current;
      if(player && currentSection && sectionNodeModels){
        player.pause();
        const currentStartNumber = startNumber!;
        let currentEndNumber = Math.ceil(player.duration());
        let currentSequence = 0;
        if (sectionNodeModels.length > 0) {
          const nextNode = sectionNodeModels.find(c=>c.startNumber > currentStartNumber);
          if(nextNode) {
            currentSequence = nextNode.sequence;
            currentEndNumber = nextNode.startNumber;
            sectionNodeModels.forEach((node, index) => {
              if(node.startNumber > currentStartNumber) {
                node.sequence += 1;
                sectionNodeModels[index] = node;
              }
            })
          }
          else {
            const sequences = sectionNodeModels.map(c=>c.sequence);
            const maxSequence = Math.max(...sequences);
            currentSequence = maxSequence + 1;
          }

          const previousNode = sectionNodeModels.filter(c=>c.startNumber < currentStartNumber).slice().pop();
          if(previousNode) {
            previousNode.endNumber = currentStartNumber;
            const index = sectionNodeModels.findIndex(c=>c.sequence === previousNode.sequence);
            sectionNodeModels[index] = previousNode;
          }
        }

        let newNode : ISectionNodeModel = {
          sequence: currentSequence,
          title: titleInputRef?.current?.input?.value ?? '',
          startNumber: currentStartNumber,
          endNumber: currentEndNumber,
          description: desInputRef.current?.input?.value ?? '',
        }

        setSection({nodes: [...sectionNodeModels, newNode]})
        form.setFieldsValue({title: undefined})
        form.setFieldsValue({startNumber: undefined})
        setStartNumber(undefined)
      }
    })
    .catch(() => {
    })    
  }

  const handleSave = (node: ISectionNodeModel) => {
    if(sectionNodeModels && currentSection) {
      const index = sectionNodeModels.findIndex(c=>c.sequence === node.sequence)
      if(index < 0) {
        setSection({nodes: [...sectionNodeModels, node]})
      }
      else {
        sectionNodeModels[index] = node;
        setSection({nodes: [...sectionNodeModels]})
      }
    }    
  }

  const handleDelete = (node: ISectionNodeModel) => {
    if(sectionNodeModels) {
      if(handleDeleteItem) {
        handleDeleteItem(node)
      }

      const previousIndex = sectionNodeModels.findIndex(c=>c.endNumber === node.startNumber);
      if(previousIndex >= 0) {
        sectionNodeModels[previousIndex].endNumber = node.endNumber;
      }

      const index = sectionNodeModels.indexOf(node);
      sectionNodeModels.splice(index, 1);
      setSection({nodes: [...sectionNodeModels]});
    }    
  }

  useEffect(() => {
    //make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      var playerOptions = {
        autoplay: true,
        controls: true,
        fluid: true,
        height: 300
      };

      playerRef.current = amp(videoElement, playerOptions);
    }

    const player = playerRef.current;
    if(player) {
      player.addEventListener(amp.eventName.play, () => {
        const newDuration = player.duration()!
        updateDuration(newDuration);
        setIsReady(true)
      })

      player.addEventListener(amp.eventName.seeked, () => {
        const value = Math.ceil(player.currentTime());
        setStartNumber(value)
        const newValue = moment.unix(value).utc()
        form.setFieldsValue({startNumber: newValue})
      })
    }
    if(options && options.src){
      player.src({src: options.src, type: options.type, protectionInfo: [{type: "AES", authenticationToken: options.token}]});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.src, videoRef]);

  useEffect(() => {
    if(currentSection.nodes) {
      let nodes = currentSection.nodes;
      nodes = nodes.sort((a, b) => a.startNumber - b.startNumber);
      setSectionNodeModels([...nodes]);
    }
  }, [currentSection.nodes]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.removeEventListener(amp.eventName.play);
        player.removeEventListener(amp.eventName.seeked);
        player.dispose();
        playerRef.current = undefined;
      }
    };
  }, [playerRef]);

  return (
    <>
      <div className="section-video">
        <video id='video' style={{width:'100%'}} ref={videoRef} className="azuremediaplayer amp-default-skin amp-big-play-centered"></video>
      </div>
      {
         categoryRootName === CategoryType[0] ? 
         <>
          <SectionNodeTable 
            originSectionNodes={sectionNodeModels} 
            loading ={false} 
            handleSave={(record: any) => handleSave(record)} 
            handlePlay={(record: any) => changeTimeTrack(record.startNumber)} 
            handleDelete={(record: any) => handleDelete(record)}
            isPublished={isPublished} />
          {
            !isPublished && 
            <Row style={{marginTop: 10}}>
              <Form form={form} layout="inline" onFinish={()=> handleAdd()}>
                <Form.Item 
                  name={"title"} 
                  rules={[{required: true, whitespace: true, message: '请输入节点名'}, {validator: nameValidator}]}
                >
                  <Input size="small" autoComplete="off" ref={titleInputRef} placeholder="节点名" />
                </Form.Item>
                <Form.Item 
                  style={{width: 134}}
                  name={"startNumber"} 
                  rules={[{validator: startNumberValidator}, {validator: startNumberMaxValidator}]}
                >
                  <VideoTimePicker 
                    disabled={!isReady}
                    endTimeNumber = {playerRef.current && playerRef.current.duration()}
                    setStartNumber={setStartNumber} 
                    initialValues={ startNumber ? moment.unix(startNumber).utc() : undefined }
                    format={playerRef.current && playerRef.current.duration() >= 60 * 60 ? 'HH:mm:ss' : 'mm:ss'}
                  />
                </Form.Item>
                <Form.Item>
                  <Button size="small" type={'primary'} onClick={handleAdd}>添加</Button>
                </Form.Item>
              </Form>
            </Row>
          }          
         </> :
         undefined
      }     
    </>    
  );
}
