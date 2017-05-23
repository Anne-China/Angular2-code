import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'project-product-edit',
    templateUrl: 'edit.component.html'
})

export class ProductSelectorComponent {
    constructor(
        public dialogRef: MdDialogRef<ProductSelectorComponent>,
        @Optional() @Inject(MD_DIALOG_DATA) private data: number) {
        if (data != null) {
            this.quantity = data;
        }
    }

    public quantity = 1;
    @ViewChild(NgForm) public quantityEditForm: NgForm;
    public save() {
        if (this.quantityEditForm.invalid) {
            return;
        }
        this.dialogRef.close(this.quantity);
    }
}
