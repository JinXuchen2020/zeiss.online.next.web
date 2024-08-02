import { Typography } from 'antd';
import React, { FunctionComponent, useState } from 'react';

export const SeriesNumbersText : FunctionComponent<{record: any, seriesNumbers: string[]}> 
= ({record, seriesNumbers}) => {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [key, setKey] = useState(0);
  const [currentId, setCurrentId] = useState<string>()
  const onCollapse = () => {
    setIsCollapsed(true);
    setKey(key + 1)
  };

  const isEditing = (record: any) => record.id === currentId;

  const editable = isEditing(record);
  
  return (
    <div key={record.id! + key} style={{paddingTop: 10}}>
      <Typography.Paragraph ellipsis={
        { 
          rows: 2, 
          expandable: true,                 
          symbol: '更多',
          onExpand: () => {
            setIsCollapsed(false)
            setCurrentId(record.id)
          }
        }
      }>
        {
          seriesNumbers.map((c, index)=>
            <div key={`${record.id!}_${index}`}>{c}</div>
          )
        }
        {
          !isCollapsed && editable ? <Typography.Link underline={false} onClick={onCollapse}>收起</Typography.Link> : undefined
        }
      </Typography.Paragraph>
    </div>    
  );
}
