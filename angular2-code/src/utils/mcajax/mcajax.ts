import { EventEmitter } from '@angular/core';
import { Http, Request, Response, RequestOptions, Headers, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GetType, IsBlank } from '../func';

import { AjaxException } from './exception';
import { AjaxExceptionType } from './exception-type';
import { AjaxRequest, AjaxPostSerializeType } from './request';
import { AjaxResponse } from './response';

/**
 * Ajax服务
 *
 * @author alfadb
 * @created 2017-02-16
 */
export class MCAjax {

    public isTest = true;

    /** 当Ajax调用异常，且未提供异常处理函数时，此事件将被触发 */
    public static OnUnhandledError = new EventEmitter<AjaxException>();
    /**
     * 创建MCAjax对象
     *
     * @param http Aangular Http对象
     * @param endpoint (可选)Ajax接口调用终结点，未提供时不使用跨域
     * @returns {MCAjax}
     */
    public static Create(http: Http, endpoint?: string): MCAjax {
        return new MCAjax(http, endpoint);
    }

    private endpoint: string;
    /**
     * @author alfadb
     * @created 2017-02-16
     *
     * @param http Aangular Http对象
     * @param _endpoint Ajax接口调用终结点，未提供时不使用跨域
     * @returns {MCAjax}
     */
    constructor(private http: Http, _endpoint?: string) {
        if (!IsBlank(_endpoint)) {
            this.endpoint = _endpoint.trim();
            if (this.endpoint.endsWith('/')) {
                this.endpoint = this.endpoint.substr(0, this.endpoint.length - 1);
            }
        }
    }

    private onSuccess: (data: any) => void;
    private onError: (ex: AjaxException) => void;
    private onFinally: () => void;

    /**
     * 设置Ajax调用成功处理函数
     *
     * @param successFn Ajax调用成功处理函数
     * @returns {MCAjax}
     */
    public success(successFn: (data?: any) => void) {
        this.onSuccess = successFn;
        return this;
    }

    /**
     * 设置Ajax调用异常处理函数
     *
     * @param errorFn Ajax调用异常处理函数
     * @returns {MCAjax}
     */
    public error(errorFn: (ex: AjaxException) => void) {
        this.onError = errorFn;
        return this;
    }

    /**
     * 设置Ajax调用完成处理函数
     *
     * @description Ajax调用完成后，无论成功或失败，都会回调此函数
     *
     * @param finallyFn Ajax调用完成处理函数
     * @returns {MCAjax}
     */
    public finally(finallyFn: () => void) {
        this.onFinally = finallyFn;
        return this;
    }

    /**
     * 执行Ajax
     */
    public exec() {
        this.currentRequest.subscribe((res: any) => {
            try {
                const json = res.json();
                this.onHttpSucess(json as AjaxResponse);
            } catch (ex) {
                this.onHttpError(res);
            } finally {
                if (this.onFinally != null) {
                    this.onFinally();
                }
            }
        }, (error: any) => {
            this.onHttpError(error);
            if (this.onFinally != null) {
                this.onFinally();
            }
        });
    }

    private currentRequest: Observable<Response>;
    /**
     * 发起Ajax请求
     *
     * @param req {AjaxRequest} Ajax请求内容
     * @returns {MCAjax}
     */
    public request(req: AjaxRequest) {
        const options = new RequestOptions({
            method: req.method
        });
        // console.log(this.isTest);
        if (this.isTest) {
            if (req.datas != null) {
                req.datas['dev_mode'] = 'true';
                console.log(req.datas);
            }else {
                req.datas = {dev_mode: 'true'};
                console.log(req.datas);
            }
        }
        let parameter = req.datas;
        if (req.commonParameter != null) {
            if (parameter == null) {
                parameter = {};
            } else {
                const pt = GetType(parameter);
                if (pt !== 'object') {
                    parameter = { data: parameter };
                }
            }
            if (req.commonParameter.pager != null) {
                if (req.commonParameter.pager.index != null) {
                    parameter.page_index = req.commonParameter.pager.index;
                }
                if (req.commonParameter.pager.size != null) {
                    parameter.page_size = req.commonParameter.pager.size;
                }
            }
            if (req.commonParameter.sortor != null) {
                if (req.commonParameter.sortor.prop != null) {
                    parameter.sort_field = req.commonParameter.sortor.prop;
                }
                const sortdir = req.commonParameter.sortor.dir;
                parameter.sort_dir = sortdir != null && ['asc', 'desc'].indexOf('sortdir') >= 0 ? sortdir : 'asc';
            }
            if (req.commonParameter.filter != null) {
                parameter = { ...parameter, ...req.commonParameter.filter };
            }
        }
        let url = req.url;
        if (url.indexOf('://') < 0 && !url.startsWith('/')) {
            url = '/' + url;
        }
        if (req.method === RequestMethod.Get) {
            if (parameter != null && parameter !== '' && parameter !== {} && parameter !== []) {
                if (url.indexOf('?') < 0) {
                    url += '?';
                } else {
                    url += '&';
                }
                const body = new URLSearchParams();
                Object.keys(parameter).forEach((key: string) => {
                    body.set(key, parameter[key]);
                });
                url += body.toString();
            }
        } else if (req.method === RequestMethod.Post) {
            if (req.postSerializeType == null) {
                req.postSerializeType = AjaxPostSerializeType.FormUrlencoded;
            }
            if (req.postSerializeType === AjaxPostSerializeType.FormUrlencoded) {
                const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                options.headers = headers;
                if (parameter != null) {
                    const body = new URLSearchParams();
                    Object.keys(parameter).forEach((key: string) => {
                        body.set(key, parameter[key]);
                    });
                    options.body = body.toString();
                }
            } else if (req.postSerializeType === AjaxPostSerializeType.Json) {
                const headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
                options.headers = headers;
                if (parameter != null) {
                    options.body = JSON.stringify(parameter);
                }
            } else {
                throw new Error(`POST方式提交Ajax请求时，不支持'${req.postSerializeType}'序列化参数方式。`);
            }
        } else {
            const headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
            options.headers = headers;
            if (parameter != null) {
                options.body = JSON.stringify(parameter);
            }
        }
        if (IsBlank(this.endpoint)) {
            options.url = url;
        } else {
            options.url = this.endpoint + url;
            options.withCredentials = true;
        }
        const request = new Request(options);

        this.currentRequest = this.http.request(request);
        return this;
    }

    private onHttpError(error: Response) {
        let exData: any;
        let exType: AjaxExceptionType;
        try {
            if (!error.ok && error.status === 0) {
                exData = '网络错误，服务器无响应。';
                exType = AjaxExceptionType.STRING;
            } else {
                exData = error.json();
                if (exData.error != null) {
                    exData = exData.error;
                    exType = AjaxExceptionType.STRING;
                } else {
                    exData = null;
                    exType = AjaxExceptionType.JSON;
                }
            }
        } catch (ex) {
            exData = error.text();
            if (exData.indexOf('<html') >= 0) {
                exType = AjaxExceptionType.HTML;
            } else {
                exType = AjaxExceptionType.STRING;
            }
        }
        const ajaxEx = { StatusCode: error.status, Type: exType, Data: exData };
        if (this.onError != null) {
            this.onError(ajaxEx);
        } else {
            MCAjax.OnUnhandledError.emit(ajaxEx);
        }
    }

    private onHttpSucess(response: AjaxResponse) {
        if (response.return_code === 1) {
            if (this.onSuccess != null) {
                let hasTopData = false;
                for (const key in response) {
                    if (response.hasOwnProperty(key)) {
                        if (['return_code', 'error', 'res'].indexOf(key) < 0) {
                            hasTopData = true;
                            break;
                        }
                    }
                }
                if (hasTopData) {
                    this.onSuccess(response);
                } else {
                    this.onSuccess(response.res);
                }
            }
        } else {
            let type = AjaxExceptionType.JSON;
            if (response.error != null && GetType(response.error) === 'string') {
                type = AjaxExceptionType.STRING;
            }
            const ajaxEx = { StatusCode: 200, Type: type, Data: response.error };
            if (this.onError != null) {
                this.onError(ajaxEx);
            } else {
                MCAjax.OnUnhandledError.emit(ajaxEx);
            }
        }
    }
}
