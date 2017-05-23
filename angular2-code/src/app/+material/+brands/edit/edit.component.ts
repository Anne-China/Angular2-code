import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { Brand, ProviderService } from '../../../../data-adapters/material';
import { NgForm } from '@angular/forms';
import {
    DataLoaderParameter,
    FileUploaderComponent,
    AddingFileFailedEvent,
    FileUploadResult
} from '../../../../utils/index';
import { Passport } from '../../../../framework/security/passport';
import { ApiHosts } from '../../../../data-adapters/api.config';
import { GlobalDicts } from '../../../../data-adapters/app.dicts';

@Component({
    selector: 'material-brands-edit',
    templateUrl: 'edit.component.html'
})

export class BrandEditComponent implements AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<BrandEditComponent>,
        private passport: Passport,
        private snackBar: MdSnackBar,
        private providerSrv: ProviderService,
        @Optional() @Inject(MD_DIALOG_DATA) private data: any) {
        if (data != null) {
            this.editObj = JSON.parse(JSON.stringify(data));
        }
    }

    public get uploadUrl() {
        return ApiHosts.commonUploadUrl;
    }

    public get uploadAdditonalParameter() {
        return { user_id: this.passport.Current.ID };
    }

    public editObj: Brand = {};
    @ViewChild(NgForm) public brandEditForm: NgForm;
    public save() {
        if (this.brandEditForm.invalid) {
            return;
        }
        this.dialogRef.close(this.editObj);
    }

    public providersLoader = (parameter: DataLoaderParameter) => {
        return this.providerSrv.queryProviders(parameter).map((res) => res.data);
    }

    @ViewChild(FileUploaderComponent) public uploader: FileUploaderComponent;

    public ngAfterViewInit() {
        this.uploader.onAddingFileFailed.subscribe((e: AddingFileFailedEvent) => {
            this.snackBar.open(e.defaultMessage, null, { duration: 2000 });
        });
        this.uploader.onRemoveUploadedFile.subscribe((e: FileUploadResult) => {
            this.editObj.Logo = null;
        });
        this.uploader.onAllSuccess.subscribe((e: FileUploadResult) => {
            if (e == null) {
                this.editObj.Logo = null;
            } else {
                this.editObj.Logo = e.url;
            }
        });
    }

    public get tags() { return GlobalDicts.Material.Brands.Tags; }
}
