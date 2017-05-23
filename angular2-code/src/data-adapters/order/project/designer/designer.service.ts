import { Injectable } from '@angular/core';
import { DataLoaderParameter, MCAjax } from '../../../../utils';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiHosts } from '../../../api.config';
import { Passport } from '../../../../framework';
import { DesignerAdapter } from './designer.adapter';

@Injectable()
export class DesignerService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: DesignerAdapter
    ) { }

    public queryDesigner(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/queryDesignerInfo.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID},
                commonParameter: this.adapter.toQueryDesignerParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryDesigner(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
