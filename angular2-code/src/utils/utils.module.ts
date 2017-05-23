import { NgModule } from '@angular/core';
import { CustomPipesModule } from './pipes';

import { BoxDirectiveModule } from './box';
import { DropdownModule } from './dropdown';
import { PagerModule } from './pager';
import { DataGridModule } from './datagrid';
import { CustomFormModule } from './form';
import { AutocompleteModule } from './autocomplete';
import { FileUploaderModule } from './file-uploader';
import { TreeViewModule } from './tree-view';

/**
 * 组件/工具库模块声明
 *
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    imports: [
        CustomPipesModule,

        BoxDirectiveModule,
        DropdownModule,
        PagerModule,
        DataGridModule,
        CustomFormModule,
        AutocompleteModule,
        FileUploaderModule,
        TreeViewModule
    ],
    exports: [
        CustomPipesModule,

        BoxDirectiveModule,
        DropdownModule,
        PagerModule,
        DataGridModule,
        CustomFormModule,
        AutocompleteModule,
        FileUploaderModule,
        TreeViewModule
    ]
})
export class UtilsModule { }
