import { Injectable } from '@angular/core';
import { Designer } from './designer.model';
import { DataLoaderParameter } from '../../../../utils/dataloader-parameter';

@Injectable()
export class DesignerAdapter {
    public fromQueryDesigner(response: any): { total: number, data: Designer[] } {
        const result: Designer[] = [];
        for (const res of response) {
            if (res != null) {
                const user: Designer = {
                    DesignerId: res.pv_id,
                    MxcomeId: res.mxcome_no,
                    DesignerName: res.user_name,
                    Sex: res.sex,
                    Age: res.age,
                    Pictures: res.pic,
                    Address: res.area_id,
                    NickName: res.nick_name,
                    Score: res.pf,
                    OrderNumber: res.jdl,
                    Unit: res.unit,
                    Works: res.repre_active
                };
                result.push(user);
            }
        }
        return { total: result.length, data: result };
    }

    public toQueryDesignerParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['mxcome_no'] = value.filter['MxcomeId'];
        }
        return params;
    }
}
