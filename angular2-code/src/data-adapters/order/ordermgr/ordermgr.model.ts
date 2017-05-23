/** 订单管理模型 */
export interface OrderMgr {
  /** 客户编号 */
  MxcomeId?: number;
  /** 客户姓名 */
  Name?: string;
  /** 预付款 */
  AdvancePay?: number;
  /** 支付方式编号 */
  PayWayId?: number;
  /** 支付方式 */
  PayWay?: string;
  /** 状态 */
  Status?: number;
  /** 创建订单时间 */
  CreateTime?: string;
  /** 订单编号 */
  OrderId?: number;
  /** 套餐id */
  PlanId?: number;
  /** 套餐名称 */
  PlanName?: string;
  /** 创建工程后的工程id */
  Pid?: string;
}
