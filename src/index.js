import fetch from './lib/fetch';
import request, { extend } from './umi-request/request';
import { RequestError, ResponseError } from './umi-request/utils';
import zlrequest from './zlrequest';

export { fetch, extend, RequestError, ResponseError, zlrequest };

export default request;
