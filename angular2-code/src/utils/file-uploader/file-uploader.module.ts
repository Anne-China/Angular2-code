import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdProgressBarModule } from '@angular/material';

import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
    imports: [
        FileUploadModule,
        CommonModule,
        MdButtonModule,
        MdProgressBarModule
    ],
    declarations: [
        FileUploaderComponent,
    ],
    exports: [
        FileUploaderComponent,
    ]
})
export class FileUploaderModule { }
