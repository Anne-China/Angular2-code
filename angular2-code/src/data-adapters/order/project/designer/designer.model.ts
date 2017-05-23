/** 查询设计师 */
export interface Designer {
    /** 设计师工号 */
    MxcomeId?: number;
    /** 设计师编号 */
    DesignerId?: number;
    /** 姓名 */
    DesignerName?: string;
    /** 性别 */
    Sex?: string;
    /** 年龄 */
    Age?: string;
    /** 图片 */
    Pictures?: string;
    /** 设计师地址 */
    Address?: string;
    /** 昵称 */
    NickName?: string;
    /** 设计师评分 */
    Score?: number;
    /** 设计师接单量 */
    OrderNumber?: number;
    /** 设计师所在单位 */
    Unit?: string;
    /** 设计师代表作品 */
    Works?: string;
}
