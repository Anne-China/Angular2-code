import { Component, Optional, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { PhoneApp } from '../../../../data-adapters/system';
import { FileUploaderComponent, AddingFileFailedEvent, FileUploadResult } from '../../../../utils/index';
import { Passport } from '../../../../framework/security/passport';
import { ApiHosts } from '../../../../data-adapters/api.config';
import { GlobalDicts } from '../../../../data-adapters/app.dicts';

@Component({
    templateUrl: 'edit.component.html'
})

export class PhoneAppEditComponent implements AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<PhoneAppEditComponent>,
        public passport: Passport,
        public snackBar: MdSnackBar,
        @Optional() @Inject(MD_DIALOG_DATA) private data: any
    ) {
        if (data != null) {
            Object.assign(this.phoneApp, data);
        }
    }

    public phoneApp: PhoneApp = {};

    public get dicts() {
        return GlobalDicts.System.PhoneApp;
    }
    @ViewChild(NgForm) public phoneAppEditForm: NgForm;
    public save() {
        if (this.phoneAppEditForm.invalid) {
            return;
        }
        const time = new Date();
        const date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
            + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
        this.phoneApp.Time = JSON.stringify(date);
        this.dialogRef.close(this.phoneApp);
    }

    public get uploadUrl() {
        return ApiHosts.phoneAppUploadUrl;
    }

    public get uploadAdditonalParameter() {
        return { user_id: this.passport.Current.ID };
    }

    @ViewChild(FileUploaderComponent) public uploader: FileUploaderComponent;

    public ngAfterViewInit() {
        this.uploader.onAddingFileFailed.subscribe((e: AddingFileFailedEvent) => {
            this.snackBar.open(e.defaultMessage, null, { duration: 2000 });
        });
        this.uploader.onRemoveUploadedFile.subscribe((e: FileUploadResult) => {
            this.phoneApp.UpdatePath = null;
        });
        this.uploader.onAllSuccess.subscribe((e: FileUploadResult) => {
            if (e == null) {
                this.phoneApp.UpdatePath = null;
            } else {
                this.phoneApp.UpdatePath = e.url;
            }
        });
    }
}
