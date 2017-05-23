/** 查看广告图片模型 */
export interface Photo {
    /** 排序号 */
    Number?: number;
    /** id */
    Id?: number;
    /** 商家名称 */
    Name?: string;
    /** 图片 */
    Pictures?: string[];
    /** 品牌id */
    BrandId?: number;
    /** 品牌名称 */
    BrandName?: string;
    /** 供应商id */
    ProductId?: number;
    /** 广告位置 */
    Location?: string;
    categoriesId?: string;
}

/** 广告发布位置 */
export interface AdvertiseLocation {
    /** 位置id */
    ID?: number;
    /** 广告位置 */
    Location?: string;
}

/** 产品 */
export interface Product {
    Categories?: string;
    ID?: number;
    Name?: number;
}