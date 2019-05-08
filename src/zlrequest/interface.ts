// 定义接口
export interface Option {
  /**
   * 请求的类型
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
  /**
   * 数据格式
   */
  manner: 'form' | 'json' | 'blob' | 'file';
  /**
   * 请求头
   */
  headers: {
    'usertoken': string,
    'Content-Type': string
  };
  /**
   * 是否设置token
   */
  setToken?: boolean;
  /**
   * 是否是文件
   */
  isFile?: boolean;
  /**
   * 响应数据类型
   */
  responseType?: string;
  /**
   * 请求参数
   */
  body?: object;
  /**
   * 返回数据格式
   */
  dataType?: string
}

// 默认的配置项
export const defOption: Option = {
  method: 'POST',
  manner: 'form',
  setToken: false,
  isFile: false,
  headers: {
    'usertoken': 'string',
    'Content-Type': 'application/json;charset=utf-8',
  }
};
