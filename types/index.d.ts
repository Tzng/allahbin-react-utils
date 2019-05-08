export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
export interface ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response;
}
/**
 * 增加的参数
 * @param {string} requestType post类型, 用来简化写content-Type, 默认json
 * @param {*} data post数据
 * @param {object} params query参数
 * @param {string} responseType 服务端返回的数据类型, 用来解析数据, 默认json
 * @param {boolean} useCache 是否使用缓存,只有get时有效, 默认关闭, 启用后如果命中缓存, response中有useCache=true. 另: 内存缓存, 刷新就没.
 * @param {number} ttl 缓存生命周期, 默认60秒, 单位毫秒
 * @param {number} timeout 超时时长, 默认未设, 单位毫秒
 * @param {boolean} getResponse 是否获取response源
 * @param {function} errorHandler 错误处理
 * @param {string} prefix 前缀
 * @param {string} suffix 后缀
 * @param {string} charset 字符集, 默认utf8
 */
export interface RequestOptionsInit extends RequestInit {
  /**
   * 字符集
   */
  charset?: 'utf8' | 'gbk';
  /**
   * requestType post类型, 用来简化写content-Type, 默认json
   */
  requestType?: 'json' | 'form';
  /**
   * post数据
   */
  data?: any;
  /**
   * 非post的参数
   */
  params?: object;
  /**
   * 响应数据
   */
  responseType?: ResponseType;
  /**
   * 是否缓存
   */
  useCache?: boolean;
  /**
   * 缓存生命周期
   */
  ttl?: number;
  /**
   * 请求超时时间
   */
  timeout?: number;
  /**
   * errorHandler 错误处理
   * @param error
   */
  errorHandler?: (error: ResponseError) => void;
  /**
   * 前缀
   */
  prefix?: string;
  /**
   * 后缀
   */
  suffix?: string;
}

export interface RequestOptionsWithoutResponse extends RequestOptionsInit {
  /**
   * 是否获取源response, 返回结果将包裹一层
   */
  getResponse: false;
}

export interface RequestOptionsWithResponse extends RequestOptionsInit {
  /**
   * 是否获取源response, 返回结果将包裹一层
   */
  getResponse: true;
}

export type RequestResponse<T = any> = {
  data: T;
  response: Response;
};

export type RequestInterceptor = (
  url: string,
  options: RequestOptionsInit
) => {
  url?: string;
  options?: RequestOptionsInit;
};

// use async ()=> Response equal  ()=> Response

export type ResponseInterceptor = (response: Response, options: RequestOptionsInit) => Response | Promise<Response>;

export interface RequestMethod<R = false> {
  <T = any>(url: string, options: RequestOptionsWithResponse): Promise<RequestResponse<T>>;
  <T = any>(url: string, options: RequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, options?: RequestOptionsInit): R extends true ? Promise<RequestResponse<T>> : Promise<T>;
  get: RequestMethod<R>;
  post: RequestMethod<R>;
  delete: RequestMethod<R>;
  put: RequestMethod<R>;
  patch: RequestMethod<R>;
  rpc: RequestMethod<R>;
  interceptors: {
    request: {
      use: (handler: RequestInterceptor) => void;
    };
    response: {
      use: (handler: ResponseInterceptor) => void;
    };
  };
}

export interface ExtendOnlyOptions {
  maxCache?: number;
}

export type ExtendOptionsInit = RequestOptionsInit & ExtendOnlyOptions;

export type ExtendOptionsWithoutResponse = RequestOptionsWithoutResponse & ExtendOnlyOptions;

export type ExtendOptionsWithResponse = RequestOptionsWithResponse & ExtendOnlyOptions;

export interface Extend {
  (options: ExtendOptionsWithoutResponse): RequestMethod<false>;
  (options: ExtendOptionsWithResponse): RequestMethod<true>;
  (options: ExtendOptionsInit): RequestMethod;
}

export declare var extend: Extend;

declare var request: RequestMethod;

export default request;
