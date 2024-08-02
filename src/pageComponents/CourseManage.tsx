import React, { useState, useEffect } from 'react';
import { CategoryType, ICategoryRspModel, ICourseCategoryReqModel, ICourseProgressRspModel, ICourseQuestionReqModel, ICourseReqModel, ICourseRspModel, ICourseTagReqModel, IPaperReqModel, IPaperRspModel, IQuestionGroupReqModel, IQuestionGroupRspModel, IQuestionOptionReqModel, IQuestionOptionRspModel, IQuestionReqModel, IQuestionRspModel, ISectionModel, ISectionNodeModel, ISectionReqModel, ISectionTagReqModel, isOfType, ITagRspModel, ITokenRspModel, IWeChatMessageModel, USER_PROFILE} from 'models';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Modal, Row, Space } from 'antd';
import { ConfirmModal, CourseProgressTable, CourseReview, Loading, OperationCourseForm, PublicCourseForm, VideoForm } from 'components';
import { CourseService, PaperService, SectionNodeService, SectionService, WeComService } from 'services';
import { Sections,  Paper} from 'pageComponents'
import { LeftOutlined} from '@ant-design/icons';

export type Flag = "Base" | "Section" | "Paper" | "Progress";
export const CourseManage: React.FunctionComponent = () => {
  const { courseId } = useParams();
  const location = useLocation()

  const agentId = process.env.REACT_APP_WE_CHAT_AGENT_ID;

  const navigate = useNavigate();

  const currentService = CourseService;

  const [courseModel, setCourseModel] = useState<ICourseRspModel>();

  const [paperModel, setPaperModel] = useState<IPaperRspModel>();

  const [sectionModel, setSectionModel] = useState<ISectionModel>();

  const [courseProgress, setCourseProgress] = useState<ICourseProgressRspModel[]>();

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showNodeModal, setShowNodeModal] = useState(false);

  const [previewCourse, setPreviewCourse] = useState<ICourseRspModel>();

  const [pageFlag, setPageFlag] = useState<Flag>("Base");

  const [isLoading, setIsLoading] = useState(false);

  const [loadingTip, setLoadingTip] = useState<string>()

  const [isPublished, setIsPublished] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [isPaperEditing, setIsPaperEditing] = useState(false)

  const [isSectionEditing, setIsSectionEditing] = useState(false)

  const [deleteSectionNodes, setDeleteSectionNodes] = useState<ISectionNodeModel[]>([])

  const [deleteOptions, setDeleteOptions] = useState<IQuestionOptionRspModel[]>([])

  const [deleteSections, setDeleteSections] = useState<ISectionModel[]>([])

  const [deleteTags, setDeleteTags] = useState<ITagRspModel[]>([]);

  const [deleteCategories, setDeleteCategories] = useState<ICategoryRspModel[]>([]);

  const [deleteQuestionGroups, setDeleteQuestionGroups] = useState<IQuestionGroupRspModel[]>([])

  const [deleteQuestions, setDeleteQuestions] = useState<IQuestionRspModel[]>([])

  const [isCopy, setIsCopy] = useState(false)

  let course = courseModel!

  const originStatus = courseModel ? courseModel.isPublished : undefined

  const setCourse = (courseProps: Partial<ICourseRspModel>) => {
    if(isPublished || courseModel?.isPublished) {
      const userTokenString = sessionStorage.getItem(USER_PROFILE);
      const userToken = JSON.parse(userTokenString!) as ITokenRspModel
      if(userToken.user.managementModules.findIndex(c=>c.key === "publishCourses") === -1) {
        ConfirmModal({
          title: "该课程已发布, 没有权限直接更新此课程！",
        })
      }
      else {
        ConfirmModal({
          title: "该课程已发布, 请先下线此课程！",
          confirm: () => {  
            !isPublished && navigate(`/publishCourses/${courseModel?.id!}`)
          }
        })
      }      
    }
    else {
      setCourseModel({ ...course, ...courseProps });
      if(!isEditing){
        setIsEditing(true)
      }
    }
  }

  const paper = paperModel!;

  const setPaper = (paperProps: Partial<IPaperRspModel>) => {
    setPaperModel({ ...paper, ...paperProps });
    setIsPaperEditing(true)
  }

  const section = sectionModel!;

  const setSection = (sectionProps: Partial<ISectionModel>) => {
    setSectionModel({ ...section, ...sectionProps });
    setIsSectionEditing(true)
  }

  const confirmSave = (courseModel : ICourseRspModel) => {
    if(courseModel.id) {
      CourseService.validateCourseById(courseModel.id).then(result => {
        if(result) {
          handleSave(courseModel)
        }
        else {
          ConfirmModal({
            title: "这门课程已建立首页链接, 请先到首页更新配置！", 
            confirm: () => {
              const userTokenString = sessionStorage.getItem(USER_PROFILE);
              const userToken = JSON.parse(userTokenString!) as ITokenRspModel
              if(userToken.user.managementModules.findIndex(c=>c.key === "homeConfig") >= 0) {
                navigate("/homeConfig")
              }
            }
          })
        }
      })
    }
    else {
      handleSave(courseModel)
    }
  }

  const clearDeleteCache =() => {
    setDeleteSectionNodes([])
    setDeleteOptions([])
    setDeleteSections([])
    setDeleteTags([])
    setDeleteCategories([])
    setDeleteQuestionGroups([])
    setDeleteQuestions([])
  }

  const sendMessage = () => {    
    if(courseModel && originStatus !== courseModel.isPublished) {
      let messageContent = originStatus === null ? "已提交，可以发布了" : originStatus ? "已下线" : "已发布"
      ConfirmModal({
        title: "是否发送消息给发布管理员？", 
        confirm: () => {
          const message : IWeChatMessageModel = {
            msgtype: "text",
            agentid: parseInt(agentId!),
            text: {
              content: `课程<a href='${window.location.protocol}//${window.location.host}/admin/publishCourses/${courseModel.id}'>${courseModel.name}</a> ${messageContent}`
            }
          }
  
          WeComService.sendMessage(message).then(rsp=> {
            if(rsp.errorCode === "0") {
              ConfirmModal({
                title: "消息发送成功",
              })
            }
            else {
              ConfirmModal({
                title: "消息发送失败",
              })
              console.log(rsp.errorMsg)
            }
          })
        }
      })
    }    
  }

  const handleSave = (courseModel : ICourseRspModel) => {
    setLoadingTip("保存中...")
    setIsLoading(true)
    if(courseModel.id) {
      let promiseList : Promise<unknown>[] = []
      deleteCategories?.forEach(c=> {
        promiseList.push(currentService.deleteCourseCategory(courseModel.id!, c.id!))
      })
      courseModel.categories?.forEach(c=> {
        promiseList.push(currentService.addCourseCategory(courseModel.id!, c.id!))
      })

      deleteTags?.forEach(c=> {
        promiseList.push(currentService.deleteCourseTag(courseModel.id!, c.id!))
      })

      courseModel.tags.forEach(c=> {
        promiseList.push(currentService.addCourseTag(courseModel.id!, c.id!))
      })

      if(courseModel.categoryRootName === CategoryType[0]) {
        deleteSectionNodes.forEach(c=> {
          promiseList.push(SectionNodeService.deleteSectionNode(c.id!))
        })
        courseModel.sections[0].nodes.forEach(c=> {
          if(c.id) {
            promiseList.push(SectionNodeService.updateSectionNode(c.id, c))
          }
          else {
            promiseList.push(SectionNodeService.addSectionNode(courseModel.sections[0].id!, c))
          }
        })

        const input : ISectionReqModel = {
          ...courseModel.sections[0],
          nodes: []
        }

        promiseList.push(SectionService.updateSection(courseModel.sections[0].id!, input))
      }
      else {
        deleteSections.forEach(c=> {
          promiseList.push(SectionService.deleteSection(c.id!))
        })

        courseModel.sections.forEach(c=> {
          const input : ISectionReqModel = {
            ...c,
          }

          if(c.id) {
            promiseList.push(SectionService.updateSection(c.id, input))
          }
          else {
            promiseList.push(SectionService.addSection(courseModel.id!, input))
          }
        })

      }

      if(courseModel.paper) {
        const paperInput: IPaperReqModel = {
          ...courseModel.paper,
          courseId: courseModel.id,
          imageLibraryId: courseModel.coverImage?.id,
        }
  
        if(courseModel.paper.id) {
          deleteQuestionGroups.forEach(item => {
            promiseList.push(PaperService.deleteQuestionGroup(item.id!))
          })

          deleteQuestions.forEach(item => {
            promiseList.push(PaperService.deleteQuestion(item.id!))
          })
          
          deleteOptions.forEach(item => {
            promiseList.push(PaperService.deleteQuestionOption(item.id!))
          })

          courseModel.paper.questionGroups.forEach(group => {
            if(group.id) {
              group.questions.forEach(question => {
                if(question.id){
                  question.questionOptions.forEach(c=> {
                    const input : IQuestionOptionReqModel = {
                      ...c
                    }
                    if(c.id) {
                      promiseList.push(PaperService.updateQuestionOption(c.id, input))
                    }
                    else {
                      promiseList.push(PaperService.createQuestionOption(question.id!, input))
                    }
                  })

                  const input : IQuestionReqModel = {
                    ...question,
                    questionOptions: []
                  }

                  promiseList.push(PaperService.updateQuestion(question.id!, input))

                }
                else {
                  const input : IQuestionReqModel = {
                    ...question,
                    questionOptions: question.questionOptions.map(option => {
                      return {
                        ...option,
                      } as IQuestionOptionReqModel
                    })
                  }
                  promiseList.push(PaperService.createQuestion(group.id!, input))
                }
              })

              const input : IQuestionGroupReqModel = {
                ...group,
                questions: []
              }

              promiseList.push(PaperService.updateQuestionGroup(group.id!, input))
            }
            else {
              const input : IQuestionGroupReqModel = {
                ...group,
                questions: group.questions.map(question=>{
                  const questionInput : IQuestionReqModel = {
                    stem: question.stem,
                    type: question.type,
                    level: question.level,
                    questionGroupId: group.id,
                    questionOptions: question.questionOptions.map(option => {
                      return {
                        ...option,
                      } as IQuestionOptionReqModel
                    })
                  }
                  return questionInput
                })
              }
              promiseList.push(PaperService.createQuestionGroup(courseModel?.paper?.id!, input))
            }
          })

          paperInput.questionGroups = []
          promiseList.push(currentService.putCoursePaper(courseModel.paper.id, paperInput))
        }
        else {
          promiseList.push(currentService.postCoursePaper(courseModel.id, paperInput))
        }
      }
      
      const courseInput : ICourseReqModel = {
        ...courseModel, 
        sections: [],
        courseTags: [], 
        coverImageId: courseModel.coverImage?.id,
        paper: undefined,
        courseCategories: []
      };
      
      promiseList.push(currentService.putCourse(courseModel.id!, courseInput))

      Promise.all(promiseList).then(() => {
        setIsLoading(false)
        if(courseModel.isPublished !== undefined) {
          isPublished ? navigate("/publishCourses") : navigate("/courses")
          sendMessage()
        }
        else {
          setIsEditing(false)
          loadingCourse(courseId)
          clearDeleteCache()
        }
      });
    }
    else {
      const courseInput : ICourseReqModel = {
        ...courseModel, 
        // eslint-disable-next-line no-eval
        duration: eval(course.sections.map(c=>c.duration).join("+")) as number,
        sections: courseModel.sections.map(section => {
          let sectionInput : ISectionReqModel = {
            ...section,
            sectionTags: section.tags.map(c => {return { sectionId: section.id, tagId: c.id } as ISectionTagReqModel; })
          }
          return sectionInput;
        }),
        courseTags: courseModel.tags.map(c => {return { tagId: c.id } as ICourseTagReqModel; }),
        coverImageId: courseModel.coverImage?.id,
        courseCategories: courseModel.categories?.map(c => {return { courseCategoryId: c.id } as ICourseCategoryReqModel; }),
        courseQuestions: courseModel.questions?.map(c => { return { courseId: courseModel.id, questionId: c.id } as ICourseQuestionReqModel; }),
        paper:  courseModel.paper && {
          ...courseModel.paper,
          imageLibraryId: courseModel.coverImage?.id,
          questionGroups: courseModel.paper.questionGroups.map(questionGroup=> 
            {
              return {...questionGroup, questions: questionGroup.questions.map(question=>{
                const questionInput : IQuestionReqModel = {
                  stem: question.stem,
                  type: question.type,
                  level: question.level,
                  questionGroupId: questionGroup.id,
                  questionOptions: question.questionOptions.map(option => {
                    return {
                      ...option,
                    } as IQuestionOptionReqModel
                  })
                }
                return questionInput                
              }) } as IQuestionGroupReqModel
            }),
          },
      };
      
      currentService.postCourse(courseInput).then(() =>{
        if(isCopy) {
          currentService.copyCourseCompleteSections(courseId!, courseInput.name).then(() => {
            setIsLoading(false)
            if(courseModel.isPublished !== undefined) {
              navigate("/courses");
            }
            else {
              setIsEditing(false)
              clearDeleteCache()
            }
          })
        }
        else { 
          setIsLoading(false)
          if(courseModel.isPublished !== undefined) {
            navigate("/courses");
          }
          else {
            setIsEditing(false)
            clearDeleteCache()
          }
        }
      });
    }
  }

  const handlePreview = (courseModel : ICourseRspModel) => {
    setShowReviewModal(true);
    setPreviewCourse(courseModel);
  }    

  const handleDelete = (course: ICourseRspModel)=> 
  {    
    setLoadingTip("删除课程...")
    setIsLoading(true)
    currentService.deleteCourse(course.id!).then(() => {
      setIsLoading(false)
      navigate('/courses');
    })
  }

  const handleSectionSave = () => {
    if(sectionModel && courseModel) {
      let sections = courseModel.sections;
      const index = sections.findIndex(c=>c.title === sectionModel.title);
      if(index < 0) {
        sections.push(sectionModel);
      }
      else {
        sections[index] = sectionModel;
      }

      setCourse({sections: sections});
      setShowNodeModal(false)
      setIsSectionEditing(false)
    }
  }

  const handleSectionCancel = () => {
    if(!isPublished && isSectionEditing) {
      ConfirmModal({
        title: "退出 节点内容将不会保存",
        confirm: () => {
          setShowNodeModal(false)
          setIsSectionEditing(false)
        }
      })
    }
    else {
      setShowNodeModal(false)
      setIsSectionEditing(false)
    }
  }

  const handlePaperSave = () => {
    setCourse({paper: paperModel})
    setPageFlag("Base");
    setIsPaperEditing(false)
  }

  const handleDeleteItem = (item : any) => {
    if(isOfType<ITagRspModel>(item,  "tagType")) {
      if(item.id && deleteTags.findIndex(c=>c.id === item.id) < 0) {
        deleteTags.push(item)
      }
    }
    else if(isOfType<ISectionNodeModel>(item,  "startNumber")) {
      if(item.id && deleteSectionNodes.findIndex(c=>c.id === item.id) < 0) {
        deleteSectionNodes.push(item)
      }
    }
    else if(isOfType<ICategoryRspModel>(item, "parent_Id")) {
      if(item.id && deleteCategories.findIndex(c=>c.id === item.id) < 0) {
        deleteCategories.push(item)
      }
    }
    else if(isOfType<ISectionModel>(item,  "contentType")) {
      if(item.id && deleteSections.findIndex(c=>c.id === item.id) < 0) {
        deleteSections.push(item)
      }
    }
    else if(isOfType<IQuestionOptionRspModel>(item, "questionId")) {
      if(item.id && deleteOptions.findIndex(c=>c.id === item.id) < 0) {
        deleteOptions.push(item)
      }
    }
    else if(isOfType<IQuestionGroupRspModel>(item, "paperId")) {
      if(item.id && deleteQuestionGroups.findIndex(c=>c.id === item.id) < 0) {
        deleteQuestionGroups.push(item)
      }
    }
    else if(isOfType<IQuestionRspModel>(item, "questionGroupId")) {
      if(item.id && deleteQuestions.findIndex(c=>c.id === item.id) < 0) {
        deleteQuestions.push(item)
      }
    }
  }

  const handleBack = () => {
    if(pageFlag === "Base") {
      if(isEditing) {
        currentService.validateCourse(courseModel?.name!).then(rsp=>{
          if((typeof rsp === "string" && rsp === courseModel?.id) || (courseModel?.name && typeof rsp === "object")) {
            ConfirmModal({
              title: "是否保存课程为草稿", 
              confirm: () => {
                courseModel!.isPublished = undefined
                confirmSave(courseModel!)
                isPublished ? navigate("/publishCourses") : navigate("/courses")
              },
              cancel: () => {
                isPublished ? navigate("/publishCourses") : navigate("/courses")
              }
            })
          }
          else {
            ConfirmModal({
              title: "课程数据有错误无法保存，退出页面数据将丢失", 
              confirm: () => {
                isPublished ? navigate("/publishCourses") : navigate("/courses")
              }
            })
          }
        })        
      }
      else {
        isPublished ? navigate("/publishCourses") : navigate("/courses")
      }      
    }    
    else if(pageFlag === "Paper") {
      if(isPaperEditing) {
        ConfirmModal({
          title: "是否保存测试", 
          confirm: () => {
            handlePaperSave()
          },
          cancel: () => {
            setPageFlag("Base")
            setIsPaperEditing(false)
          }
        })
      }
      else {
        setPageFlag("Base")
        setIsPaperEditing(false)
      }
      
    }
    else {
      setPageFlag("Base");
    }
  }

  const backBtnLabel = () => {
    if(pageFlag === "Paper") {
      return "测试"
    }
    else if (pageFlag === "Progress") {
      return `${courseModel?.name}课程学习进度`
    }
    else {
      const categoryRootName = sessionStorage.getItem("CategoryName")
      return `${courseModel?.id ? "更新" : "新建"}${categoryRootName}${pageFlag === "Base" ? "课程" : "章节"}`
    }
  }

  const copyConfirm =() => {
    ConfirmModal({
      title: "是否复制此课程", 
      confirm: () => handleCopy(),
      content: `${courseModel?.name}`
    })
  }

  const handleCopy = () => {
    if(courseModel) {
      const newCourse : ICourseRspModel = {
        ...courseModel,
        name: courseModel.name + "-复制",
        isPublished: undefined,
        id: undefined,
        sections: courseModel.sections.map(section => {
          const newSection : ISectionModel = {
            ...section,
            id: undefined,
            courseId: undefined,
            nodes: section.nodes.map(node => {
              const newNode : ISectionNodeModel = {
                ...node,
                id: undefined,
                sectionId: undefined
              }

              return newNode
            })
          }

          return newSection
        }),
        paper: courseModel.paper && {
          ...courseModel.paper,
          id: undefined,
          courseId: undefined,
          questionGroups: courseModel.paper.questionGroups.map(group => {
            const newGroup : IQuestionGroupRspModel = {
              ...group,
              paperId: undefined,
              id: undefined,
              questions: group.questions.map(question => {
                const newQuestion : IQuestionRspModel = {
                  ...question,
                  id: undefined,
                  questionGroupId: undefined,
                  questionOptions: question.questionOptions.map(option=>{
                    const newOption : IQuestionOptionRspModel = {
                      ...option,
                      id: undefined,
                      questionId: undefined
                    }

                    return newOption
                  })
                }
                
                return newQuestion
              })
            }

            return newGroup
          })
        }
      }

      setCourseModel(newCourse)
      setIsCopy(true)
      setIsEditing(true)
    }    
  }

  const showCourseCopy = () => {
    let result = pageFlag === 'Base'
    result = result && courseModel?.id !== undefined && !isPublished && !isCopy
    return result
  }

  const showCourseProgress = () => {
    setPageFlag("Progress");
    loadingCourseProgress();
  }

  const showPaper = () => {
    setPageFlag("Paper");
    if(courseModel){
      if(courseModel.paper) {        
        const paper = JSON.parse(JSON.stringify(courseModel.paper))
        setPaperModel(paper)        
      }
      else {
        const paper = {
          title:'',
          description:'',
          totalQuestionNumber: 0,
          passedQuestionNumber: 0,
          questionGroups:[],
        } as IPaperRspModel;
  
        setPaperModel(paper)
        setIsPaperEditing(true)
      }
    }
  }

  const showNodes = () => {
    if(courseModel){
      const section = courseModel.sections[0]
      setSectionModel(section)      
      setShowNodeModal(true)
    }
  }

  const loadingCourseProgress = () => {
    if(courseModel?.id) {
      setIsLoading(true)
      setLoadingTip("加载课程进度...")
      currentService.getCourseProgress(courseModel.id).then((rsp) => {
        if(rsp && rsp instanceof Array) {
          setCourseProgress(rsp)
        }

        setIsLoading(false)
      })
    }
  }

  const loadingCourse = (courseId: string | undefined) => {
    if(courseId) {
      setLoadingTip("加载中...")
      setIsLoading(true)
      currentService.getCourse(courseId).then(rsp => {
        if(rsp && isOfType<ICourseRspModel>(rsp, "categoryRootName")){
          setCourseModel(rsp)
          const categoryRootName = sessionStorage.getItem("CategoryName")
          if(!categoryRootName) {
            sessionStorage.setItem("CategoryName", rsp.categoryRootName!);
          }
        }
        
        setIsLoading(false)
      });
    }
  }

  useEffect(() => {
    setIsPublished(location.pathname.includes("publish")) 
  }, [location.pathname]);

  useEffect(() => {
    setShowNodeModal(false)
    setPageFlag("Base")
    if(courseId) {
      loadingCourse(courseId)
    }
    else {
      const categoryRootName = sessionStorage.getItem("CategoryName")!;
      let currentCourse : ICourseRspModel = {
        name: "",
        fullName: "",
        description:"",
        duration: 0,
        points: 0,
        sequence: 0,
        level: categoryRootName === CategoryType[0] ? 0 : 1,
        tags:[],
        isHot: false,
        isPublished: false,
        categoryRootName: categoryRootName,
        sections: []
      }
      
      if (categoryRootName === CategoryType[0]) {
        const section = {
          courseId: currentCourse.id,
          title:'默认章节',
          description:'',
          duration:0,
          sequence: 0,
          contentLink:'',
          assetName: '',
          contentType: '视频',
          nodes: [] as ISectionNodeModel[],
          tags: [] as ITagRspModel[]
        };
  
        currentCourse.sections.push(section)
      }
      setCourseModel(currentCourse);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isPublished, currentService]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row gutter={24}>
        <Col span={6}>
          <Button type="text" icon ={<LeftOutlined />} onClick={handleBack}>{backBtnLabel()}</Button>
        </Col>
        <Col span={16} style={{marginTop: 5}} >
          <Space style={{float: 'right'}}>
            <Button size='small' hidden={!showCourseCopy() || (courseModel ? courseModel.categoryRootName === CategoryType[0] : false)} type="primary" onClick={copyConfirm}>{'复制升级课程'}</Button>
            <Button size='small' hidden={!showCourseCopy()} type="primary" onClick={showCourseProgress}>{'进度查询'}</Button>
          </Space>
        </Col>
      </Row>
      <Row style={{marginTop: 10}} gutter={24}>
        <Col span={24}>
          {
            pageFlag === "Section" ?
              <Sections 
                currentCourse={courseModel} 
                setCourse={setCourse} 
                isPublished={isPublished || (courseModel ? courseModel.isPublished : false) }
                handleDeleteItem={handleDeleteItem} /> :
            pageFlag === "Progress" ?
              <Row>
                <Col span={24}>
                  <Row style={{marginTop: 10}}>
                    <Col offset={1} span={22}>                      
                      <CourseProgressTable currentCourseProgress={courseProgress} />
                    </Col>
                  </Row>
                </Col>
              </Row> :
            pageFlag === "Paper" ?
              <Paper 
                currentPaper = {paperModel} 
                update={setPaper}
                save={handlePaperSave}
                isPublished={isPublished || courseModel?.isPublished} 
                handleDeleteItem={handleDeleteItem}/> :
            courseModel?.categoryRootName === CategoryType[0] ?
              <PublicCourseForm 
                currentCourse={courseModel}
                update={setCourse}
                save={confirmSave}
                preview={handlePreview}
                showNodes={showNodes} 
                handleDelete={handleDelete}
                isPublished = {isPublished}
                handleDeleteItem = {handleDeleteItem} /> :
              <OperationCourseForm 
                currentCourse={courseModel}
                update={setCourse}
                save={confirmSave} 
                preview={handlePreview} 
                showSections={() => setPageFlag("Section")} 
                showPaper={showPaper}
                handleDelete={handleDelete}
                isPublished = {isPublished}
                handleDeleteItem = {handleDeleteItem}/>
          }
        </Col>        
      </Row>      
      <Modal 
        title="课程预览" 
        visible={showReviewModal}
        centered={true}
        destroyOnClose={true} 
        footer={(<Button onClick={()=>setShowReviewModal(false)} type="primary">返回</Button>)} 
        onCancel={()=>setShowReviewModal(false)}
      >
        <CourseReview currentCourse={previewCourse} />
      </Modal>
      {
        courseModel?.categoryRootName === CategoryType[0] && 
        <Modal 
          title="段落编辑" 
          visible={showNodeModal}
          centered={true}
          footer={null} 
          maskClosable={false}
          onCancel={handleSectionCancel}
          destroyOnClose={true}
        >
          <VideoForm 
            currentSection={sectionModel}
            setSection={setSection}
            save={handleSectionSave}
            disabled={isPublished || courseModel.isPublished}
            handleDeleteItem = {handleDeleteItem} />
        </Modal>
      }  
    </>
  )
}
