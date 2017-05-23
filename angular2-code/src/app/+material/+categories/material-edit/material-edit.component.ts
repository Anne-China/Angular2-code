import { Component, Optional, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { Passport } from '../../../../framework/index';
import { BrandsService, ProviderService, Material } from '../../../../data-adapters/material';
import { NgForm, NgModel } from '@angular/forms';
import { ApiHosts } from '../../../../data-adapters/api.config';
import { IsBlank } from '../../../../utils/func';
import {
    FileUploaderComponent,
    DataLoaderParameter,
    AddingFileFailedEvent,
    FileUploadResult
} from '../../../../utils/index';
import { GlobalDicts } from '../../../../data-adapters/app.dicts';

@Component({
    selector: 'material-edit',
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.scss']
})
export class MaterialEditComponent implements AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<MaterialEditComponent>,
        private passport: Passport,
        private snackBar: MdSnackBar,
        private brandsSrv: BrandsService,
        private providerSrv: ProviderService,
        @Optional() @Inject(MD_DIALOG_DATA) public data: any) {
        if (data.material != null) {
            Object.assign(this.editObj, this.data.material);
            this.specification = this.data.material.Specification == null ?
                null : this.data.material.Specification.join('/');
        }
    }

    public editObj: Material = {};
    public specification: string;

    @ViewChild(NgForm) public materialEditForm: NgForm;
    @ViewChild('specificationInput') public specificationInput: NgModel;

    public get uploadUrl() {
        return ApiHosts.commonUploadUrl;
    }

    public get brands() { return this.data.cachedBrands; }
    public get providers() { return this.data.cachedProviders; }
    public get tags() { return GlobalDicts.Material.Brands.Tags; }

    public get uploadAdditonalParameter() {
        return { user_id: this.passport.Current.ID };
    }

    public brandsLoader = (parameter: DataLoaderParameter) => {
        return this.brandsSrv.queryBrands(parameter).map((res) => res.data);
    }

    public providersLoader = (parameter: DataLoaderParameter) => {
        return this.providerSrv.queryProviders(parameter).map((res) => res.data);
    }

    public isUploaderChanged = false;
    public isThumbnailUploaderChanged = false;
    @ViewChild('uploader') public uploader: FileUploaderComponent;
    @ViewChild('thumbnailUploader') public thumbnailUploader: FileUploaderComponent;

    public ngAfterViewInit() {
        this.uploader.onAddingFileFailed.subscribe((e: AddingFileFailedEvent) => {
            this.snackBar.open(e.defaultMessage, null, { duration: 2000 });
        });
        this.uploader.onRemoveUploadedFile.subscribe((e: FileUploadResult) => {
            this.isUploaderChanged = true;
            this.editObj.Picture = null;
        });
        this.uploader.onAllSuccess.subscribe((e: FileUploadResult) => {
            this.isUploaderChanged = true;
            if (e == null) {
                this.editObj.Picture = null;
            } else {
                this.editObj.Picture = e.url;
            }
        });
        this.thumbnailUploader.onAddingFileFailed.subscribe((e: AddingFileFailedEvent) => {
            this.snackBar.open(e.defaultMessage, null, { duration: 2000 });
        });
        this.thumbnailUploader.onRemoveUploadedFile.subscribe((e: FileUploadResult) => {
            this.isThumbnailUploaderChanged = true;
            this.editObj.Thumbnail = null;
        });
        this.thumbnailUploader.onAllSuccess.subscribe((e: FileUploadResult) => {
            this.isThumbnailUploaderChanged = true;
            if (e == null) {
                this.editObj.Thumbnail = null;
            } else {
                this.editObj.Thumbnail = e.url;
            }
        });
        this.specificationInput.valueChanges.subscribe((value: string) => {
            if (IsBlank(value)) {
                this.editObj.Specification = [];
            } else {
                const arr = value.trim().split('/');
                const spces: string[] = [];
                for (const item of arr) {
                    if (!IsBlank(item)) {
                        spces.push(item.trim());
                    }
                }
                this.editObj.Specification = spces;
            }
        });
    }

    public save() {
        if (this.materialEditForm.invalid ||
            this.uploader.isUploading ||
            !this.uploader.isAllComplete ||
            this.editObj.Picture == null ||
            this.thumbnailUploader.isUploading ||
            !this.thumbnailUploader.isAllComplete) {
            return;
        }
        this.dialogRef.close(this.editObj);
    }
}
