import { Injectable } from '@angular/core';
import { Brand } from './brands.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';
import { StaticHosts } from '../../api.config';
import { GlobalDicts } from '../../app.dicts';

@Injectable()
export class BrandsAdapter {
    public fromQueryBrands(response: any): { total: number, data: Brand[] } {
        const result: Brand[] = [];
        for (const res of response.res) {
            if (res != null) {
                result.push(this.converBrand(res));
            }
        }
        return { total: response.rows, data: result };
    }

    public fromQueryBrandByIDs(response: any[]): Brand[] {
        const result: Brand[] = [];
        for (const res of response) {
            if (res != null) {
                result.push(this.converBrand(res));
            }
        }
        return result;
    }

    public toQueryBrandsParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['supplier'] = value.filter['ProviderID'];
            params.filter['brand_name'] = value.filter['Name'];
        }
        return params;
    }

    public toAddBrands(value: Brand) {
        return value == null ? {} : {
            brand_name: value.Name,
            supplier: value.Provider == null ? null : value.Provider.ID,
            brand_pic: value.Logo,
            is_tui: value.RecommandWeight,
            is_hot: value.SellWellWeight,
            tag: value.TagId
        };
    }

    public toEditBrands(value: Brand) {
        return value == null ? {} : {
            sup_id: value.ID,
            ...this.toAddBrands(value)
        };
    }

    private converBrand(res: any) {
        const brand: Brand = {
            ID: res.brand_id,
            Name: res.brand_name,
            Logo: StaticHosts.GetRes(res.brand_pic),
            RecommandWeight: res.is_tui,
            SellWellWeight: res.is_hot,
            TagId: res.tag,
            Tag: GlobalDicts.Material.Brands.Tags[res.tag],
            Provider: { ID: res.supplier, Name: res.sup_name }
        };
        return brand;
    }
}
