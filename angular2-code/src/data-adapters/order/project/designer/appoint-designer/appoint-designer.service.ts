import { Injectable } from '@angular/core';
import { MCAjax } from '../../../../../utils';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiHosts } from '../../../../api.config';
import { Passport } from '../../../../../framework';
import { AppointDesignerAdapter } from './appoint-designer.adapter';
import { AppointDesigner } from './appoint-designer.model';

@Injectable()
export class AppointDesignerService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: AppointDesignerAdapter
    ) { }

    public AppointDesigner(value: AppointDesigner, ProjectId): Observable<boolean> {
        const data = this.adapter.toAppointDesigner(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/appointDesign.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data, pr_id: ProjectId },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
