/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { notification } from 'antd';
import { router } from 'umi';
import { extend } from '../umi-request';
import codeMessage from "@/zlrequest/httpCode";
import {defOption} from "@/zlrequest/interface";
import stringUtils from "@/utils/stringUtils";

/**
 * 异常处理程序
 * any https://github.com/umijs/umi-request/issues/25
 */
const errorHandler = (error: any) => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  if (status === 401) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    (window as any).g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

/**
 * 请求错误拦截——后台返回错误数据的拦截
 * @param response 后台传递的结果数据
 */
const responseErrorIntercept = (response: Response) => {
  // 判断是否是线上环境
  if(process.env.NODE_ENV === 'development'){
    const resJson = response.json().then(res => {
      console.log('%c ' + new Date().toLocaleString() + '本次返回值：', 'color:#9100ff', resJson);
      return response;
    })
  }
  return response;
};

const requestErrorIntercept = (url, options) => {
  console.log(process.env.NODE_ENV);
  // 判断是否是线上环境
  if(process.env.NODE_ENV === 'development'){
    console.log('%c ' + new Date().toLocaleString() + '本次请求地址：', 'color:#007eff', url);
    console.log('%c ' + new Date().toLocaleString() + '本次请求参数：', 'color:blue', options.body);
  }
  return {url, options};
};

/**
 * 在taro框架下，发送数据请求的方法
 * @param url 请求的地址
 * @param option 请求配置项
 * @param callback 回调函数
 */
export default async function zlrequest(url: string, option: object, callback?: Function) : Promise<any> {
  const newOptions = { ...defOption, ...option };
  const { isFile } = newOptions;
  // 如果是文件的话，就要设置请求类型
  if (isFile) {
    // 设置响应类型
    newOptions.responseType = 'blob';
  }
  // 去除无效的参数
  const newParams: object = stringUtils.buildParamsNull(newOptions.body);
  // 获取请求头
  const oldHeaders = newOptions.headers;
  // 判断参数类型
  if (newOptions.manner !== 'json') {
    // 完整的表单操作
    const formData = new FormData();
    Object.keys(newParams).forEach(key => {
      formData.append(key, newParams[key])
    });
    // 对blob进行独立条件的判断
    if (newOptions.manner === 'blob') {
      // 设置响应的类型
      newOptions.responseType = 'blob';
    }
    newOptions.body = formData
    // 合并请求头
    newOptions.headers = { ...oldHeaders, ...{ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
  } else {
    // json格式
    newOptions.headers = { ...oldHeaders, ...{ 'Content-Type': 'application/json;charset=utf-8' } };
  }
  // 获取要添加token的url
  const tokenUrl = sessionStorage.getItem("tokenUrl");
  if(url.length === 0){
    return new Promise((reject) => reject(new Error("无效的请求地址")))
  }
  // 请求的地址判断
  if (url.search(tokenUrl) > -1) {
    // 加上请求头
    newOptions.headers.usertoken = sessionStorage.getItem('usertoken');
  }
  /**
   * 配置request请求时的默认参数
   */
  const request = extend({
    maxCache: 10, // 最大缓存个数, 超出后会自动清掉按时间最开始的一个.
    // 集中处理错误
    errorHandler,
    headers:newOptions.headers,
    credentials: 'include', // 默认请求是否带上cookie
  });

  request.interceptors.request.use(requestErrorIntercept);

  request.interceptors.response.use(responseErrorIntercept);

  // 发送请求
  request(url).then(res => res);
}
