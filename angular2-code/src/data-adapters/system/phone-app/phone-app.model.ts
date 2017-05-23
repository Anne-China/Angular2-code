/** app管理模型 */
export interface PhoneApp {
    /** 版本号 */
    VersionNumber?: string;
    /** 版本id */
    VersionId?: number;
    /** 更新地址 */
    UpdatePath?: string;
    /** 发布时间 */
    Time?: string;
    /** 更新量 */
    UpdateNumber?: number;
    /** 终端类型id */
    TypeId?: number;
    /** 终端类型 */
    Type?: string;
}