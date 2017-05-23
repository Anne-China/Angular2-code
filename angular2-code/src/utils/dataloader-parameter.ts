import { FilterGroup, FilterParameter } from './filter-define';

/**
 * DataLoader参数结构
 *
 * @author alfadb
 * @created 2017-03-01
 */
export interface DataLoaderParameter {
    /** 分页参数 */
    pager?: {
        /** 每页条数 */
        size?: number;
        /** 页码，从1开始 */
        index?: number;
    };
    /** 排序参数 */
    sortor?: {
        /** 排序方向 */
        dir?: string;
        /** 用于排序的属性 */
        prop?: string;
        /** 自定义值对比函数 */
        comparator?: (a: any, b: any) => number;
    };
    /** 筛选参数 */
    filter?: { [key: string]: any } | FilterParameter | FilterGroup;
}
