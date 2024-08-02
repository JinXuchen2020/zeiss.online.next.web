import { IErrorRsp, ITokenRspModel, USER_PROFILE } from "models";

import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios'

const apiRoot = process.env.NEXT_PUBLIC_API_ROOT;

let errorHandler: (err: any) => void = () => { };

export const setErrorHandler = (handler: (err: any) => void) => {
  errorHandler = handler;
}

export interface IFetchProps {
  method: "GET" | "POST" | "POSTFILES" | "PUT" | "PATCH" | "DELETE" | "DOWNLOAD",
  url: string,
  body: any | undefined
}

export const $fetch = async <T>(args: IFetchProps): Promise<T> => {
    //await waitLogin();
    //let token = await acquireToken();
  let token;
  const userTokenString = sessionStorage.getItem(USER_PROFILE);
  if(userTokenString) {
    const userToken = JSON.parse(userTokenString) as ITokenRspModel
    token = userToken.token
  }
  let headers: AxiosRequestHeaders = {'X-Requested-With': 'XMLHttpRequest'};
  if(token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  let options : AxiosRequestConfig;
  if (args.method === "POSTFILES") {
    headers['Content-Type'] = 'multipart/form-data'
    options = {
      method: "POST",
      headers: headers,
      data: args.body,
      cancelToken: axios.CancelToken.source().token
    };
  }
  else if(args.method === "DOWNLOAD"){
    options = {
      method: "POST",
      headers: headers,
      data: args.body,
      responseType: 'blob',
      cancelToken: axios.CancelToken.source().token
    };
  } 
  else {
    headers["Content-Type"] = "application/json";
    options = {
      method: args.method,
      headers: headers,
      cancelToken: axios.CancelToken.source().token,
      data: (args.body && args.method !== "GET" && args.method !== "DELETE")
          ? JSON.stringify(args.body)
          : undefined
    };
  }

  let data: T = {} as T;

  try {
    let rsp = await axios(`${apiRoot}${args.url}`, options);
    if (rsp.status === 200) {
      data = await rsp.data;
    } else {
      let errData: IErrorRsp = await rsp.data;
      errorHandler (errData);
    }
  } 
  catch (err) {
    errorHandler(err);
  }

  return data;
}