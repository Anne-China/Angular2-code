import { Injectable } from '@angular/core';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { ClientProjectAdapter } from './project.adapter';
import { ClientProject, Product } from './project.model';
import { Category } from '../../material/categories/category.model';
import { Brand } from '../../material/brands/brands.model';

@Injectable()
export class ClientProjectService {
    constructor(
        public http: Http,
        public passport: Passport,
        public adapter: ClientProjectAdapter
    ) { }

    public queryProject(parameter: DataLoaderParameter): Observable<{ total: number, data: ClientProject[] }> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/queryAllDecoraForWeb.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryProjectParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProject(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryPackages(): Observable<{ [key: number]: string }> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/showBasePageData.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID }
            }).success((response: any) => {
                observer.next(response);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryCategoriesByPackageID(packageID: number): Observable<Category[]> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/queryCategoryByClum.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, clum_id: packageID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryCategoriesByPackageID(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryBrandsByCategoryID(categoryID: number): Observable<Brand[]> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/findBrandsByCategroy.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, category: categoryID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryBrandsByCategoryID(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryCandidateProducts(categoryID: number, brandID?: number): Observable<Product[]> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/showPaiBanData.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, category: categoryID, brand_id: brandID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProducts(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public querySelectedProducts(projectID: string): Observable<Product[]> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/queryMyMedcoraData.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, dec_id: projectID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryProducts(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addSelectProduct(projectID: string, productID: number, quantity: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/toAddSelectProduct.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, dec_id: projectID, product_id: productID, num: quantity }
            }).success((response: any) => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public editSelectProductQuantity(projectID: string, productID: number, quantity: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/updateDecorsp.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, dec_id: projectID, product_id: productID, num: quantity }
            }).success((response: any) => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delSelectProduct(projectID: string, productID: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/toDeleteSelectProduct.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, dec_id: projectID, product_id: productID }
            }).success((response: any) => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryCandidateWorkers(skillID?: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/findAllWorkerDesingerOnPb.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, skill: skillID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryCandidateWorkers(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public querySelectedWorkers(projectID: string) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/listSelectZxProvider.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, decora_id: projectID }
            }).success((response: any) => {
                observer.next(this.adapter.fromQuerySelectedWorkers(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addSelectWorker(projectID: string, mxcomeNo: number, addUserID: number, skillID: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/paibanAddZxPrivoder.do',
                method: RequestMethod.Post,
                datas: {
                    user_id: this.passport.Current.ID,
                    decora_id: projectID,
                    mxcome_no: mxcomeNo,
                    adduser_id: addUserID,
                    skill: skillID
                }
            }).success((response: any) => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public delSelectWorker(projectID: string, dpsID: number) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webService/delPanbanZxPrivoder.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, dps_id: dpsID }
            }).success((response: any) => {
                observer.next(true);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public queryWorkerMaterial(pids: string) {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'webRpcMng/queryCustXCL.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, pid: pids }
            }).success((response: any) => {
                observer.next(this.adapter.fromQuerySelectedWorkerMaterial(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
