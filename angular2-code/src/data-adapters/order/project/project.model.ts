/** 装修工程列表模型 */
export interface ClientProject {
    /** 工程编号 */
    ID?: string;
    /** 发布人姓名 */
    Publisher?: string;
    /** 发布时间 */
    PublishTime?: string;
    /** 联系人姓名 */
    ContactName?: string;
    /** 联系人性别 */
    ContactGender?: string;
    /** 联系人电话号码 */
    ContactPhone?: number;
    /** 地址详情 */
    Address?: Address;
    /** 房屋详情 */
    HouseInfo?: HouseInfo;
    /** 工程类型编号 */
    TypeID?: number;
    /** 工程类型 */
    Type?: string;
    /** 设计师编号 */
    DesignerID?: number;
    /** 设计师姓名 */
    DesignerName?: string;
}

export interface Address {
    Country?: string;
    Province?: string;
    City?: string;
    District?: string;
    Street?: string;
    Estate?: string;
    Building?: string;
    Unit?: string;
    Floor?: string;
    Doorplate?: string;
    Area?: string;
    Detail?: string;
}

export interface HouseInfo {
    IndoorArea?: number;
    OutdoorArea?: number;
    Hall?: number;
    Kitchen?: number;
    Room?: number;
    Bathroom?: number;
    Garage?: number;
    Detail?: string;
}

export interface Product {
    CategoryName?: string;
    CategoryID?: number;
    BrandName?: string;
    BrandID?: string;
    Stock?: number;
    Name?: string;
    ID?: number;
    Price?: number;
    Specification?: string[];
    Quantity?: number;
}

export interface MxWorker {
    ID?: number;
    MxcomeNO?: number;
    Name?: string;
    NickName?: string;
    Avatar?: string;
    Gender?: string;
    WorkYears?: number;
    GetOrders?: number;
    Score?: number;
    SkillIDs?: number[];
    Skills?: string[];
    JobID?: number;
    Job?: string;
    DpsID?: number;
}

export interface ChoiceItem {
    itemId?: string;
    itemValue?: string;
    ititle?: string;
    desc?: string;
}
