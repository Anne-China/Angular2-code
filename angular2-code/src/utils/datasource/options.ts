/**
 * DataSource类型
 *
 * @author alfadb
 * @created 2017-03-01
 */
export interface DataSourceOptions {
    /** 是否由服务器排序 */
    serverSorting?: boolean;
    /** 是否由服务器分页 */
    serverPaging?: boolean;
    /** 是否由服务器筛选 */
    serverFilting?: boolean;
    /** 可否分页 */
    pagable?: boolean;
    /** 每页条数 */
    pageSize?: number;
    /** 默认排序属性 */
    defaultSortProp?: string;
    /** 默认排序方向 */
    defaultSortDir?: string;
    /** 默认值对比函数 */
    defaultComparator?: (a: any, b: any) => number;
}
