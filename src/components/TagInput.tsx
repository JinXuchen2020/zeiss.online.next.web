import { Input, Tag } from 'antd';
import React, { FunctionComponent, useState } from 'react';
import { PlusOutlined } from "@ant-design/icons";

export const TagInput : FunctionComponent<{plusLabel: string, change: any}> = ({plusLabel, change}) => {
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (value: string) => {    
    if(value.length > 0) {
      change(value)
    }   
    
    setInputVisible(false);
  }

  return (
    <>
      {
        inputVisible ? 
        <Input
          type="text"
          size="small"
          autoFocus={true}
          style={{lineHeight: '12px'}}
          onPressEnter= {(e) =>{
            e.preventDefault();
            handleInputChange(e.currentTarget.value)
          }}
          onBlur={(e) => {
            e.preventDefault();
            handleInputChange(e.target.value)
          }}
        /> :
        <Tag onClick={showInput}>
          <PlusOutlined /> {plusLabel}
        </Tag>
      }    
    </>
  );
}
