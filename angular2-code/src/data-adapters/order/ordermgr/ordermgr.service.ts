import { Injectable } from '@angular/core';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { OrderMgrAdapter } from './ordermgr.adapter';

@Injectable()
export class OrderMgrService {
    constructor(
        public http: Http,
        public adapter: OrderMgrAdapter,
        public passport: Passport
    ) { }
    public queryOrder(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/orderlist.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryOrder(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryOrder(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
