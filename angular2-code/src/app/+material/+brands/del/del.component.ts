import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'materail-brand-del',
    templateUrl: 'del.component.html'
})
export class BrandDeleteComponent {
    constructor(
        public dialogRef: MdDialogRef<BrandDeleteComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    public del() {
        this.dialogRef.close(true);
    }
}
