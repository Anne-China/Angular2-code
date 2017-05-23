import { Component, ViewChild, Inject, Optional, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';

import {
    DataLoaderParameter,
    FileUploaderComponent,
    AddingFileFailedEvent,
    FileUploadResult
} from '../../../../../utils';
import { Passport } from '../../../../../framework';
import { ApiHosts } from '../../../../../data-adapters/api.config';
import { Photo, PhotoService, AdvertiseLocation } from '../../../../../data-adapters/material';
import { CategoriesService } from '../../../../../data-adapters/material';

@Component({
    selector: 'material-advertise-photo-add',
    templateUrl: 'add.component.html'
})
export class AddPhotoComponent implements AfterViewInit {
    constructor(
        public passport: Passport,
        public dialogRef: MdDialogRef<AddPhotoComponent>,
        public srv: PhotoService,
        public categoriesService: CategoriesService,
        public snackBar: MdSnackBar,
        @Optional() @Inject(MD_DIALOG_DATA) public data: any) {
            if (data != null) {
                this.photo = JSON.parse(JSON.stringify(data));
            }
    }
    public photo: Photo = {};
    public advertise: AdvertiseLocation;
    public get uploadUrl() {
        return ApiHosts.commonUploadUrl;
    }

    public get uploadAdditonalParameter() {
        return { user_id: this.passport.Current.ID };
    }

    @ViewChild(NgForm) public addAdvertiseForm: NgForm;
    @ViewChild(FileUploaderComponent) public uploader: FileUploaderComponent;

    public save() {
        if (this.addAdvertiseForm.invalid) {
            return;
        }
        const ids: number[] = [];
        for (const item of this.adv) {
            ids.push(item.ID);
        }
        this.photo.Location = JSON.stringify(ids);
        this.dialogRef.close(this.photo);
    }

    public brandsLoader = () => {
        return this.srv.queryBrandsById().map((res) => res.data);
    }
    public advertiseLocationLoader = () => {
        return this.srv.queryAdvertiseLocation().map((res) => res.data);
    }

    public queryCategories = (parameter: DataLoaderParameter) => {
        return this.categoriesService.queryCategories(parameter);
    }
    public ngAfterViewInit() {
        this.uploader.onAddingFileFailed.subscribe((e: AddingFileFailedEvent) => {
            this.snackBar.open(e.defaultMessage, null, { duration: 2000 });
        });
        this.uploader.onRemoveUploadedFile.subscribe((e: FileUploadResult) => {
            this.photo.Pictures = null;
        });
        this.uploader.onAllSuccess.subscribe((e: FileUploadResult[]) => {
            const arr: string[] = [];
            for (const item of e) {
                arr.push(item.url);
            }
            this.photo.Pictures = arr;
        });
    }

    public queryProductId = (parameter: DataLoaderParameter) => {
        return this.srv.queryProductId(parameter, this.photo.categoriesId).map((res) => res.data);
    }

    public adv: AdvertiseLocation[] = [];

    public selectLocation(item: AdvertiseLocation) {
        if (item == null || item instanceof Event) {
            return;
        }
        for (const a of this.adv) {
            if (item.ID === a.ID) {
                return;
            }
        }
        this.adv.push(item);
    }
    public removeLocation(index: number) {
        this.adv.splice(index, 1);
    }

}
