import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'materail-provider-del',
    templateUrl: 'del.component.html'
})
export class ProviderDeleteComponent {
    constructor(
        public dialogRef: MdDialogRef<ProviderDeleteComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    public del() {
        this.dialogRef.close(true);
    }
}
