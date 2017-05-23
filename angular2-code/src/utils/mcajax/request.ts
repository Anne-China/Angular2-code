import { RequestMethod } from '@angular/http';
import { DataLoaderParameter } from '../dataloader-parameter';

/** Ajax POST 请求数据序列化类型 */
export enum AjaxPostSerializeType {
    FormUrlencoded,
    Json
}

/**
 * Ajax请求内容
 *
 * @author alfadb
 * @created 2017-02-16
 */
export interface AjaxRequest {
    /** 请求地址 */
    url: string;
    /** 请求方法 */
    method: RequestMethod;
    /** 请求参数 */
    datas?: any;
    /** 通用参数表 */
    commonParameter?: DataLoaderParameter;
    /** POST数据序列化类型，默认FormUrlencoded */
    postSerializeType?: AjaxPostSerializeType;
}
