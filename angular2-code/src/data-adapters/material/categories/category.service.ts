import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataLoaderParameter, MCAjax } from '../../../utils';
import { ApiHosts } from '../../api.config';
import { Passport } from '../../../framework';
import { CategoriesAdapter } from './category.adapter';
import { Category } from './category.model';

@Injectable()
export class CategoriesService {
    constructor(private http: Http, private passport: Passport, private adapter: CategoriesAdapter) { }

    public queryCategories(parameter: DataLoaderParameter): Observable<Category[]> {
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/listCategoryListPage.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID },
                commonParameter: this.adapter.toQueryCategoriesParameter(parameter)
            }).success((response: any) => {
                observer.next(this.adapter.fromQueryCategories(response).data);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public addCategory(value: Category): Observable<number> {
        const data = this.adapter.toAddCategory(value);
        return Observable.create((observer) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                url: 'main/addCategory.do',
                method: RequestMethod.Post,
                datas: { user_id: this.passport.Current.ID, ...data },
            }).success((response: { id: string }) => {
                observer.next(response.id);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
