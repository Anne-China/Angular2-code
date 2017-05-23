/** 施工端用户认证资料模型 */
export interface UserConstrCert {
    /** 年龄 */
    Age?: number;
    /** 姓名 */
    Name?: string;
    /** 身份证号 */
    CardID?: string;
    /** 性别 */
    Sex?: string;
    /** 工作年限 */
    WorkYears?: number;
    /** 所在城市 */
    Location?: string;
    /** 设计风格编号（设计师专有） */
    StyleIDs?: number[];
    /** 技能编号（工人专有） */
    SkillIDs?: number[];
    /** 设计风格（设计师专有） */
    Styles?: number[];
    /** 技能（工人专有） */
    Skills?: number[];
    /** 未通过认证说明 */
    FailedDescription?: string;
    /** 备用手机 */
    SparePhone?: string;
    /** 用户类型编号 */
    TypeID?: number;
    /** 用户类型 */
    Type?: string;
}
