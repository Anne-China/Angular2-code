import { AjaxExceptionType } from './exception-type';

/**
 * Ajax异常
 *
 * @author alfadb
 * @created 2017-02-16
 */
export interface AjaxException {
    /** 异常状态代码 */
    StatusCode: number;
    /** 异常数据 */
    Data?: any;
    /** 异常内容类型 */
    Type?: AjaxExceptionType;
}
