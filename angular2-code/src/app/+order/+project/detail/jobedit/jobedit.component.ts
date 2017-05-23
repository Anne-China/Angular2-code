import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { GlobalDicts } from '../../../../../data-adapters/app.dicts';

@Component({
    selector: 'project-job-edit',
    templateUrl: 'jobedit.component.html'
})

export class JobSelectorComponent {
    public get skills() { return GlobalDicts.Construction.User.Skill; }
    constructor(
        public dialogRef: MdDialogRef<JobSelectorComponent>,
        @Optional() @Inject(MD_DIALOG_DATA) private data: number) {
        if (data != null) {
            this.skillID = data;
        }
    }

    public skillID = 0;
    @ViewChild(NgForm) public skillEditForm: NgForm;
    public save() {
        if (this.skillEditForm.invalid) {
            return;
        }
        this.dialogRef.close(this.skillID);
    }
}
