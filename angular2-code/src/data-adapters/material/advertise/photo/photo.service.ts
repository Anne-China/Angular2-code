import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { DataLoaderParameter, MCAjax } from '../../../../utils';
import { Passport } from '../../../../framework';
import { ApiHosts } from '../../../api.config';
import { Photo } from './photo.model';
import { PhotoAdapter } from './photo.adapter';

@Injectable()
export class PhotoService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: PhotoAdapter
    ) { }
    public queryPhoto(parameter: DataLoaderParameter) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/listAdvert.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID},
                commonParameter: parameter
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryPhoto(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryAdvertiseLocation() {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'advertApi/queryPushWz.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID}
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryAdvertiseLocation(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryProductId(parameter: DataLoaderParameter, categoriesId) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listProduct.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, category: categoriesId},
                commonParameter: parameter
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProductId(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryBrandsById() {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/findAllBrand.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID}
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryBrandsById(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addAdvertise(value: Photo): Observable<boolean> {
        const data = this.adapter.toAddAdvertise(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/addAdvert.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delAdvertise(value: Photo): Observable<boolean> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/delAdvertFun.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, advert_id: value.Id },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delPhoto(id, pict): Observable<boolean> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/delAdvertPicFun.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, advert_id: id, pic_url: pict },
            }).success(() => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
