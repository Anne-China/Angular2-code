import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { ProviderAdapter } from './provider.adapter';
import { Provider } from './provider.model';

@Injectable()
export class ProviderService {
    constructor(private http: Http, private passport: Passport, private adapter: ProviderAdapter) { }

    public queryProviders(parameter: DataLoaderParameter): Observable<{ total: number, data: Provider[] }> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'gys/listPageSupplier.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryProviderParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProviders(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryProviderByIDs(ids: number[]): Observable<Provider[]> {
        if (ids == null || ids.length === 0) {
            return Observable.empty();
        }
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'gys/querySupplierByIds.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ids: ids.join(',') },
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProviderByIDs(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addProvider(value: Provider): Observable<boolean> {
        const data = this.adapter.toAddProvider(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'gys/addSupplier.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public editProvider(value: Provider): Observable<boolean> {
        const data = this.adapter.toEditProvider(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'gys/editSupplier.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delProvider(value: Provider): Observable<boolean> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'gys/delSupplier.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, sup_id: value.ID },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
