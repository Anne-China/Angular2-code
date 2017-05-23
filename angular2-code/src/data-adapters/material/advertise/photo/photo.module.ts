import { NgModule } from '@angular/core';

import { PhotoAdapter } from './photo.adapter';
import { PhotoService } from './photo.service';

@NgModule({
    providers: [
        PhotoAdapter,
        PhotoService
    ]
})
export class AdvertisePhotoAdapterModule { }
