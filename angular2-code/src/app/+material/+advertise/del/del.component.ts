import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'advertise-del',
    templateUrl: 'del.component.html'
})
export class DelComponent {
    constructor(
        public dialogRef: MdDialogRef<DelComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    public del() {
        this.dialogRef.close(true);
    }
}
