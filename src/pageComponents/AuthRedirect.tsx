import { Loading } from 'components';
import React, { FunctionComponent, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useSearchParams } from 'next/navigation';

export const AuthRedirect : FunctionComponent = ()=> {
  const searchParams = useSearchParams();
  const appId = process.env.NEXT_PUBLIC_WE_CHAT_CORP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_WE_CHAT_REDIRECT_URI;
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`

  const [isLoading, setIsLoading] = useState(false);

  const [loadingTip, setLoadingTip] = useState<string>()

  useEffect(() => {
    const { code } = queryString.parse(searchParams.toString())
    if(code === undefined) {
      window.location.href = authUrl;
      setIsLoading(true);
      setLoadingTip("登录中...")
    }
    else {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchParams])

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
    </>    
  );
}
