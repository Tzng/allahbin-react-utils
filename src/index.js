import fetch from './lib/fetch';
import request, { extend } from './umi-request/request';
import { RequestError, ResponseError } from './umi-request/utils';

export { fetch, extend, RequestError, ResponseError };

export default request;
