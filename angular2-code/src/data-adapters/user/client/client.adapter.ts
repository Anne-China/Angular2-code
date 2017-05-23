import { Injectable } from '@angular/core';
import { UserClient } from './client.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';

@Injectable()
export class UserClientAdapter {
    public fromQueryUsers(response: any): { total: number, data: UserClient[] } {
        const result: UserClient[] = [];
        for (const res of response.res) {
            if (res != null) {
                const user: UserClient = {
                    ID: res.user_id,
                    MxcomeID: res.mxcome_no,
                    Name: res.user_name,
                    Sex: res.sex,
                    Age: res.age,
                    Area: res.area_id,
                    Avatar: res.pic,
                    Email: res.email,
                    Phone: res.tel,
                };
                result.push(user);
            }
        }
        return { total: response.rows, data: result };
    }

    public toQueryClientParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['tel'] = value.filter['Phone'];
            params.filter['mxcome_no'] = value.filter['MxcomeID'];
        }
        return params;
    }
}
