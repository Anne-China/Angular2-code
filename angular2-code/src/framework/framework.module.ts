import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdIconModule, MdButtonModule, MdDialogModule } from '@angular/material';

import { UtilsModule } from '../utils';

import { Code404Component } from './code404/code404.component';
import { EntryComponent } from './entry/entry.component';
import { LayoutComponent } from './layout/layout.component';
import { SecurityModule } from './security';
import { Present } from './present';
import { CommonModule } from '@angular/common';
import { AjaxExHtmlComponent } from './entry/ajax-ex-html/ajax-ex-html.component';
import { AjaxExStringComponent } from './entry/ajax-ex-string/ajax-ex-string.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UtilsModule,
        MdIconModule,
        MdButtonModule,
        MdDialogModule,
        SecurityModule
    ],
    declarations: [
        Code404Component,
        EntryComponent,
        LayoutComponent,
        AjaxExHtmlComponent,
        AjaxExStringComponent
    ],
    entryComponents: [
        AjaxExHtmlComponent,
        AjaxExStringComponent
    ],
    providers: [Present],
    exports: [LayoutComponent]
})
export class FrameworkModule { }
