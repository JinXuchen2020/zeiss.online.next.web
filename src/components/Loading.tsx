import { Col, Row, Spin } from 'antd';
import React, { FunctionComponent} from 'react';

export const Loading : FunctionComponent<{loading: boolean, spinTip?: string}> 
= ({loading, spinTip})=> {
  return (
    <Row hidden={!loading}>
      <Col>
        <div className='ant-modal-mask'>
          <div className='ant-modal-wrap ant-modal-centered'>   
            <div className='ant-modal' style={{width: 150}}>
              <div className='ant-modal-content'>
                <div className='ant-modal-body' style={{height: 100, verticalAlign: 'middle'}}>
                  <Spin size='large' style={{marginTop: 25}} tip={spinTip}> </Spin>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>    
  );
}