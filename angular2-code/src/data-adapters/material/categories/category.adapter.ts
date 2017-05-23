import { Injectable } from '@angular/core';
import { Category } from './category.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';
import { StaticHosts } from '../../api.config';
import { IsBlank } from '../../../utils/func';

@Injectable()
export class CategoriesAdapter {
    public fromQueryCategories(response: any): { total: number, data: Category[] } {
        const result: Category[] = [];
        for (const res of response.res) {
            if (res != null) {
                const category: Category = {
                    ID: res.category_id,
                    Name: res.category_name,
                    Picture: StaticHosts.GetRes(res.pic),
                    ParentID: res.parent_id,
                    BrandIDs: IsBlank(res.brands) ? [] : JSON.parse(res.brands),
                    ProviderIDs: IsBlank(res.suppliers) ? [] : JSON.parse(res.suppliers)
                };
                result.push(category);
            }
        }
        return { total: response.rows, data: result };
    }

    public toQueryCategoriesParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['parent_id'] = value.filter['ID'];
        }
        return params;
    }

    public toAddCategory(value: Category) {
        if (value == null) {
            return {};
        }
        const result: any = {};
        result.category_name = value.Name;
        result.pic = value.Picture;
        result.parent_id = value.ParentID;
        result.brands = value.BrandIDs.join(',');
        result.suppliers = value.ProviderIDs.join(',');
        return result;
    }
}
