import { Component, Optional, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { Passport } from '../../../../framework/security';
import { BrandsService, ProviderService, Category, Brand, Provider } from '../../../../data-adapters/material';
import { ApiHosts } from '../../../../data-adapters/api.config';
import { DataLoaderParameter, FileUploaderComponent, AddingFileFailedEvent, FileUploadResult } from '../../../../utils';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'material-categories-edit',
    templateUrl: 'category-edit.component.html',
    styleUrls: ['category-edit.component.scss']
})
export class CategoryEditComponent implements AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<CategoryEditComponent>,
        private passport: Passport,
        private snackBar: MdSnackBar,
        private brandsSrv: BrandsService,
        private providerSrv: ProviderService,
        @Optional() @Inject(MD_DIALOG_DATA) private data: any) {
        if (data.category != null) {
            this.editObj.ID = data.category.ID;
            this.editObj.Name = data.category.Name;
            this.editObj.Picture = data.category.Picture;
            this.editObj.BrandIDs = data.category.BrandIDs == null ? [] : [...data.category.BrandIDs];
            this.editObj.ProviderIDs = data.category.ProviderIDs == null ? [] : [...data.category.ProviderIDs];
            this.editObj.ParentID = data.category.ParentID;
        }
    }

    public get parents() {
        return this.data.parentPath;
    }

    public editObj: Category = { BrandIDs: [], ProviderIDs: [] };
    public providerObj: Provider;
    public brandObj: Brand;
    @ViewChild(NgForm) public categoryEditForm: NgForm;

    public get uploadUrl() {
        return ApiHosts.commonUploadUrl;
    }

    public get brands() { return this.data.cachedBrands; }
    public get providers() { return this.data.cachedProviders; }

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

    @ViewChild(FileUploaderComponent) public uploader: FileUploaderComponent;

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
    }

    public selectProvider(provider: Provider) {
        if (provider == null || this.editObj.ProviderIDs.indexOf(provider.ID) >= 0) {
            setTimeout(() => this.providerObj = null);
            return;
        }
        this.editObj.ProviderIDs.push(provider.ID);
        if (this.data.cachedProviders[provider.ID] == null) {
            this.data.cachedProviders[provider.ID] = provider;
        }
        setTimeout(() => this.providerObj = null);
    }

    public selectBrand(brand: Brand) {
        if (brand == null || this.editObj.BrandIDs.indexOf(brand.ID) >= 0) {
            setTimeout(() => this.brandObj = null);
            return;
        }
        this.editObj.BrandIDs.push(brand.ID);
        if (this.data.cachedBrands[brand.ID] == null) {
            this.data.cachedBrands[brand.ID] = brand;
        }
        setTimeout(() => this.brandObj = null);
        console.log(brand);
    }

    public removeProvider(index: number) {
        this.editObj.ProviderIDs.splice(index, 1);
    }

    public removeBrand(index: number) {
        this.editObj.BrandIDs.splice(index, 1);
    }

    public save() {
        if (this.categoryEditForm.invalid || this.editObj.Picture == null) {
            return;
        }
        this.dialogRef.close(this.editObj);
    }
}
