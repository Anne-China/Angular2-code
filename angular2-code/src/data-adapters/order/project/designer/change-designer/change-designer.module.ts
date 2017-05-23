import { NgModule } from '@angular/core';
import { ChangeDesignerAdapter } from './change-designer.adapter';
import { ChangeDesignerService } from './change-designer.service';

@NgModule({
    providers: [
        ChangeDesignerAdapter,
        ChangeDesignerService
    ]
})
export class ChangeDesignerAdapterModule {

}
