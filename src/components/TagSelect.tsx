import { Col, Row, Select, Tag, Tooltip } from 'antd';
import { ITagGroupRspModel, ITagQueryOption, ITagRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { PlusOutlined } from "@ant-design/icons";
import { TagService } from 'services';

export const TagSelect : FunctionComponent<{currentTags: ITagRspModel[] | undefined, tagType: string, handleDeleteTag: any, handleAddTag: any, disabled?: boolean}> 
= ({currentTags, tagType, handleDeleteTag, handleAddTag, disabled}) => {
  const currentService = TagService;
  const [groupTags, setGroupTags] = useState<ITagGroupRspModel[]>();
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  useEffect(() => {
    const query : ITagQueryOption = {}
    if(tagType === "User") {
      query.name = "用户"
    }

    let isUnmount = false;
    currentService.getTagGroups(query).then(rsp => {
      if(rsp && rsp.data && !isUnmount) {
        let result = rsp.data
        if(tagType !== "User") {
          result = result.filter(c=>c.name !== "用户");
        }

        setGroupTags(result);
      }
    })

    return () => {
      isUnmount = true
    }
  }, [currentService, tagType]);

  const handleClose = (e: React.MouseEvent, removedTag: ITagRspModel) => {
    e.preventDefault();
    handleDeleteTag(removedTag);     
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleTagChange = (value: string) => {
    if(groupTags) {
      const group = groupTags.find(c=>c.tags.find(c=>c.id === value));
      if(group) {
        const tag = group?.tags.find(c=>c.id === value);
        handleAddTag(tag);
        setInputVisible(false);
      }
    }    
  }

  const tagElements = () => {
    if(currentTags) {
      return (
        currentTags.map((tag, index) => {
          const isLongTag = tag.name.length > 20;
  
          const tagElem = (
            <Tag
              key = {index}
              closable={!disabled}
              style={{marginTop: 2}}
              onClose={(e) => handleClose(e, tag)}
            >
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag.name} key={index}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })
      )
    }    
  }

  return (
    <>
      <Row>
        <Col span={24}>
          {
            tagElements()
          }
        </Col>
      </Row>
      <Row>        
        <Col id='tagArea' span={8} style={{marginTop: 2}}>
          {
            inputVisible ? 
            <Select 
              autoFocus={true} 
              onChange={handleTagChange}
              getPopupContainer={() => document.getElementById("tagArea")!}
              onBlur={() => setInputVisible(false)}>
              {
                groupTags && groupTags.map((groupTag) => (
                  <Select.OptGroup key={groupTag.id} label={groupTag.name}>
                    { groupTag.tags && groupTag.tags.map((tag) => (
                      <Select.Option disabled={currentTags?.find(c=>c.id === tag.id) !== undefined} key={tag.id} value={tag.id!}>{tag.name}</Select.Option>
                    ))}
                  </Select.OptGroup>
                ))
              }
            </Select>:
            <Tag hidden={disabled} onClick={showInput}>
              <PlusOutlined /> 标签
            </Tag>
          }
        </Col>
      </Row>
    </>
  );
}
