import { Component, Input, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FileUploader, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { FileLikeObject } from 'ng2-file-upload/file-upload/file-like-object.class';
import { Mimes } from '../mines';
import { ConvertBoolean, ConvertInt, IsBlank, GetType } from '../func';
import { AddingFileFailedType } from './adding-file-failed-type';
import { AddingFileFailedEvent } from './adding-file-failed-event';
import { FileUploadResult } from './file-upload-result';
import { FileUploadResultType } from './file-upload-result-type';

@Component({
    selector: 'file-uploader',
    templateUrl: 'file-uploader.component.html',
    styleUrls: ['file-uploader.component.scss'],
    exportAs: 'fileUploader'
})
export class FileUploaderComponent implements OnInit {
    private _disabled = false;
    private _autoUpload = false;
    private _maxFileSize = 1024 * 1024;
    private _queueLimit = 1;
    private _url: string;
    private _allowedExtensions: string[];
    private _allowedMimes: string[];
    private _name = 'FileUploadr';
    private _canSelect = true;
    private _canDrop = true;
    private _dropZoneText = '请将文件拖动到此处';
    private _buttonText = '选择文件';
    private _selectZoneWidth = 300;
    private _additionalParameter: { [key: string]: any };
    private _itemAlias = 'file';
    public uploader: FileUploader;
    public isDropZoneOver = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    /** 是否禁用 */
    set disabled(value) {
        this._disabled = ConvertBoolean(value);
    }

    get autoUpload(): boolean {
        return this._autoUpload;
    }
    /** 是否自动上传 */
    @Input('auto-upload')
    set autoUpload(value) {
        this._autoUpload = ConvertBoolean(value);
    }

    get maxFileSize(): number {
        return this._maxFileSize;
    }
    /** 文件大小限制，单位字节，默认1048576(1M) */
    @Input('max-file-size')
    set maxFileSize(value) {
        const nv = ConvertInt(value);
        if (!isNaN(nv) && nv > 0) {
            this._maxFileSize = nv;
        }
    }

    get queueLimit(): number {
        return this._queueLimit;
    }
    /** 上传队列限制，默认1个 */
    @Input('queue-limit')
    set queueLimit(value) {
        const nv = ConvertInt(value);
        if (!isNaN(nv) && nv > 0) {
            this._queueLimit = nv;
        }
    }

    get allowedExtensions(): string[] {
        return this._allowedExtensions;
    }
    /** 上传扩展名限制 */
    @Input('allowed-exts')
    set allowedExtensions(value) {
        if (value == null) {
            return;
        }
        const tv = GetType(value);
        const exts: string[] = [];
        const mimes: string[] = [];
        if (tv === 'array') {
            for (let ext of value) {
                if (!IsBlank(ext)) {
                    ext = `${ext}`.trim().toLowerCase();
                    if (ext.startsWith('.')) {
                        ext = ext.substr(1);
                    }
                    const mime = Mimes[ext];
                    if (mime != null) {
                        exts.push(ext);
                        mimes.push(mime);
                    }
                }
            }
        } else if (tv === 'string') {
            const str = `${value}`;
            if (IsBlank(str)) {
                return;
            }
            const extArr = str.split(',');
            for (let ext of extArr) {
                if (!IsBlank(ext)) {
                    ext = `${ext}`.trim().toLowerCase();
                    if (ext.startsWith('.')) {
                        ext = ext.substr(1);
                    }
                    const mime = Mimes[ext];
                    if (mime != null) {
                        exts.push(ext);
                        mimes.push(mime);
                    }
                }
            }
        }
        if (exts.length === 0) {
            return;
        }
        this._allowedExtensions = exts;
        this._allowedMimes = mimes;
    }

    get url() {
        return this._url;
    }
    /** 上传路径 */
    @Input()
    set url(value: string) {
        if (!IsBlank(value)) {
            this._url = value.trim();
        }
    }

    get name() {
        return this._name;
    }
    /** 表单控件名称 */
    @Input()
    set name(value: string) {
        if (!IsBlank(value)) {
            this._name = value.trim();
        }
    }

    get selectType() {
        return this._canDrop && this._canSelect ? 'drop|select' : (this._canDrop ? 'drop' : 'select');
    }
    /** 文件选择方式，可选项：drop(拖动)、select(点击按钮选择), drop|select(拖动与按钮皆可)，默认drop|select */
    @Input('select-type')
    set selectType(value: string) {
        if (!IsBlank(value)) {
            value = value.trim().toLowerCase();
            if (['drop', 'select', 'drop|select'].indexOf(value) >= 0) {
                this._canDrop = value.indexOf('drop') >= 0;
                this._canSelect = value.indexOf('select') >= 0;
            }
        }
    }
    get canDrop() { return this._canDrop; }
    get canSelect() { return this._canSelect; }

    get dropZoneText() {
        return this._dropZoneText;
    }
    /** 拖动区域说明文本，默认：请将文件拖动到此处 */
    @Input('drop-zone-text')
    set dropZoneText(value: string) {
        if (!IsBlank(value)) {
            this._dropZoneText = value.trim();
        }
    }

    get selectZoneWidth(): number {
        return this._selectZoneWidth;
    }
    /** 选择区域宽度，包括拖动区域及按钮，单位像素，默认300 */
    @Input('select-zone-width')
    set selectZoneWidth(value) {
        const nv = ConvertInt(value);
        if (!isNaN(nv) && nv > 0) {
            this._selectZoneWidth = nv;
        }
    }

    get buttonText() {
        return this._buttonText;
    }
    /** 按钮文本，默认：选择文件 */
    @Input('btn-text')
    set buttonText(value: string) {
        if (!IsBlank(value)) {
            this._buttonText = value.trim();
        }
    }

    get additionalParameter() {
        return this._additionalParameter;
    }
    /** 按钮文本，默认：选择文件 */
    @Input('additional-params')
    set additionalParameter(value) {
        if (value != null && GetType(value) === 'object') {
            this._additionalParameter = value;
        }
    }

    get itemAlias() {
        return this._itemAlias;
    }
    /** 上传文件字段名，默认：file */
    @Input('item-alias')
    set itemAlias(value: string) {
        if (!IsBlank(value)) {
            this._itemAlias = value.trim();
        }
    }

    get isUploading() { return this.uploader.isUploading; }
    public isAllComplete = true;

    public ngOnInit() {
        this.uploader = new FileUploader({
            url: this.url,
            disableMultipart: false,
            autoUpload: this.autoUpload,
            maxFileSize: this.maxFileSize,
            queueLimit: this.queueLimit,
            allowedMimeType: this._allowedMimes,
            isHTML5: true,
            additionalParameter: this._additionalParameter,
            itemAlias: this.itemAlias
        });
        this.uploader.onAfterAddingFile = this.onAfterAddingFileItem;
        this.uploader.onCancelItem = this.onItemCancel;
        this.uploader.onErrorItem = this.onItemError;
        this.uploader.onSuccessItem = this.onSuccessItem;
        this.uploader.onCompleteAll = this.onCompleteAll;
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
    }

    public onAddingFileFailed = new EventEmitter<AddingFileFailedEvent>();
    public onAllSuccess = new EventEmitter<FileUploadResult | FileUploadResult[]>();
    public onRemoveUploadedFile = new EventEmitter<FileUploadResult>();
    public startUpload() {
        if (this.autoUpload) {
            return;
        }
        this.uploader.uploadAll();
    }

    public fileDropOver(e: any): void {
        this.isDropZoneOver = e;
    }

    public getProgressBarColor(item: FileItem) {
        if (item.isCancel) {
            return 'accent';
        }
        if (item.isError) {
            return 'warn';
        }
        return 'primay';
    }

    public removeItem(item: FileItem) {
        for (let i = 0; i < this.uploadResult.length; i++) {
            const result = this.uploadResult[i];
            if (result.file === item) {
                if (result.status === FileUploadResultType.Success && this.isAllComplete) {
                    this.onRemoveUploadedFile.emit(result);
                }
                this.uploadResult.splice(i, 1);
                break;
            }
        }
        item.remove();
        if (this.uploadResult.length === 0) {
            this.isAllComplete = true;
        }
        this.onCompleteAll();
    }

    public getFileSizeDisplay(size: number) {
        if (size == null || GetType(size) !== 'number') {
            return null;
        }
        if (size < 1024) {
            return `${size} B`;
        }
        const npipe = new DecimalPipe('zh-CN');
        if (size >= 1024 * 1024 * 1024) {
            return `${npipe.transform(size / 1024 / 1024 / 1024, '.2-2')} GB`;
        }
        if (size >= 1024 * 1024) {
            return `${npipe.transform(size / 1024 / 1024, '.2-2')} MB`;
        }
        if (size >= 1024) {
            return `${npipe.transform(size / 1024, '.2-2')} KB`;
        }
    }

    @ViewChild('selectZone') public selectZoneRef: ElementRef;
    private clearInputSelect() {
        if (this.selectZoneRef == null) {
            return;
        }
        let zoneEl = this.selectZoneRef.nativeElement as Element;
        zoneEl = zoneEl.lastElementChild;
        if (zoneEl != null && zoneEl.classList != null && zoneEl.classList.contains('btn-zone')) {
            zoneEl = zoneEl.firstElementChild;
            const input = zoneEl.lastElementChild as HTMLInputElement;
            input.value = '';
        }
    }

    private uploadResult: FileUploadResult[] = [];

    private onAfterAddingFileItem = (item: FileItem) => {
        this.isAllComplete = false;
        for (const result of this.uploadResult) {
            if (result.file === item) {
                result.url = null;
                result.status = FileUploadResultType.NotUpload;
                return;
            }
        }
        this.uploadResult.push({ file: item, url: null, status: FileUploadResultType.NotUpload });
        this.clearInputSelect();
    }

    private onItemCancel = (item: FileItem) => {
        for (const result of this.uploadResult) {
            if (result.file === item) {
                result.url = null;
                result.status = FileUploadResultType.Canceled;
                return;
            }
        }
        this.uploadResult.push({ file: item, url: null, status: FileUploadResultType.Canceled });
    }

    private onItemError = (item: FileItem, response: string) => {
        for (const result of this.uploadResult) {
            if (result.file === item) {
                result.url = response;
                result.status = FileUploadResultType.Error;
                return;
            }
        }
        this.uploadResult.push({ file: item, url: null, status: FileUploadResultType.Error });
    }

    private onSuccessItem = (item: FileItem, response: string) => {
        let url: string;
        try {
            const json = JSON.parse(response);
            if (json.return_code != null && json.return_code === 1) {
                url = json.res.head_img || json.res.fileId;
            } else {
                item.isError = true;
                if (json.return_code != null) {
                    this.onItemError(item, JSON.stringify(json.error));
                } else {
                    this.onItemError(item, response);
                }
                return;
            }
        } catch (error) {
            item.isError = true;
            this.onItemError(item, response);
            return;
        }
        for (const result of this.uploadResult) {
            if (result.file === item) {
                result.url = url;
                result.status = FileUploadResultType.Success;
                return;
            }
        }
        this.uploadResult.push({ file: item, url, status: FileUploadResultType.Success });
    }

    private onCompleteAll = () => {
        for (const result of this.uploadResult) {
            if (result.status !== FileUploadResultType.Success) {
                return;
            }
        }
        this.isAllComplete = true;
        this.onAllSuccess.emit(this.queueLimit === 1 ? this.uploadResult[0] : this.uploadResult);
    }

    private onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
        this.clearInputSelect();
        let message: string;
        let type: AddingFileFailedType;
        switch (filter.name) {
            case 'queueLimit':
                type = AddingFileFailedType.QueueLimit;
                message = `上传数量限制，仅允许上传 ${options.queueLimit} 个文件。`;
                break;
            case 'mimeType':
                type = AddingFileFailedType.ExtensionLimit;
                message = `不允许上传此类型文件。`;
                break;
            case 'fileSize':
                type = AddingFileFailedType.SizeLimit;
                message = `文件大小限制，仅允许上传小于 ${this.getFileSizeDisplay(item.size)} 的文件。`;
                break;
            default:
                type = AddingFileFailedType.Unknown;
                message = '上传文件失败。';
                break;
        }
        const event: AddingFileFailedEvent = {
            file: {
                name: item.name,
                size: item.size,
                mime: item.type,
                displaySize: this.getFileSizeDisplay(item.size)
            },
            type,
            options: {
                queueLimit: this.queueLimit,
                sizeLimit: this.maxFileSize,
                allowedExtensions: this.allowedExtensions
            },
            defaultMessage: message
        };
        this.onAddingFileFailed.emit(event);
    }
}
