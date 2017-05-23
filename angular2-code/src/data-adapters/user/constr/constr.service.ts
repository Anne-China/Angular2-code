import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestMethod } from '@angular/http';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { Passport } from '../../../framework';
import { ApiHosts } from '../../api.config';
import { UserConstrAdapter } from './constr.adapter';

@Injectable()
export class UserConstrService {
    constructor(private http: Http, private passport: Passport, private adapter: UserConstrAdapter) { }

    public queryUsers(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listZxProvider.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: parameter
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryUsers(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public auditUser(userid: string, state: string, failedDesc?: string): Observable<boolean> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/doZxUserAduit.do',
                method: RequestMethod.Post,
                datas: { check_id: userid, dest_state: state, notpass_desc: failedDesc },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
