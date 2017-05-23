import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestMethod } from '@angular/http';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { UserClientAdapter } from './client.adapter';

@Injectable()
export class UserClientService {
    constructor(
        private http: Http,
        private passport: Passport,
        private adapter: UserClientAdapter
    ) { }

    public queryUsers(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listZxUser.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryClientParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryUsers(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
