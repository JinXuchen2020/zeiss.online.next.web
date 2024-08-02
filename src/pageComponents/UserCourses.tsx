import React, { useState, useEffect } from 'react';
import { CategoryType, ICourseRspModel, IGroupRspModel, IUserHistoryRspModel } from 'models';
import { useNavigate, useParams  } from "react-router-dom";
import { Button, Space, Collapse, List, Progress, Typography } from 'antd';
import { UserService } from 'services';

export const UserCourses: React.FunctionComponent = () => {
  let { userId } = useParams();

  const currentService = UserService;
  
  let navigate = useNavigate();

  const [userGroups, setUserGroups] = useState<IGroupRspModel[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [userHistories, setUserHistories] = useState<IUserHistoryRspModel[]>();

  const groupCourseItem = (course: ICourseRspModel) =>{
    if(userHistories) {
      let totalWatchTime = 0;
      let totalTime = 0;
      if(course.categoryRootName === CategoryType[1]) {
        const courseSectionIds = course.sections.map(c=>c.id!);
        // eslint-disable-next-line no-eval
        totalTime = eval(course.sections.map(c=>c.duration).join("+")) as number
        for(let index = 0; index < courseSectionIds.length; index++){
          let userSection = userHistories.find(c => c.sectionId === courseSectionIds[index]);
          let courseSection = course.sections[index];
          if(userSection) {
            if(userSection.isCompleted) {
              totalWatchTime += courseSection.duration;
            }
            else {
              totalWatchTime += userSection.watchedTime;
            }          
          }
          else {
            totalWatchTime += 0;
          }
        }
      }
      else {
        const sectionNodeIds = course.sections[0].nodes.map(c=>c.id!);
        totalTime = course.sections[0].duration;
        for(let index = 0; index < sectionNodeIds.length; index++){
          let userHistory = userHistories.find(c => c.sectionNodeId === sectionNodeIds[index]);
          let sectionNode = course.sections[0].nodes[index];
          let nextSectionNode = index < sectionNodeIds.length - 1 ? course.sections[0].nodes[index + 1] : undefined;
          if(userHistory) {
            if(userHistory.isCompleted) {
              totalWatchTime += nextSectionNode ? nextSectionNode.startNumber - sectionNode.startNumber : course.sections[0].duration - sectionNode.startNumber;
            }
            else {
              totalWatchTime += userHistory.watchedTime;
            }          
          }
          else {
            totalWatchTime += 0;
          }
        }
      }      

      const percent = totalTime === 0 ? 0 : Math.floor((totalWatchTime / totalTime) * 10000) / 100;
      return (
        <> 
          <div style={{ width: '35%'}}>
            <Typography.Text ellipsis={{tooltip: course.name}} >{course.name}</Typography.Text>
          </div>
          <div style={{ width: '50%'}}>              
            <Progress  size={'small'} percent={percent} />
          </div>
          <Space>
            { 
              percent === 0 ? <Typography.Text>未开始</Typography.Text> : 
                percent === 100 ?  <Typography.Text>已完成</Typography.Text> :
                <Typography.Text>未完成</Typography.Text>
            }
            <Typography.Text>未通过</Typography.Text>
          </Space>
        </>
      )
    }    
  }

  useEffect(() => {
    if (userId){
      setIsLoading(true);
      currentService.getUserGroups(userId).then(rsp => {
        if(rsp){
          setUserGroups(rsp.map(c=>c.memberGroup))
          setIsLoading(false);
        }
      });

      currentService.getUserHistories(userId).then(rsp => {
        if(rsp && rsp.length > 0){
          setUserHistories(rsp)
        }
        else {
          setUserHistories([])
        }
      });
    }
  }, [userId, currentService]);

  return (
    <>
      <Space style={{float: 'left'}}>
        <Typography.Title level={3}>课程状态</Typography.Title>
      </Space>
      <Space style={{float: 'right'}}>
        <Button type="default" onClick={()=> {navigate('/users')}}>返回</Button>
      </Space>
      <Collapse style={{marginTop: 50}} defaultActiveKey={1}>
        {
          userGroups && userGroups.map((group, index) => {
            return (<Collapse.Panel header={group.name} key={index + 1}>
              <List
                dataSource={group.courses}
                loading={isLoading}
                renderItem={item => (
                  <List.Item 
                    key={item.id}
                  >
                    {groupCourseItem(item)}
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          )})
        }
      </Collapse>      
    </>        
  )
}
