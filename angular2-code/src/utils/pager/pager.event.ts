/**
 * 分页更新事件
 *
 * @author alfadb
 * @created 2017-02-16
 */
export interface PagerChangeEvent {
    /** 每页条数 */
    size: number;
    /** 页码(从1开始) */
    index: number;
}
