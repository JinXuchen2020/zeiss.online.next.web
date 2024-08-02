import { Button, Col, Row } from 'antd';
import { FunctionComponent, ReactNode } from 'react';

interface buttonProps {
  onClick: any,
  icon?: ReactNode,
  disabled?: boolean,
  hidden? : boolean,
  title?: ReactNode
}

declare type SizeType = 'small' | undefined;

export const TableButtonGroup : FunctionComponent<{btnProps: buttonProps[], size?: SizeType}>  = ({size, btnProps}) => {
  return (
    <Row>
      {
        size ==="small" ? 
        btnProps.map((props, index)=> (
          <Col key={index} hidden={props.hidden} style={{marginRight: 2, marginBottom: 1}}>
            <Button size='small' disabled={props.disabled} type="text" icon={props.icon} onClick={props.onClick}></Button>
          </Col>
        )) :
        btnProps.map((props, index) => (
          <Col key={index} hidden={props.hidden} style={{marginRight: 2, marginBottom: 1}}>
            <Button size='small' disabled={props.disabled} type="primary" onClick={props.onClick}>{props.title}</Button>
          </Col>
        ))
      }
    </Row>
  )
}

