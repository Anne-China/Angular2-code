import { Injectable } from '@angular/core';
import { PhoneApp } from './phone-app.model';
import { GlobalDicts } from '../../app.dicts';
import { DataLoaderParameter } from '../../../utils';
@Injectable()
export class PhoneAppAdapter {
    public fromQueryPhoneApp(response: any): {total: number, data: PhoneApp[]} {
        const result: PhoneApp[] = [];
        for (const res of response) {
            if (res != null) {
                const user: PhoneApp = {
                    VersionNumber: res.ver_no,
                    VersionId: res.ver_id,
                    UpdatePath: res.down_path,
                    Time: res.push_time,
                    UpdateNumber: res.update_num,
                    TypeId: res.os_type,
                    Type: GlobalDicts.System.PhoneApp.Type[res.os_type]
                };
                result.push(user);
            }
        }
        return {total: response.length, data: result};
    }
    public toQueryPhoneApp(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['ver_no'] = value.filter['VersionNumber'];
            params.filter['os_type'] = value.filter['TypeId'];
        }
        return params;
    }
    public toAddPhoneApp(value: PhoneApp) {
        return value == null ? {} : {
                ver_no: value.VersionNumber,
                os_type: value.TypeId,
                down_path: value.UpdatePath
            };
    }
}
