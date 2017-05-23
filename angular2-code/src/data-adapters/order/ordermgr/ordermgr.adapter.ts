import { Injectable } from '@angular/core';
import { DataLoaderParameter } from '../../../utils';
import { OrderMgr } from './ordermgr.model';
import { GlobalDicts } from '../../app.dicts';

@Injectable()
export class OrderMgrAdapter {
    public fromQueryOrder(response: any): { total: number, data: OrderMgr[] } {
        const result: OrderMgr[] = [];
        for (const res of response) {
            if (res != null) {
                const user: OrderMgr = {
                    MxcomeId: res.mxcome_no,
                    Name: res.user_name,
                    AdvancePay: res.advance_payment,
                    PayWayId: res.pay_way,
                    PayWay: GlobalDicts.Client.Order.PayWay[res.pay_way],
                    Status: res.statu,
                    CreateTime: res.create_time,
                    OrderId: res.order_id,
                    PlanId: res.plan_id,
                    PlanName: res.plan_name,
                    Pid: res.pid
                };
                result.push(user);
            }
        }
        return { total: response.length, data: result };
    }
    public toQueryOrder(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['user_name'] = value.filter['Name'];
        }
        return params;
    }
}
