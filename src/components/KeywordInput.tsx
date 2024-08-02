import { Col, Row, Tag, Tooltip } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { TagInput } from './TagInput';

export const KeywordInput : FunctionComponent<{currentKeywords: string | undefined, updateMethod: any, disabled?: boolean}> = ({currentKeywords, updateMethod, disabled}) => {

  const [keywords, setKeywords] = useState<string[]>();

  const handleClose = (e: React.MouseEvent, removedKeyword: string) => {
    e.preventDefault();

    if(keywords) {
      const index = keywords.indexOf(removedKeyword);
      keywords.splice(index, 1)

      updateMethod(keywords.join(","));
    }
  };

  const handleInputChange = (newValue: string) => {
    const newValues = newValue.split(/(,|，)/).filter(c=>c !== ",").filter(c=>c !== "，");
    if(keywords) {
      const newKeywords = [...keywords, ...newValues]
      updateMethod(newKeywords.join(","))
    }
    else {
      updateMethod(newValues.join(","))
    }
  }

  useEffect(() => {
    if(currentKeywords) {              
      setKeywords(currentKeywords.split(","))
    }
  },[currentKeywords])

  const tagElements = () => {
    if(keywords) {
      return (
        keywords.map((keyword, index) => {
          const isLongTag = keyword.length > 20;
  
          const tagElem = (
            <Tag
              key = {index}
              style={{marginTop: 2}}
              closable={!disabled}
              onClose={(e) => handleClose(e, keyword)}
            >
              {isLongTag ? `${keyword.slice(0, 20)}...` : keyword}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={keyword} key={index}>
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
        <Col>
          {
            tagElements()
          }
        </Col>
      </Row>
      {
        !disabled && 
        <Row>
          <Col style={{marginTop: 2}}>
            <TagInput plusLabel="关键字" change={handleInputChange} />
          </Col>
        </Row>
      }
      <Row hidden={disabled} style={{marginTop: 5, fontSize:12}}>
        <Col className='ant-form-item-explain-error'>
          *多个关键字以逗号分隔
        </Col>
      </Row>
    </>
  );
}
