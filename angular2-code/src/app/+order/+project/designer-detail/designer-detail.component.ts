import { Component, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ClientProject } from '../../../../data-adapters/order';

@Component({
    templateUrl: 'designer-detail.component.html',
    styleUrls: ['designer-detail.component.scss']
})

export class DesignerDetailComponent {
    public clientProject: ClientProject = {};
    constructor(
        public dialogRef: MdDialogRef<DesignerDetailComponent>,
        @Optional() @Inject(MD_DIALOG_DATA) private data: any) {
        if (data != null) {
            this.clientProject = JSON.parse(JSON.stringify(data));
        }
    }
}
