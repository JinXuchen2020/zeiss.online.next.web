import { Select, Tag, Tooltip } from 'antd';
import { ICategoryRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { PlusOutlined } from "@ant-design/icons";
import { CategoryService } from 'services';

export const CategorySelectV2 : FunctionComponent<{currentCategories: ICategoryRspModel[] | undefined, add: any, handleDelete: any, disabled?: boolean}> 
= ({currentCategories, add, handleDelete, disabled}) => {
  const currentService = CategoryService;
  const [categories, setCategories] = useState<ICategoryRspModel[]>();
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  useEffect(() => {
    let isUnmount = false;
    currentService.getCategories().then(rsp => {
      if(rsp && rsp instanceof Array && !isUnmount) {
        setCategories(rsp);
      }
    })
    
    return () => {isUnmount = true};
  }, [currentService]);

  const handleClose = (e: React.MouseEvent, item: ICategoryRspModel) => {
    e.preventDefault();
    handleDelete(item);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleCategoryChange = (value: string) => {
    if(categories) {
      const group = categories.find(c=>c.children?.find(c=>c.id === value));
      if(group) {
        const tag = group.children?.find(c=>c.id === value);
        add(tag);
        setInputVisible(false);
      }
    }    
  }

  const elements = () => {
    if(currentCategories) {
      return (
        currentCategories.map((category, index) => {
          const isLongTag = category.title.length > 20;
  
          const tagElem = (
            <Tag
              key = {index}
              closable={!disabled}
              onClose={(e) => handleClose(e, category)}
            >
              {isLongTag ? `${category.title.slice(0, 20)}...` : category.title}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={category.title} key={index}>
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
      {elements()}     
      <div hidden={disabled} id="categoryArea" style={{width: '30%', marginTop: 2 }}>
        {inputVisible && (
          <>
            <Select 
              onChange={handleCategoryChange}
              getPopupContainer={() => document.getElementById("categoryArea")!}
              autoFocus={true} 
              onBlur={() => setInputVisible(false)}
            >
              {categories && categories.map((category) => (
                <Select.OptGroup key={category.id} label={category.title}>
                  { category.children && category.children.map((child) => (
                    <Select.Option disabled={currentCategories?.find(c=>c.id === child.id) !== undefined} key={child.id} value={child.id!}>{child.title}</Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </>
        )}
        {!inputVisible && (
          <Tag onClick={showInput}>
            <PlusOutlined /> 类别
          </Tag>
        )}
      </div>      
    </>
  );
}
