import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { MCAjax } from '../../../../../utils';
import { Observable } from 'rxjs/Observable';
import { Passport } from '../../../../../framework';
import { ApiHosts } from '../../../../api.config';

import { ChangeDesigner } from './change-designer.model';
import { ChangeDesignerAdapter } from './change-designer.adapter';

@Injectable()
export class ChangeDesignerService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: ChangeDesignerAdapter
    ) { }
    public ChangeDesigner(value: ChangeDesigner, ProjectId): Observable<boolean> {
        const data = this.adapter.toChangeDesigner(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/changeDesign.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data, pr_id: ProjectId }
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
