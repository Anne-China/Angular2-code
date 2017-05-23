import { Injectable } from '@angular/core';
import { Material } from './material.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';
import { StaticHosts } from '../../api.config';
import { GlobalDicts } from '../../app.dicts';

@Injectable()
export class MaterialAdapter {
    public fromQueryMaterials(response: any): { total: number, data: Material[] } {
        const result: Material[] = [];
        for (const res of response.res) {
            if (res != null) {
                result.push(this.convertMaterial(res));
            }
        }
        return { total: response.rows, data: result };
    }

    public toQueryMaterialParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['product_name'] = value.filter['Name'];
            params.filter['category'] = value.filter['CategoryID'];
        }
        return params;
    }

    public toAddMaterial(value: Material) {
        return value == null ? {} : {
            product_name: value.Name,
            actual_price: value.ActualPrice,
            speci_model: JSON.stringify(value.Specification),
            category: value.CategoryID,
            gysid: value.ProviderID,
            brand: value.BrandID,
            details: value.Details,
            price: value.Price,
            show_price: value.ShowPrice,
            pics: value.Picture,
            thumbnail: value.Thumbnail,
            cdi: value.Origin,
            stock: value.Stock,
            color: value.Color,
            tag: value.TagId
        };
    }

    private convertMaterial(res: any) {
        const material: Material = {
            ActualPrice: res.actual_price,
            AddTime: res.add_time == null ? null : new Date(res.add_time),
            BrandID: res.brand,
            CategoryID: res.category,
            Origin: res.cdi,
            Color: res.color,
            Details: res.details,
            ProviderID: res.gysid,
            Picture: StaticHosts.GetRes(res.pics),
            Price: res.price,
            ID: res.product_id,
            Name: res.product_name,
            QRCode: res.qr_code,
            Sales: res.sales,
            ShowPrice: res.show_price,
            StateID: res.state,
            Stock: res.stock,
            Thumbnail: StaticHosts.GetRes(res.thumbnail),
            TagId: res.tag,
            Tag: GlobalDicts.Material.Brands.Tags[res.tag],
        };
        if (res.speci_model != null) {
            try {
                material.Specification = JSON.parse(res.speci_model);
            } catch (error) {
                material.Specification = [res.speci_model];
            }
        }
        const state = GlobalDicts.Material.State[material.StateID];
        material.State = state == null ? material.StateID : state;
        return material;
    }
}
