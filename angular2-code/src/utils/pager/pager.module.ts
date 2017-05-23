import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagerComponent } from './pager.component';
import { CustomPipesModule } from '../pipes';
import { DropdownModule } from '../dropdown';

/**
 * 分页模块
 *
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    imports: [
        CommonModule,
        CustomPipesModule,
        DropdownModule,
        FormsModule
    ],
    declarations: [
        PagerComponent,
    ],
    exports: [
        PagerComponent,
    ]
})
export class PagerModule { }
