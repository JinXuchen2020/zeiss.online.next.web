import { ConfirmModal } from 'components';
import React, { FunctionComponent, useEffect, useState } from 'react';

export const NoPermission : FunctionComponent = ()=> {

  const [permission, setPermission] = useState(false);

  useEffect(() => {
    ConfirmModal({
      title: "请在企业微信中游览！"
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[permission])

  return (
    <>
    </>    
  );
}
