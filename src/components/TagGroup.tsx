import { Col, Input, Row, Tag, Tooltip } from "antd";
import { ITagGroupRspModel, ITagRspModel } from "models";
import { FunctionComponent, useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { TagInput } from "./TagInput";

export const TagGroup : FunctionComponent<{currentTagGroup: ITagGroupRspModel | undefined, tagType: string, handleAdd: any, handleUpdate: any, handleGroupDelete : any, handleTagDelete: any }> 
= ({currentTagGroup, tagType, handleAdd, handleUpdate, handleGroupDelete, handleTagDelete}) => {

  const [currentTag, setCurrentTag] = useState<ITagRspModel>()

  const [isEditing, setIsEditing] = useState(false)

  const [inputWidth, setInputWidth] = useState<number>()

  const handleInputChange = (newValue: string) => {
    const tag : ITagRspModel = {
      name: newValue,
      description: newValue,
      tagType: tagType,
      displayInFilter: tagType === "User" ? false : true
    }

    handleAdd(currentTagGroup, tag)
  }

  const handleGroupDeleteConfirm = (e: React.MouseEvent, tagGroup: ITagGroupRspModel) => {
    e.preventDefault()
    ConfirmModal({
      title: "是否删除标签组", 
      confirm: ()=> handleGroupDelete(tagGroup)
    })
  }

  const handleTagDeleteConfirm = (e: React.MouseEvent, tag: ITagRspModel) => {
    e.preventDefault()
    ConfirmModal({
      title: "是否删除标签", 
      confirm: ()=> handleTagDelete(tag)
    })
  }

  const handleEditInputChange = (newValue: string) => {
    if(currentTag) {
      setCurrentTag({...currentTag, name: newValue})
      setIsEditing(true)
    }
  };

  const handleEditInputConfirm = () => {
    if(currentTag) {
      if(isEditing) {
        handleUpdate(currentTag)        
        setIsEditing(false)
      }

      setCurrentTag(undefined)
    }
  };

  return (
    <Row style={{margin: 20}}>
      <Col span={24}>
        {
          currentTagGroup?.name && currentTagGroup.name !== "用户" && 
          <Row style={{marginBottom: 20}}>
            <Col>
              <Tag
                closable={true}
                onClose={(e)=> handleGroupDeleteConfirm(e, currentTagGroup)}
              >
                {currentTagGroup?.name}
              </Tag>
            </Col>
          </Row>
        }      
        <Row>
          <Col offset={2} span={18}>
            {
              currentTagGroup?.tags.map((tag, index) => (
                <span key={index}>
                  {
                    currentTag?.id === tag.id ?
                    <Input
                      size="small"
                      style={{width: inputWidth}}
                      className="tag-input"
                      value={currentTag?.name}
                      autoFocus={true}
                      onChange={(e) => handleEditInputChange(e.target.value)}
                      onBlur={()=>handleEditInputConfirm()}
                      onPressEnter={()=>handleEditInputConfirm()}
                    /> :
                    <>
                      {
                        tag.name.length > 20 ?
                        <Tooltip title={tag.name}>
                          <Tag
                            style={{marginTop: 2}}
                            closable={true}
                            onDoubleClick={e => {
                              e.preventDefault()
                              setCurrentTag(tag)
                            }}
                            onClose={(e) => handleTagDeleteConfirm(e, tag)}
                          >
                            {`${tag.name.slice(0, 20)}...`}
                          </Tag>                      
                        </Tooltip> :
                        <Tag
                          style={{marginTop: 2}}
                          closable={true}
                          onDoubleClick={e => {
                            e.preventDefault()
                            setInputWidth(e.currentTarget.offsetWidth)
                            setCurrentTag(tag)
                          }}
                          onClose={(e) => handleTagDeleteConfirm(e, tag)}
                        >
                          {tag.name}
                        </Tag>
                      }
                    </>
                  }
                </span>                
              ))
            }
          </Col>
          <Col span={4} style={{marginTop: 2}}>
            <TagInput plusLabel="标签" change={handleInputChange} />
          </Col>
        </Row>
      </Col>          
    </Row>
  );
}
