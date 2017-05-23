import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataLoaderParameter, MCAjax } from '../../../utils';

import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { PhoneAppAdapter } from './phone-app.adapter';
import { PhoneApp } from './phone-app.model';

@Injectable()
export class PhoneAppService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: PhoneAppAdapter
    ) { }
    public queryPhoneApp(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/listAppVer.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryPhoneApp(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryPhoneApp(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addPhoneApp(value: PhoneApp): Observable<boolean> {
        const data = this.adapter.toAddPhoneApp(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/pushAppVer.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
