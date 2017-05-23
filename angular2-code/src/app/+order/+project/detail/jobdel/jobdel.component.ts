import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'project-job-del',
    templateUrl: 'jobdel.component.html'
})
export class JobDeleteComponent {
    constructor(
        public dialogRef: MdDialogRef<JobDeleteComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    public del() {
        this.dialogRef.close(true);
    }
}
