export default class stringUtils {

  /**
   * 将参数中的null，''等属性删除掉
   * @param params 需要判断的对象
   */
  static buildParamsNull(params) {
    const newParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (this.isExit(params[key])) {
          newParams.key = params[key]
        }
      })
    }
    return newParams;
  }

  /**
   * 判断是否存在
   * @param str 需要判断的参数
   */
  static isExit(str) {
    if (str === '') {
      return false;
    }
    if (str === 0) {
      return true;
    }
    return str;
  }
}
