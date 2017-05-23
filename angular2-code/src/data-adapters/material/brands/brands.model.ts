import { Provider } from '../provider/provider.model';
export interface Brand {
    /** 品牌ID */
    ID?: number;
    /** 品牌名称 */
    Name?: string;
    /** 品牌图片 */
    Logo?: string;
    /** 供应商 */
    Provider?: Provider;
    /** 推荐权重 */
    RecommandWeight?: number;
    /** 热销权重 */
    SellWellWeight?: number;
    /** 品牌档次id */
    TagId?: number;
    /** 品牌档次 */
    Tag?: string;
}
