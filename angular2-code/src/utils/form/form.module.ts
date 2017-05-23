import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormCtrlDirective } from './form-ctrl.directive';
import { FormDirective } from './form.directive';
import { LabelDirective } from './label.directive';
import { InputDirective } from './input.directive';
import { ValidationDirective } from './validation/validation.directive';
import { ValidateMessageDirective } from './validation/validation-message.directive';

/**
 * 自定义表单模块
 *
 * @say 这只是一条注释，不是别的，不要多想……
 * @author alfadb
 * @created 2017-03-17
 */
@NgModule({
    declarations: [
        FormCtrlDirective,
        FormDirective,
        LabelDirective,
        InputDirective,
        ValidationDirective,
        ValidateMessageDirective
    ],
    imports: [CommonModule, FormsModule],
    exports: [
        FormCtrlDirective,
        FormDirective,
        LabelDirective,
        InputDirective,
        ValidationDirective,
        ValidateMessageDirective
    ]
})
export class CustomFormModule { }
