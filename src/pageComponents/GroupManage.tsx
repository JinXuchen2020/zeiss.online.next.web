import { Button, Col, Form, Row } from 'antd';
import { ConfirmModal, CourseSelectTable, GroupManagerForm, GroupStatusTable, Loading } from 'components';
import { ICourseRspModel, IGroupManagerCourseReqModel, IGroupManagerReqModel, IGroupManagerStatusRspModel, IGroupStatusRspModel, isOfType, IUserRspModel } from 'models';
import { GroupSelectCourse, Users } from 'pageComponents';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GroupService, UserService } from 'services';
import { LeftOutlined} from '@ant-design/icons';

export type Flag = "Base" | "SelectUser" | "SelectCourse" | "GroupStatus" | "SwitchManager" | "CourseStatus";
export const GroupManage : FunctionComponent = () => {
  let { managerId } = useParams();
  const [, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [form] = Form.useForm()

  const [groupManagerModel, setGroupManagerModel] = useState<IGroupManagerStatusRspModel>();

  const [currentGroupCourses, setCurrentGroupCourses] = useState<ICourseRspModel[]>();

  const [deleteCourses, setDeleteCourses] = useState<ICourseRspModel[]>([]);

  const [pageFlag, setPageFlag] = useState<Flag>("Base");  

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  const [isEditing, setIsEditing] = useState(false)

  let groupManager = groupManagerModel!

  const setGroupManager = (groupManagerProps: Partial<IGroupManagerStatusRspModel>) => {
    setGroupManagerModel({ ...groupManager, ...groupManagerProps });
    setIsEditing(true)
  }

  const handleBack = () => {
    if(pageFlag === "Base") {
      if(isEditing) {
        ConfirmModal({
          title: "是否保存组长", 
          confirm: () => {
            handleSave()
          },
          cancel: () => {
            navigate("/groups")
          }
        })
      }
      else {
        navigate("/groups")
      }      
    }    
    else if (pageFlag === "SelectUser") {
      navigate("/groups")
    }
    else if (pageFlag === "CourseStatus") {
      setPageFlag("GroupStatus");
    }
    else {
      setSearchParams("")
      setPageFlag("Base");
    }
  }

  const backBtnLabel = () => {
    if(pageFlag === "SelectUser") {
      return "选择组长"
    }

    if(pageFlag === "Base") {
      return "编辑组长"
    }

    if(pageFlag === "SelectCourse") {
      return "选择课程"
    }

    if(pageFlag === "SwitchManager") {
      return "权限转移"
    }

    if(pageFlag === "CourseStatus") {
      return `${groupManagerModel?.manager.user.name}的学习小组课程详情`
    }

    if(pageFlag === "GroupStatus") {
      return `${groupManagerModel?.manager.user.name}的学习小组情况`
    }
  }

  const showCourseSelect = () => {
    setPageFlag("SelectCourse")
  }

  const showGroupStatus = () => {
    setPageFlag("GroupStatus")
  }

  const showSwitchManager = () => {
    setPageFlag("SwitchManager")
  }

  const showCourseStatus = (group: IGroupStatusRspModel) => {
    GroupService.getGroupCourses(group.id).then((rsp) => {
      setCurrentGroupCourses(rsp)
    })
    setPageFlag("CourseStatus")
  }

  const handleSave = () => {
    form.validateFields().then(() =>{
      if(groupManagerModel) {
        const input : IGroupManagerReqModel= {
          ...groupManagerModel.manager,
          userId: groupManagerModel.manager.user.id,
          courses: []
        }

        setIsLoading(true)
        setLoadingTip("保存组长...")  
        if(groupManagerModel.manager.id) {
          let promiseList : Promise<unknown>[] = []

          deleteCourses.forEach(c=> {
            promiseList.push(GroupService.deleteGroupManagerCourse(groupManagerModel.manager.id!, c.id!))
          })

          groupManagerModel.manager.courses.forEach(c=> {
            const input : IGroupManagerCourseReqModel = {
              userId: groupManagerModel.manager.user.id,
              courseId: c.id!
            }
      
            promiseList.push(GroupService.addGroupManagerCourse(groupManagerModel.manager.id!, input))
          })

          promiseList.push(GroupService.updateGroupManager(groupManagerModel.manager.id, input))

          Promise.all(promiseList).then(()=> {
            setIsLoading(false)
            navigate("/groups")
          })
        }
        else {
          input.courses = groupManagerModel.manager.courses.map(c=> {return {courseId: c.id!, userId: groupManagerModel.manager.user.id} as IGroupManagerCourseReqModel})
          GroupService.addGroupManager(input).then(()=> {
            setIsLoading(false)
            navigate("/groups")
          })
        }
      }
    })
    .catch(() => {
    })    
  }

  const handleDelete = () => {    
    ConfirmModal({
      title: "删除组长会删除该组长创建的所有小组，请确认是否删除？",
      confirm: () => {
        if(groupManagerModel) {
          if(groupManagerModel.manager.id) {
            GroupService.deleteGroupManager(groupManagerModel.manager.id).then(()=> {          
              navigate("/groups")
            })
          }
          else {
            navigate("/groups")
          }
        }
      }
    }) 
  }

  const handleSelectUser = (user: IUserRspModel) => {
    const groupManager: IGroupManagerStatusRspModel = {
      manager: {
        comment: "",
        user: user,
        courses:[]
      },
      groups: []
    }

    setGroupManagerModel(groupManager)
    setIsEditing(true)
    setPageFlag("Base")
  }

  const handleSwitchManager = (user: IUserRspModel) => {
    if(groupManagerModel) {
      ConfirmModal({
        title: `是否把 ${groupManagerModel?.manager.user.name} 的组长权限转移给 ${user.name}`, 
        confirm: () => {
          setGroupManager({manager: {...groupManagerModel.manager, user: user}})
          setPageFlag("Base")
        }
      })
    }
  }

  const handleSelectCourse = (course: ICourseRspModel) => {
    setGroupManager({manager: {...groupManagerModel!.manager, courses: [...groupManagerModel!.manager.courses, course]}})
  }

  const handleUnSelectCourse = (course: ICourseRspModel, callback?: any) => {
    if (groupManagerModel?.manager.id) {
      GroupService.validateCourse(groupManagerModel?.manager.id, course.id!).then(rsp => {
        if(rsp && rsp.length > 0) {
          ConfirmModal({
            title: `课程 ${course.name} 已添加到 ${rsp[0].name} 小组，请通知组长 ${groupManagerModel?.manager.user.name} 从小组中移除该课程`, 
          })
        }
        else {
          handleDeleteItem(course)
          const courses = groupManagerModel?.manager.courses!;
          const index = courses.findIndex(c=>c.id === course.id)
          courses.splice(index, 1)
          setGroupManager({manager: {...groupManagerModel!.manager, courses: [...courses]}})
          if(callback) {
            callback()
          }
        }
      })
    }
    else {
      handleDeleteItem(course)
      const courses = groupManagerModel?.manager.courses!;
      const index = courses.findIndex(c=>c.id === course.id)
      courses.splice(index, 1)
      setGroupManager({manager: {...groupManagerModel!.manager, courses: [...courses]}})
      if(callback) {
        callback()
      }
    }    
  }

  const handleDeleteItem = (item : any) => {
    if(isOfType<ICourseRspModel>(item,  "level")) {
      if(item.id && deleteCourses.findIndex(c=>c.id === item.id) < 0) {
        setDeleteCourses([...deleteCourses, item])
      }
    }
  }

  useEffect(()=>{
    if(managerId) {
      UserService.setErrorHandler()
      setIsLoading(true)
      setLoadingTip("加载组长详情...")
      GroupService.getGroupManager(managerId).then(rsp=> {
        if(rsp && rsp.manager) {
          setGroupManagerModel(rsp)
        }

        setIsLoading(false)
      })
    }
    else {
      setPageFlag("SelectUser")
    }
  }, [managerId])

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Button type="text" icon ={<LeftOutlined />} onClick={handleBack}>{backBtnLabel()}</Button>
      {
        pageFlag === "SelectCourse" ?
          <GroupSelectCourse 
            currentSelectedCourses={groupManagerModel?.manager.courses} 
            handleSelect={handleSelectCourse}
            handleUnSelect={handleUnSelectCourse}
            confirm={() => {
              setSearchParams("")
              setPageFlag("Base")
            }} /> :
        pageFlag === "SelectUser" ?
          <Users handleSelect={handleSelectUser} /> :
        pageFlag === "SwitchManager" ?
          <Users handleSelect={handleSwitchManager} /> :
        pageFlag === "CourseStatus" ?
          <Row>
            <Col span={24}>
              <Row style={{marginTop: 10}}>
                <Col offset={1} span={22}>
                  <CourseSelectTable
                    currentCourses={currentGroupCourses}
                    loading={false}
                    handleSelect={undefined} />
                </Col>
              </Row>
            </Col>
          </Row> :
        pageFlag === "GroupStatus" ?
          <Row>
            <Col span={24}>
              <Row style={{marginTop: 10}}>
                <Col offset={1} span={22}>
                  <GroupStatusTable
                    currentGroups={groupManagerModel?.groups} 
                    loading={false}
                    handleSelect={showCourseStatus} />
                </Col>
              </Row>
            </Col>
          </Row> :
        <GroupManagerForm 
          form={form}
          currentGroupManager={groupManagerModel} 
          update={setGroupManager} 
          showCourseSelect={showCourseSelect} 
          showGroupStatus={showGroupStatus}
          showSwitchManager={showSwitchManager}
          handleSave={handleSave} 
          handleDelete={handleDelete}
          handleDeleteItem={handleUnSelectCourse} />
      }
    </>
  );
}
