import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { IsBlank } from '../../../utils/func';

@Component({
    selector: 'ajax-ex-string-dialog',
    templateUrl: 'ajax-ex-string.component.html'
})
export class AjaxExStringComponent {
    constructor(
        public dialogRef: MdDialogRef<AjaxExStringComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) {
        if (IsBlank(this.data)) {
            this.data = null;
        }
    }
}
