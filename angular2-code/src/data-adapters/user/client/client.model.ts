export interface UserClient {
    /** 用户编号 */
    ID?: number;
    /** mxcome 编号 */
    MxcomeID?: string;
    /** 用户姓名 */
    Name?: string;
    /** 性别 */
    Sex?: string;
    /** 年龄 */
    Age?: number;
    /** 头像 */
    Avatar?: string;
    /** 地址 */
    Area?: string;
    /** 邮箱 */
    Email?: string;
    /** 手机 */
    Phone?: number;
}
