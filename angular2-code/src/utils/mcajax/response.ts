/**
 * Ajax请求响应
 *
 * @author alfadb
 * @created 2017-02-16
 */
export interface AjaxResponse {
    /** 执行结果 */
    return_code: number;
    /** 错误消息 */
    error: string;
    /** 执行返回数据 */
    res: any;
}
