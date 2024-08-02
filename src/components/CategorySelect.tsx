import { Form, Select } from 'antd';
import { ICategoryRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CategoryService } from 'services';

export const CategorySelect : FunctionComponent<{currentCategory: ICategoryRspModel | undefined, updateMethod: any}> = ({currentCategory, updateMethod}) => {
  const currentService = CategoryService;

  const [categories, setCategories] = useState<ICategoryRspModel[]>();

  const [categoryTree, setCategoryTree] = useState<ICategoryRspModel>();
  
  const handleCategoryChange = (value: string) => {
    if(categories) {
      const newCategoryTree = searchCategory(categories, value);
      if(newCategoryTree) {
        let newCategory = newCategoryTree;
        while(newCategory.children && newCategory.children.length > 0) {
          newCategory = newCategory.children[0];
        }
        updateMethod(newCategory, newCategoryTree.title);
      }      
    }    
  };

  const searchCategory = (sources: ICategoryRspModel[] | undefined, categoryId: string) => {
    let result: ICategoryRspModel | undefined = undefined;
    if(sources) {
      for(let index = 0; index < sources.length; index++) {
        let category : ICategoryRspModel = {...sources[index], children: []};
        if (category.id !== categoryId){
          let subCategory = searchCategory(sources[index].children!, categoryId);
          if(subCategory) {
            category.children?.push(subCategory)
            result = category;
            break;
          }          
        }
        else {
          result = category;
          break;
        }
      }
    }    

    return result;
  }

  const categoryGenerator = (categoryTree: ICategoryRspModel | undefined) => {
    if(categoryTree && categories){
      let index = 0;
      let optionData : ICategoryRspModel[] | undefined = categories;
      let category: ICategoryRspModel | undefined = categoryTree;   
      let components: JSX.Element[] = [];

      while(optionData && optionData.length > 0){        
        let label = index === 0 ? '课程类型' : index === 1 ? '主目录' : `${index - 1}级目录`;
        let value : string = category === undefined ? optionData[0].title : category.title;
        let categoryModel : ICategoryRspModel | undefined = optionData.find(c => c.title === value);
        
        components.push((<Form.Item key={index + 1} label={label}>
          <Select value={value} style={{ width: 120 }} onChange={(value)=>handleCategoryChange(value)}>
          {
            optionData && optionData.map((category, index) => (
              <Select.Option key={index} value={category.id!}>{category.title}</Select.Option>
            ))
          }
          </Select>
        </Form.Item>))
        
        optionData = categoryModel?.children;
        category = category && category.children && category.children.length > 0 ? category.children[0] : undefined;
        index++;
      }

      return components;
    }
  }

  useEffect(() => {
    if(categories === undefined) {
      currentService.getCategories().then(rsp => {
        if(rsp && rsp instanceof Array) {
          setCategories(rsp);
        }
      })
    }  
  }, [categories, currentService]);

  useEffect(() => {
    if(categories) {
      if(currentCategory?.id){
        let newCategory = searchCategory(categories, currentCategory?.id!);
        setCategoryTree(newCategory)
      }
      else {
        const defaultCategory = {...categories[0], childNodes: []};
        updateMethod(defaultCategory, defaultCategory.title);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, currentCategory]);
  return (
    <>
      {categoryGenerator(categoryTree)}
    </>
  );
}
