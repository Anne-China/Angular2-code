import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdProgressBarModule, MdRippleModule } from '@angular/material';

import { DataGridComponent } from './datagrid.component';
import { DataGridCellDirective } from './datagrid-cell.directive';
import { DataGridColumnDirective } from './datagrid-column.directive';
import { DataGridColumnGroupDirective } from './datagrid-column-group.directive';
import { DatagridRowComponent } from './datagrid-row.component';
import { DataGridRowDetailDirective } from './row-detial.directive';
import { DataGridRowDetailContainerDirective } from './datagrid-row-detail.directive';
import { DataGridColumnHeaderDirective } from './datagrid-column-header.directive';

/**
 * DataGrid模块
 *
 * @say 嘿嘿～～～
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    imports: [
        CommonModule,
        MdProgressBarModule,
        MdRippleModule
    ],
    declarations: [
        DataGridComponent,
        DataGridCellDirective,
        DataGridColumnDirective,
        DataGridColumnHeaderDirective,
        DataGridColumnGroupDirective,
        DatagridRowComponent,
        DataGridRowDetailDirective,
        DataGridRowDetailContainerDirective
    ],
    exports: [
        DataGridComponent,
        DataGridCellDirective,
        DataGridColumnDirective,
        DataGridColumnHeaderDirective,
        DataGridColumnGroupDirective,
        DataGridRowDetailDirective
    ]
})
export class DataGridModule { }
