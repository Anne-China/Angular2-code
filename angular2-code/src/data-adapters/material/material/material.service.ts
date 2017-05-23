import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { MaterialAdapter } from './material.adapter';
import { Material } from './material.model';

@Injectable()
export class MaterialService {
    constructor(
        private http: Http,
        private passport: Passport,
        private adapter: MaterialAdapter) { }

    public queryMaterials(parameter: DataLoaderParameter): Observable<{ total: number, data: Material[] }> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listProduct.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryMaterialParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryMaterials(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addMaterial(value: Material): Observable<boolean> {
        const data = this.adapter.toAddMaterial(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/addProduct.do',
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
