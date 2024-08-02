import { Button, Col, Modal, Row, Space } from "antd"
import { FunctionComponent, useEffect, useState } from "react";
import { ICourseRspModel, ISectionModel, ISectionNodeModel, ITagRspModel } from "models";
import { ConfirmModal, SectionForm, SectionTable } from "components";

export const Sections : FunctionComponent<{currentCourse: ICourseRspModel | undefined, setCourse: any, isPublished?: boolean, handleDeleteItem?: any}> 
= ({currentCourse, setCourse, isPublished, handleDeleteItem}) => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [isSectionEditing, setIsSectionEditing] = useState(false)

  const [sectionModel, setSectionModel] = useState<ISectionModel>();

  const [sectionModels, setSectionModels] = useState<ISectionModel[]>();

  const handleManage = (section: ISectionModel | undefined) => {
    if(currentCourse) {
      setIsModalVisible(true);
      if(section === undefined) {
        const sequences = currentCourse.sections.map(c=>c.sequence);
        const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
        section = {
          courseId: currentCourse.id,
          title:'',
          description:'',
          duration:0,
          sequence:maxSequence + 1,
          contentLink:'',
          assetName: '',
          contentType: '视频',
          nodes: [] as ISectionNodeModel[],
          tags: [] as ITagRspModel[]
        };
        setSectionModel(section);
        setIsEdit(false);
      }
      else {
        setSectionModel(section);
        setIsEdit(true);
      }
    }
  }

  const handleCancel = () => {
    if(!isPublished && isSectionEditing) {
      ConfirmModal({
        title: "退出 章节内容将不会保存",
        confirm: () => {
          setIsModalVisible(false)
          setIsSectionEditing(false)
        }
      })
    }
    else {
      setIsModalVisible(false)
      setIsSectionEditing(false)
    } 
  };

  const handleDelete = (item: ISectionModel) => {
    let sections = sectionModels!;
    const index = sections.indexOf(item);
    sections.splice(index, 1);
    setCourse({sections: sections});
    handleDeleteItem(item)
  }

  const handleChangeSequence = (section: ISectionModel, isUp: boolean) => {
    let relatedSection: ISectionModel;
    if(isUp) {
      relatedSection = sectionModels?.filter(c=>c.sequence < section.sequence).slice().pop()!;
    }
    else {
      relatedSection = sectionModels?.find(c=>c.sequence > section.sequence)!;
    }

    const sequence = section.sequence;
    section.sequence = relatedSection.sequence;
    relatedSection.sequence = sequence;

    setCourse({sections: [...sectionModels!]});
  }

  const handleSaveSection = (sectionModel: ISectionModel) => {
    let sections = sectionModels!;
    if(isEdit) {
      const index = sections.findIndex(c=>c.sequence === sectionModel.sequence);
      if(index < 0) {
        sections.push(sectionModel);
      }
      else {
        sections[index] = sectionModel;
      }
    }
    else {
      sections.push(sectionModel);
    }

    setCourse({sections: [...sections]});
    setIsModalVisible(false)
    setIsSectionEditing(false)
  };

  const handleValidate = (value: string) =>{
    if(currentCourse?.sections) {
      let sections = currentCourse?.sections;
      const existSection = sections.find(c=>c.title === value);
      if(existSection) {
        if(existSection.sequence === sectionModel?.sequence) {
          return false
        }
        else {
          return true
        }
      }
      else {
        return false
      }
    }
    else {
      return false
    }
    
  }

  useEffect(() => {
    if(currentCourse?.sections) {
      let sections = currentCourse.sections;
      sections = sections.sort((a, b) => a.sequence - b.sequence);
      setSectionModels([...sections]);
    }
  }, [currentCourse?.sections]);

  return (
    <>
      <Row style={{marginBottom: 10}}>
        {
          !isPublished && 
          <Col span={23}>
            <Space style={{float: 'right'}}>
              <Button type="primary" onClick={() =>handleManage(undefined)} >新建</Button>
            </Space>
          </Col>
        }        
      </Row>
      <Row style={{marginBottom: 10}}>
        <Col offset={1} span={22}>
          <SectionTable 
            originSections={sectionModels}
            loading={false}
            isPublished={isPublished}
            updateMethod={handleManage} 
            deleteMethod={handleDelete} 
            changeSequence={handleChangeSequence} />
        </Col>
      </Row>      
      <Modal 
        visible={isModalVisible}
        title={isEdit ? "更新章节" : "创建章节"}
        centered={true}
        footer={null}
        maskClosable={false}
        onCancel={handleCancel} 
        destroyOnClose={true}
      >
        <SectionForm 
          currentSection={sectionModel} 
          isEdit={isEdit}
          setIsEditing={setIsSectionEditing}
          isPublished={isPublished}
          validate={handleValidate} 
          confirm={handleSaveSection}  />
      </Modal>
    </>
  )
}