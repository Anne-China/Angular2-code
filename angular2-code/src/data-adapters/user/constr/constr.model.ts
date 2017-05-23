import { UserConstrCert } from './constr-cert.model';

/** 施工端用户模型 */
export interface UserConstr {
    /** 用户编号 */
    ID?: string;
    /** 昵称 */
    Nickname?: string;
    /** 姓名 */
    Name?: string;
    /** 手机 */
    Phone?: string;
    /** 性别 */
    Sex?: string;
    /** 头像地址 */
    Avatar?: string;
    /** 用户类型编号 */
    TypeID?: number;
    /** 用户类型 */
    Type?: string;
    /** 注册时间时间戳 */
    CreateTimestamp?: number;
    /** 注册时间 */
    CreateTime?: Date;
    /** 认证资料 */
    CertInfo?: UserConstrCert;
    /** 认证状态编号 */
    CertStatusID?: number;
    /** 认证状态 */
    CertStatus?: string;
    /** 培训状态编号 */
    TrainingStatusID?: number;
    /** 认证状态 */
    TrainingStatus?: string;
}
