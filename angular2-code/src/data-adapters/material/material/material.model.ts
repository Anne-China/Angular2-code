/** 材料模型 */
export interface Material {
    /** 实际价格 */
    ActualPrice?: number;
    /** 添加时间(时间戳) */
    AddTime?: Date;
    /** 品牌ID */
    BrandID?: number;
    /** 品种分类ID */
    CategoryID?: number;
    /** 产地 */
    Origin?: string;
    /** 颜色 */
    Color?: string;
    /** 详情 */
    Details?: string;
    /** 供应商ID */
    ProviderID?: number;
    /** 材料图片Url */
    Picture?: string;
    /** 计算价格 */
    Price?: number;
    /** 材料ID */
    ID?: number;
    /** 材料名称 */
    Name?: string;
    /** 二维码 */
    QRCode?: string;
    /** 销量 */
    Sales?: number;
    /** 显示价格 */
    ShowPrice?: number;
    /** 规格 */
    Specification?: string[];
    /** 审核状态ID */
    StateID?: number;
    /** 审核状态 */
    State?: string;
    /** 库存 */
    Stock?: number;
    /** 缩略图Url */
    Thumbnail?: string;
    /** 产品档次id */
    TagId?: number;
    /** 产品档次 */
    Tag?: string;
}
