import { DataGridColumnDirective } from './datagrid-column.directive';

/**
 * DataGrid列分组模型
 *
 * @author alfadb
 * @created 2017-02-16
 */
export interface DataGridColumnGroup {
    /** 分组ID */
    $$id: string;
    /** 分组名称 */
    name?: string;
    /** 是否填充 */
    fill: boolean;
    /** 列集合 */
    columns: DataGridColumnDirective[];
}
