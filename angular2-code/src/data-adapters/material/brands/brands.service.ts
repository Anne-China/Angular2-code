import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { BrandsAdapter } from './brands.adapter';
import { Brand } from './brands.model';

@Injectable()
export class BrandsService {
    constructor(
        private http: Http,
        private passport: Passport,
        private adapter: BrandsAdapter) { }

    public queryBrands(parameter: DataLoaderParameter): Observable<{ total: number, data: Brand[] }> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listPageBrand.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryBrandsParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryBrands(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryBrandByIDs(ids: number[]): Observable<Brand[]> {
        if (ids == null || ids.length === 0) {
            return Observable.empty();
        }
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/queryBrandByIds.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ids: ids.join(',') }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryBrandByIDs(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addBrand(value: Brand): Observable<boolean> {
        const data = this.adapter.toAddBrands(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/addBrand.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public editBrand(value: Brand): Observable<boolean> {
        const data = this.adapter.toEditBrands(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/editBrand.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delBrand(value: Brand): Observable<boolean> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/delBrand.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, brand_id: value.ID },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
