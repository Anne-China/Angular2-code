import { Injectable } from '@angular/core';
import { StaticHosts } from '../../../api.config';
import { Photo, AdvertiseLocation, Product } from './photo.model';
import { Brand } from '../../brands';

@Injectable()
export class PhotoAdapter {
    public fromQueryPhoto(response: any): { total: number, data: Photo[] } {
        const result: Photo[] = [];
        for (const res of response) {
            if (res != null) {
                const user: Photo = {
                    Number: res.order_str,
                    Id: res.advert_id,
                    Name: res.shop_name,
                    Pictures: [],
                    BrandId: res.brand_id,
                    BrandName: res.brand_name,
                    ProductId: res.produc_id,
                    Location: res.push_tion
                };
                if (res.advert_pics != null && res.advert_pics.length > 0) {
                    const pics = JSON.parse(res.advert_pics);
                    const a: string[] = [];
                    for (const arr of pics) {
                        const s = StaticHosts.GetRes(arr);
                        a.push(s);
                    }
                    user.Pictures = a;
                }
                result.push(user);
            }
        }
        return { total: response.length, data: result };
    }

    public fromQueryAdvertiseLocation(response: any): { total: number, data: AdvertiseLocation[] } {
        const result: AdvertiseLocation[] = [];
        for (const res of response) {
            if (res != null) {
                const user: AdvertiseLocation = {
                    ID: res.item_id,
                    Location: res.item_name
                };
                result.push(user);
            }
        }
        return { total: response.length, data: result };
    }

    public fromQueryProductId(response: any): { total: number, data: Product[] } {
        const result: Product[] = [];
        for (const res of response.res) {
            if (res != null) {
                const user: Product = {
                    ID: res.product_id,
                    Name: res.product_name,
                    Categories: res.category
                };
                result.push(user);
            }
        }
        return { total: response.rows, data: result };
    }

    public fromQueryBrandsById(response: any): { total: number, data: Brand[] } {
        const result: Brand[] = [];
        for (const res of response) {
            if (res != null) {
                const user: Brand = {
                     ID: res.brand_id,
                     Name: res.brand_name
                };
                result.push(user);
            }
        }
        return { total: response.length, data: result };
    }

    public toAddAdvertise(value: Photo) {
        return value == null ? {} : {
                order_str: value.Number,
                shop_name: value.Name,
                advert_pics: value.Pictures.join(','),
                brand_id: value.BrandId,
                produc_id: value.ProductId,
                item_id: value.Location
            };
    }
}
