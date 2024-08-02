import { Button, Col, Form, Input, Row, Select, Space, Typography } from "antd"
import { FunctionComponent, useEffect, useState } from "react";
import { ICategoryReqModel, ICategoryRspModel, ISeriesNumberRspModel, ISingleCategoryRspModel } from "models";
import { SeriesNumberList, ConfirmModal } from "components";
import { CategoryService } from "services";
import { PlusOutlined } from '@ant-design/icons';

export const SeriesNumberForm : FunctionComponent<{currentCategory: ISingleCategoryRspModel | undefined, update: any, save: any, handleDelete: any, validate: any, handleDeleteItem?: any}> 
= ({currentCategory, update, save, handleDelete, validate, handleDeleteItem}) => {

  const [parentCategories, setParentCategories] = useState<ICategoryRspModel[]>()
  const [form] = Form.useForm();
  const [parentForm] = Form.useForm();

  const nameValidator = (rule: any, value: any, callback: any) =>{
    const result = validate(value);
    if(result) {
      callback('分类名已存在!');
    }
    else{
      callback();
    }
  }

  const parentCategoryValidator = (rule: any, value: any, callback: any) =>{
    if(currentCategory && currentCategory.parent === undefined) {
      callback('主目录未选择!');
    }
    else{
      callback();
    }
  }

  const parentCategoryTitleValidator = (rule: any, value: any, callback: any) =>{
    if(parentCategories) {
      const result = parentCategories.findIndex(c=>c.title === value)
      if(result >=0) {
        callback('主目录已存在!');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const handleOk = () => {
    form.validateFields().then(async ()=> {
      save()
    })
    .catch()
  };

  const handleCategorySelect = (value: string) => {
    if(parentCategories) {
      const result = parentCategories.find(c=>c.title === value)
      update({parent: result})
    }
  };

  const handleParentCategoryManageConfirm = (isCreate: boolean, selectParentCategory?: ICategoryRspModel) => {
    ConfirmModal({
      title: isCreate ? "新建主目录" : "编辑主目录",
      content: 
        <Form form={parentForm} style={{textAlign: 'left'}}>
          <Form.Item 
            name={"title"}
            label="主目录名"
            rules={[{required: true, whitespace: true, message: '请输入主目录名'}, {validator: parentCategoryTitleValidator}]}
          >
            <Input placeholder="请输入主目录名" />
          </Form.Item>
        </Form>,
      confirm: () => handleParentCategoryManage(isCreate, selectParentCategory) 
    })
  }

  const handleParentCategoryManage = async (isCreate: boolean, selectParentCategory?: ICategoryRspModel) => 
  {
    if (isCreate) {
      const newCategory = await parentForm.validateFields() as ICategoryRspModel
      newCategory.displayInFilter = true

      if(parentCategories) {
        const sequences = parentCategories.map(c=>c.sequence);
        const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;
        newCategory.sequence = maxSequence + 1        
      }
      else {
        newCategory.sequence = 1
      }
      
      const input : ICategoryReqModel = {
        ...newCategory
      }

      const newValue = await CategoryService.createCategory(input)
      if(parentCategories) {
        setParentCategories([...parentCategories, newValue])
      }
      else {
        setParentCategories([newValue])
      }
      
      update({parent: newValue})
    } 
    else {
      if(selectParentCategory && parentCategories) {
        const newValue = await parentForm.validateFields() as ICategoryRspModel
        const updateCategory = {...selectParentCategory, title: newValue.title}
        const input : ICategoryReqModel = {
          ...updateCategory
        }
  
        await CategoryService.updateCategory(selectParentCategory.id!, input)
        const index = parentCategories.findIndex(c=>c.title === selectParentCategory.title) 
        parentCategories[index] = updateCategory
        setParentCategories([...parentCategories])
        update({parent: updateCategory})
      }
    }
    
    parentForm.resetFields()
  };

  const handleParentCategoryDelete = (selectParentCategory: ICategoryRspModel) => 
  {
    ConfirmModal({
      title: `确定删除主目录 ${selectParentCategory.title}`,
      confirm: async () => {
        let result = false
        if(selectParentCategory.id) {
          result = await CategoryService.validateRootCategory(selectParentCategory.id)
        }

        if(result) {
          ConfirmModal({
            title: `主目录 ${selectParentCategory.title} 有分类，无法删除`,
          })
        }
        else {
          if(selectParentCategory.id) {
            await CategoryService.deleteCategory(selectParentCategory.id)
          }
  
          if(parentCategories) {
            const index = parentCategories.findIndex(c=>c.title === selectParentCategory.title)
            parentCategories.splice(index, 1)
            setParentCategories([...parentCategories])
            if (currentCategory?.parent?.title === selectParentCategory.title) {              
              update({parent: undefined})
            }
          }
        }        
      } 
    })    
  };

  const handleSNManage = (item: ISeriesNumberRspModel)=> {
    if(currentCategory) {      
      const seriesNumbers = currentCategory?.seriesNumbers;
      let index;
      if(item.id) {
        index = seriesNumbers.findIndex(c=>c.id === item.id);
      }
      else {
        index = seriesNumbers.findIndex(c=>c.seriesNumbers === item.seriesNumbers);
      }
      
      if(index < 0) {
        seriesNumbers.push(item)
      }
      else {
        seriesNumbers[index] = item;
      }

      update({seriesNumbers: [...seriesNumbers]})
    }
  }

  const handleSNDelete = (item: ISeriesNumberRspModel)=> {
    if(currentCategory) {      
      const seriesNumbers = currentCategory?.seriesNumbers;
      const index = seriesNumbers.findIndex(c=>c.id === item.id);
      seriesNumbers.splice(index, 1)
      update({seriesNumbers: [...seriesNumbers]})
      handleDeleteItem(item)
    }
  }

  useEffect(() => {
    if(parentCategories === undefined) {
      CategoryService.getRootCategories().then(rsp => {
        if(rsp && rsp instanceof Array) {
          setParentCategories(rsp)
        }
      })
    }
  }, [parentCategories]);

  useEffect(() => {
    if(currentCategory) {      
      form.setFieldsValue(currentCategory)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  return (
    <>
      <Form 
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        form={form}
      >
        <Form.Item 
          label="主目录"
          name="parent"
          rules={[{required: true, validator: parentCategoryValidator}]}
        >
          <Row>
            <Col id="category" span={21}>
              <Select
                onChange={handleCategorySelect}
                placeholder={"请选择主目录"}
                getPopupContainer={()=> document.getElementById("category")!}
                value={currentCategory?.parent?.title}
                optionLabelProp="label"
              >
                {
                  parentCategories?.map((item, index) => (
                    <Select.Option key={index} value={item.title} label={item.title} >
                      <Row>
                        <Col span={12}>
                          {item.title}
                        </Col>
                        <Col span={12}>
                          <Space style={{float: 'right'}}>
                            <Typography.Link onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              parentForm.setFieldsValue(item)
                              handleParentCategoryManageConfirm(false, item)
                            }}>
                              编辑
                            </Typography.Link>
                            <Typography.Link onClick={(e) =>{
                              e.preventDefault()
                              e.stopPropagation()
                              handleParentCategoryDelete(item)
                            }}>
                              删除
                            </Typography.Link>
                          </Space>                          
                        </Col>
                      </Row>                      
                    </Select.Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={3}>
              <Space style={{float: 'right'}}>
                <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => handleParentCategoryManageConfirm(true)}></Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item 
          label="分类名"
          name={"title"}
          rules={[{required: true, whitespace: true, message: '请输入分类名'}, {validator: nameValidator}]}
        >
          <Row>
            <Col span={21}>
              <Input placeholder="请输入分类名" value={currentCategory?.title} onChange ={(val) => update({ title: val.target.value})}/>
            </Col>
          </Row>
        </Form.Item>          
        <Form.Item label="序列号" >
          <Row>
            <Col span={24}>
              <SeriesNumberList 
                currentCategory={currentCategory}
                manage={handleSNManage}
                handleDelete={handleSNDelete} />
            </Col>
          </Row>         
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea rows={4} value={currentCategory?.description} onChange={(val: any) => update({ description: val.target.value})}></Input.TextArea>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4}}>
          <Space>
            <Button type="primary" onClick={handleOk}>保存</Button>
            <Button type="primary" onClick={handleDelete}>删除</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}