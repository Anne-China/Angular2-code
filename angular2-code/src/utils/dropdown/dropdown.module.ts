import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { DropdownComponent } from './dropdown.component';

/**
 * Dropdown模块
 *
 * @say 这只是一条注释，不是别的，不要多想……
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    declarations: [
        DropdownComponent
    ],
    imports: [CommonModule, FormsModule, MdSelectModule],
    exports: [
        DropdownComponent
    ]
})
export class DropdownModule { }
