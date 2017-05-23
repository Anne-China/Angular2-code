import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Provider } from '../../../../data-adapters/material';
import { NgForm } from '@angular/forms';
import { GlobalDicts } from '../../../../data-adapters/app.dicts';

@Component({
    selector: 'materail-provider-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss']
})
export class ProviderEditComponent {
    constructor(
        public dialogRef: MdDialogRef<ProviderEditComponent>,
        @Optional() @Inject(MD_DIALOG_DATA) private data: any) {
        if (data != null) {
            Object.assign(this.editData, data);
        }
    }

    public editData: Provider = {};

    public get dicts() {
        return GlobalDicts.Material.Provider;
    }

    @ViewChild(NgForm) public editForm: NgForm;
    public save() {
        if (this.editForm.invalid) {
            return;
        }
        this.dialogRef.close(this.editData);
    }
}
