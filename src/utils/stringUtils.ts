export default class stringUtils {

  /**
   * 将参数中的null，''等属性删除掉
   * @param params 需要判断的对象
   */
  static buildParamsNull(params?: object) {
    const newParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (this.isNoExit(params[key])) {

        }
      })
    }
    return newParams;
  }

  /**
   * 判断是否存在
   * @param str 需要判断的参数
   */
  static isNoExit(str: any) {
    if (str === '') {
      return false;
    }
    if (str === 0) {
      return true;
    }
    return str;
  }
}
