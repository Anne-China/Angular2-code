import { Injectable } from '@angular/core';
import { AppointDesigner } from './appoint-designer.model';

@Injectable()
export class AppointDesignerAdapter {
    public toAppointDesigner(value: AppointDesigner) {
        return value == null ? {} : {
            sj_id: value.DesignerId,
            sj_mxno: value.MxcomeId,
            pr_id: value.ProjectId
        };
    }
}
