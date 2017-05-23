import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import {
    FileUploaderComponent,
    AddingFileFailedEvent,
    FileUploadResult
} from '../../../../utils';
import { Passport } from '../../../../framework';
import { ApiHosts } from '../../../../data-adapters/api.config';
import { PhotoService, Photo } from '../../../../data-adapters/material';

@Component({
    templateUrl: 'photo.component.html',
    styleUrls: ['photo.component.scss']
})

export class PhotoComponent {
    public del = false;
    public add = false;
    public photo: Photo = {};
    constructor(
        public dialog: MdDialog,
        public dialogRef: MdDialogRef<PhotoComponent>,
        public snackBar: MdSnackBar,
        public srv: PhotoService,
        public passport: Passport,
        @Inject(MD_DIALOG_DATA) public data: any
    ) { }

    public get uploadUrl() {
        return ApiHosts.commonUploadUrl;
    }

    public get uploadAdditonalParameter() {
        return { user_id: this.passport.Current.ID };
    }

    @ViewChild(FileUploaderComponent) public uploader: FileUploaderComponent;
    @ViewChild(NgForm) public addPhotoForm: NgForm;

    public save() {
        if (this.addPhotoForm.invalid) {
            return;
        }
        console.log(this.photo.Pictures);
    }

    public addPhoto() {
        this.add = true;
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

    public delPhoto(id: string, pict: string) {
        this.srv.delPhoto(id, pict.substring(32)).subscribe(() => {
            this.snackBar.open(`删除广告成功`, null, { duration: 1000});
        });
    }
}
