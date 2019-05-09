/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { notification } from 'antd';
import { extend } from 'umi-request';
import { router } from 'umi';
import codeMessage, {defOption} from "./httpCode";
import stringUtils from "../utils/stringUtils";

/**
 * 异常处理程序
 * any https://github.com/umijs/umi-request/issues/25
 */
const errorHandler = (error) => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  if (status === 401) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    (window).g_app._store.dispatch({
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
const responseErrorIntercept = async (response) => {
  // 判断是否是开发环境
  if(process.env.NODE_ENV === 'development'){
    // https://www.w3cschool.cn/fetch_api/fetch_api-y1932m68.html
    const copRes = response.clone();
    const resJson = await copRes.json();
    console.log(`%c ${  new Date().toLocaleString()}本次返回值：`, 'color:#9100ff', resJson);
  }
  return response;
};

/**
 * 请求拦截
 * @param url
 * @param options
 * @return {{options: *, url: *}}
 */
const requestErrorIntercept = (url, options) => {
  // 判断是否是开发环境
  if(process.env.NODE_ENV === 'development'){
    console.log(`%c ${  new Date().toLocaleString()  }本次请求地址：`, 'color:#007eff', url);
    console.log(`%c ${  new Date().toLocaleString()  }本次请求参数：`, 'color:blue', (options.body || options.params));
  }
  return {url, options};
};

/**
 * 在taro框架下，发送数据请求的方法
 * @param url 请求的地址
 * @param option 请求配置项
 * @param callback 回调函数
 */
export default async function zlrequest(url, option, callback) {
  // 地址拦截
  if(url.length === 0){
    return new Promise((reject) => reject(new Error("无效的请求地址")))
  }
  // 覆盖默认值
  const newOptions = { ...defOption, ...option };
  const { isFile } = newOptions;
  // 如果是文件的话，就要设置请求类型
  if (isFile) {
    // 设置响应类型
    newOptions.responseType = 'blob';
  }
  // 去除无效的参数
  newOptions.body = stringUtils.buildParamsNull(newOptions.body);
  // 获取要添加token的url
  const tokenUrl = sessionStorage.getItem("tokenUrl");
  // 请求的地址判断
  if (url.search(tokenUrl) > -1) {
    // 加上请求头
    newOptions.headers.usertoken = sessionStorage.getItem('usertoken');
  }
  // 对数据进行判断
  if(newOptions.method === 'get'){
    newOptions.params = newOptions.body;
    delete newOptions.body;
  }else {
    newOptions.data = newOptions.body;
  }
  /**
   * 配置request请求时的默认参数
   */
  const request = extend({
    ...newOptions,
    requestType: newOptions.manner
  });

  request.interceptors.request.use(requestErrorIntercept);

  request.interceptors.response.use(responseErrorIntercept);

  // 发送请求
  return request(url);
}
