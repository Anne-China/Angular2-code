import { Injectable } from '@angular/core';
import { ChangeDesigner } from './change-designer.model';

@Injectable()
export class ChangeDesignerAdapter {
    public toChangeDesigner(value: ChangeDesigner) {
        return value == null ? {} : {
            sj_id: value.DesignerId,
            sj_mxno: value.MxcomeId,
            pr_id: value.ProjectId
        };
    }
}
