import { Button, Col, Row, Space } from 'antd';
import { CourseSelectedTable, CourseSelectTable, Loading, TableSearch } from 'components';
import { CategoryType, ICourseQueryOption, ICourseRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CourseService } from 'services';
import queryString from 'query-string';

export const GroupSelectCourse : FunctionComponent<{currentSelectedCourses: ICourseRspModel[] | undefined, handleSelect: any, handleUnSelect: any, confirm?: any}> 
= ({currentSelectedCourses, handleSelect, handleUnSelect, confirm}) => {

  const [searchParams] = useSearchParams();

  const [unSelectCourses, setUnSelectCourses] = useState<ICourseRspModel[]>();
  const [reloading, setReloading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  useEffect(() => {
    const query: Partial<ICourseQueryOption> = queryString.parse(searchParams.toString())
    query.isPublished = true
    query.level = 2
    if(currentSelectedCourses) {
      if(reloading) {
        setIsLoading(true);
        setLoadingTip("加载课程...")
        CourseService.getCourses(query).then(rsp => {
          if(rsp && rsp.data) {
            const unSelectCourses = rsp.data.filter(c=>currentSelectedCourses.findIndex(t=>t.id === c.id) < 0)
            setUnSelectCourses([...unSelectCourses]);
          }
          setIsLoading(false);
        });
      }
      else {
        const filterResult = unSelectCourses?.filter(c=>currentSelectedCourses.findIndex(t=>t.id === c.id) < 0)
        setUnSelectCourses(filterResult);
      }  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedCourses, searchParams]);

  const handleSelectCourse = (course : ICourseRspModel ) => {
    handleSelect(course)
    setReloading(false)
  }

  const handleUnSelectCourse = (course : ICourseRspModel ) => {
    handleUnSelect(course, () => {
      if(unSelectCourses) {
        setUnSelectCourses([...unSelectCourses, course])
      }
      else {
        setUnSelectCourses([course])
      }
    })
      
    setReloading(false)
  }
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={18}>
          <TableSearch 
            optionKey={'name'} 
            placeholder={'请输入课程名'} 
            buttonText={'查找'}
            handleRefresh={() => setReloading(true)}
          />
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={14} style={{marginRight: 10}}>
          <CourseSelectTable 
            currentCourses={unSelectCourses}
            loading={false}
            handleSelect={handleSelectCourse} />
        </Col>
        <Col span={8}>
          <CourseSelectedTable 
            currentCourses={currentSelectedCourses}
            loading={false} 
            handleUnSelect={handleUnSelectCourse} />          
          <Row gutter={24}>
            <Col span={24}>
              <Space style={{float: 'right'}}>                
                <Button type='primary' onClick={()=> confirm()}>确认</Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
    
  );
}
