import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'project-product-del',
    templateUrl: 'del.component.html'
})
export class ProductDeleteComponent {
    constructor(
        public dialogRef: MdDialogRef<ProductDeleteComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    public del() {
        this.dialogRef.close(true);
    }
}
