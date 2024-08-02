import React, { useEffect } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

interface ISearchProps {
  optionKey: string,
  placeholder: string,
  buttonText: string,
  handleRefresh?: any
}

export const TableSearch: React.FunctionComponent<ISearchProps> = (props) => {
  const navigate = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const {optionKey, placeholder, buttonText, handleRefresh} = props

  const [form] = Form.useForm()

  const handleSearchParamChange = (newParams: any) => {
    // Create a new URLSearchParams object with the current search params
    const params = new URLSearchParams(searchParams);
    // Update the params with new values
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value as any);
    });
    // Navigate to the new URL with updated query params
    navigate.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = async () => {
    const query = await form.validateFields()
    if (query[optionKey]) {
      handleSearchParamChange({...query})
      if(handleRefresh) {
        handleRefresh()
      }
    }
  }

  const handleChange = (value: string) =>{
    if(value.length === 0) {
      handleSearchParamChange(value)
      if(handleRefresh) {
        handleRefresh()
      }
    }
  }

  useEffect(() => {
    const query = queryString.parse(searchParams.toString())
    if (query[optionKey]) {
      form.setFieldsValue(query)
    }
    else {
      form.resetFields()
    }
  }, [searchParams]);

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Form layout={'inline'} form={form} onFinish={() => handleSearch()}>
          <Form.Item
            name={optionKey}
          >
            <Input
              size="middle" 
              allowClear={true}
              autoComplete={"off"}
              onBlur={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              style={{width:180}} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleSearch}>{buttonText}</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
