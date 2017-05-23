import { Observable } from 'rxjs/Rx';
import { GetType, IsBlank, DeepValueGetter } from '../func';
import { Subscription } from 'rxjs/Subscription';
import { DataLoaderParameter } from '../dataloader-parameter';
import { DataSourceOptions } from './options';
import { FilterGroup, FilterParameter, FilterGroupOperator, FilterValueOperator } from '../filter-define';
import { EventEmitter } from '@angular/core';

/**
 * DataSource
 *
 * @param T 泛型类型
 *
 * @say
 *      啦啦啦，啦啦啦，我是卖报小行家……
 *      这里不能乱动哈，出了问题，老板会问候我全家，我会问候你全家！
 * @author alfadb
 * @created 2017-03-01
 * @modified 2017-03-16 by alfadb
 */
export class DataSource<T> {
    /** 当前选项 */
    public options: DataSourceOptions;
    private _subscription: Subscription;
    private _data: T[];
    private _sortedData: T[];
    private _filteredData: T[];
    private _pager: { size?: number, index?: number } = {};
    private _sortor: { dir?: string, prop?: string, comparator?: (a: any, b: any) => number } = {};
    private _filter: { [key: string]: any } | FilterParameter | FilterGroup;

    /** 数据总条数发生变化时触发事件 */
    public totalChangedEvent = new EventEmitter<number>();
    /** 数据发生变化时触发事件 */
    public dataChangedEvent = new EventEmitter<any>();

    /** 是否正在加载数据 */
    public isDataLoading = false;
    /** 当前可用的数据 */
    public data: Observable<T> = Observable.empty();
    private _total: number = -1;
    /** 当前数据总数 */
    set total(total: number) {
        if (total !== this._total) {
            this._total = total;
            this.totalChangedEvent.emit(total);
        }
    }
    get total() { return this._total < 0 ? 0 : this._total; }

    /**
     * @author alfadb
     * @created 2017-03-01
     *
     * @param options 创建选项
     * @returns {DataSource}
     */
    constructor(options?: DataSourceOptions) {
        if (options == null) {
            options = {
                serverFilting: false,
                serverPaging: false,
                serverSorting: false,
                pageSize: 20,
                defaultSortDir: 'asc',
                defaultSortProp: null
            };
        } else {
            if (options.pagable == null) {
                options.pagable = false;
            }
            if (options.serverFilting == null) {
                options.serverFilting = false;
            }
            if (options.serverPaging == null) {
                options.serverPaging = false;
            }
            if (options.serverSorting == null) {
                options.serverSorting = false;
            }
        }
        this.options = options;
        this._pager.size = options.pageSize;
        this._pager.index = 1;
        this._sortor.dir = ['asc', 'desc'].indexOf(options.defaultSortDir) >= 0 ? options.defaultSortDir : 'asc';
        this._sortor.prop = IsBlank(options.defaultSortProp) ? null : options.defaultSortProp;
        this._sortor.comparator = options.defaultComparator;
    }

    /** 执行销毁 */
    public destroy() {
        if (this._subscription != null) {
            this._subscription.unsubscribe();
        }
    }

    /**
     * 设置数据源数据
     *
     * @author alfadb
     * @created 2017-03-01
     *
     * @param data 数据对象
     * @param parameter {DataLoaderParameter}
     */
    public setData(data: T[] | Observable<T[] | { total: number, data: T[] }>, parameter?: DataLoaderParameter) {
        if (parameter != null) {
            this._pager = parameter.pager;
            this._sortor = parameter.sortor;
            this._filter = parameter.filter;
        }
        if (data == null) {
            this._data = [];
            this.total = 0;
            this.handleFilter();
            this.handleSort();
            this.handlePage();
            this.isDataLoading = false;
            return;
        }
        if (this._subscription != null) {
            this._subscription.unsubscribe();
        }
        if (GetType(data) === 'array') {
            this._data = data as T[];
            this.total = this._data.length;
            this.handleFilter();
            this.handleSort();
            this.handlePage();
            this.isDataLoading = false;
        } else {
            const asyncData = data as Observable<T[] | { total: number, data: T[] }>;
            this._subscription = asyncData.subscribe((values) => {
                if (values == null) {
                    this.total = 0;
                    this._data = [];
                } else if (GetType(values) === 'array') {
                    const v = values as T[];
                    this.total = v.length;
                    this._data = v;
                } else {
                    const v = values as { total: number, data: T[] };
                    this.total = v.total;
                    this._data = v.data;
                }
                this.handleFilter();
                this.handleSort();
                this.handlePage();
                this.isDataLoading = false;
            });
        }
    }

    private _remoteDataLoader: (parameter: DataLoaderParameter) => T[] | Observable<T[] | { total: number, data: T[] }>;
    /**
     * 设置远程加载数据方法
     *
     * @author alfadb
     * @created 2017-03-01
     *
     * @param loader {DataLoaderParameter}
     */
    public setRemoteDataLoader(
        loader: (parameter: DataLoaderParameter) => T[] | Observable<T[] | { total: number, data: T[] }>) {
        this._remoteDataLoader = loader;
    }

    /**
     * 开始加载远程数据
     *
     * @author alfadb
     * @created 2017-03-01
     *
     * @param parameter {DataLoaderParameter}
     */
    public remoteLoadData(parameter: DataLoaderParameter) {
        if (this._remoteDataLoader == null) {
            throw new Error('the remote data loader is null.');
        }
        if (parameter == null) {
            parameter = {};
        }
        this._pager = parameter.pager;
        this._sortor = parameter.sortor;
        this._filter = parameter.filter;
        this.isDataLoading = true;
        this.setData(this._remoteDataLoader(parameter));
    }

    /**
     * 执行分页
     *
     * @author alfadb
     * @created 2017-03-01
     *
     * @param index 页码
     * @param size 每页条数
     */
    public page(index?: number, size?: number) {
        if (!this.options.pagable) {
            index = null;
            size = null;
        } else {
            if (index == null) {
                index = this._pager == null || this._pager.index == null ? 1 : this._pager.index;
            }
            if (index <= 0) {
                throw new Error('page index must great than 0.');
            }
            if (size == null) {
                size = this._pager == null || this._pager.size == null ? 20 : this._pager.size;
            } else {
                if (size <= 0) {
                    throw new Error('page size must great than 0.');
                }
            }
        }
        if (this.options.serverPaging) {
            this.remoteLoadData({ pager: { size, index }, sortor: this._sortor, filter: this._filter });
        } else {
            this._pager = { size, index };
            this.handlePage();
        }
    }

    /**
     * 执行排序
     *
     * @author alfadb
     * @created 2017-03-01
     *
     * @param prop 排序属性
     * @param dir 排序方向
     * @param comparator 排序值对比函数
     */
    public sort(prop?: string, dir?: string, comparator?: (a: any, b: any) => number) {
        if (IsBlank(prop)) {
            prop = null;
        }
        if (dir == null) {
            dir = 'asc';
        }
        if (['asc', 'desc'].indexOf(dir) < 0) {
            throw new Error('sort direction must use "asc" or "desc".');
        }
        if (this.options.serverSorting) {
            this.remoteLoadData({ pager: this._pager, sortor: { dir, prop, comparator }, filter: this._filter });
        } else {
            this._sortor = { dir, prop, comparator };
            this.handleSort();
            this.handlePage();
        }
    }

    /**
     * 执行筛选
     *
     * @param filter 筛选条件
     *
     * @author alfadb
     * @created 2017-03-01
     */
    public filter(filter?: { [key: string]: any } | FilterParameter | FilterGroup) {
        if (this.options.serverFilting) {
            this.remoteLoadData({ pager: this._pager, sortor: this._sortor, filter });
        } else {
            this._filter = filter;
            this.handleFilter();
            this.handleSort();
            this.handlePage();
        }
    }

    /**
     * 使用当前参数刷新数据
     *
     * @author alfadb
     * @created 2017-03-16
     */
    public refreshByCurrentParamter() {
        this.filter(this._filter);
    }

    /**
     * 使用新参数刷新数据
     *
     * @param parameter {DataLoaderParameter} 数据源参数
     *
     * @author alfadb
     * @created 2017-03-16
     */
    public refreshByNewPatameter(parameter: DataLoaderParameter) {
        if (parameter == null) {
            parameter = {};
        }
        this._pager = parameter.pager;
        this._sortor = parameter.sortor;
        this._filter = parameter.filter;
        this.filter(this._filter);
    }

    private handlePage() {
        if (this._sortedData == null) {
            if (this._filteredData == null) {
                this._filteredData = this._data;
            }
            this._sortedData = this._filteredData == null ? [] : this._filteredData;
        }
        if (this.options.serverPaging) {
            this.data = Observable.from(this._sortedData);
            this.dataChangedEvent.emit();
            return;
        }
        if (!this.options.pagable) {
            this.data = Observable.from(this._sortedData);
            this.dataChangedEvent.emit();
            return;
        }
        const from = (this._pager.index - 1) * this._pager.size;
        let to = from + this._pager.size;
        if (from >= this._sortedData.length) {
            this.data = Observable.empty();
            this.dataChangedEvent.emit();
            return;
        }
        if (to > this._sortedData.length) {
            to = this._sortedData.length;
        }
        const result: T[] = [];
        for (let i = from; i < to; i++) {
            result.push(this._sortedData[i]);
        }
        this.data = Observable.from(this._sortedData).skip(from).take(to - from);
        this.dataChangedEvent.emit();
    }

    private handleSort() {
        if (this._filteredData == null) {
            this._filteredData = this._data == null ? [] : [...this._data];
        }
        if (this.options.serverSorting || this._sortor == null) {
            this._sortedData = this._filteredData;
            return;
        }
        this._sortedData = [...this._filteredData];
        const aprop = this._sortor.prop == null ? null : this._sortor.prop.split('.');
        this._sortedData.sort((a: T, b: T) => {
            if (aprop == null) {
                if (this._sortor.comparator != null) {
                    const result = this._sortor.comparator(a, b);
                    return this._sortor.dir === 'asc' ? result : -result;
                }
                const result = this.defaultComparator(a, b);
                return this._sortor.dir === 'asc' ? result : -result;
            } else {
                let aval = a;
                let bval = b;
                for (const prop of aprop) {
                    if (aval == null || aval[prop] == null) {
                        aval = null;
                    } else {
                        aval = aval[prop];
                    }
                    if (bval == null || bval[prop] == null) {
                        bval = null;
                    } else {
                        bval = bval[prop];
                    }
                }
                if (this._sortor.comparator != null) {
                    const result = this._sortor.comparator(aval, bval);
                    return this._sortor.dir === 'asc' ? result : -result;
                }
                const result = this.defaultComparator(aval, bval);
                return this._sortor.dir === 'asc' ? result : -result;
            }
        });
    }

    private defaultComparator(aval: any, bval: any) {
        if (aval == null && bval == null) {
            return 0;
        }
        if (aval == null) {
            return 1;
        }
        if (bval == null) {
            return -1;
        }
        if (aval === bval) {
            return 0;
        }
        const at = GetType(aval);
        const bt = GetType(bval);
        if (at !== bt || at !== 'string') {
            // tslint:disable-next-line:triple-equals
            return aval == bval ? 0 : aval > bval ? 1 : -1;
        }
        return aval.localeCompare(bval, 'zh');
    }

    private handleFilter() {
        if (this.options.serverFilting || this._filter == null) {
            this._filteredData = this._data == null ? [] : this._data;
            return;
        }
        if (this._data == null) {
            this._filteredData = [];
            return;
        }
        const result: T[] = [];
        this._filteredData.forEach((obj: T) => {
            if (this.execFilter(obj, this._filter)) {
                result.push(obj);
            }
        });
        this._filteredData = result;
        this.total = result.length;
    }

    private execFilter(obj: T, fg: { [key: string]: any } | FilterParameter | FilterGroup): boolean {
        if (fg['operator'] == null) {
            const filters = fg as { [key: string]: any };
            const filtersResult: boolean[] = [];
            for (const key in filters) {
                if (filters.hasOwnProperty(key)) {
                    const val = DeepValueGetter(obj, key);
                    filtersResult.push(this.execFilterValueOperate(val, filters[key], FilterValueOperator.Equal));
                }
            }
            let result = this.execFilterGroupOperate(filtersResult[0], filtersResult[1], FilterGroupOperator.And);
            for (let i = 2; i < filtersResult.length; i++) {
                result = this.execFilterGroupOperate(result, filtersResult[i], FilterGroupOperator.And);
            }
            return result;
        } else {
            if (fg['filters'] == null) {
                const filter = fg as FilterParameter;
                const val = DeepValueGetter(obj, filter.prop);
                return this.execFilterValueOperate(val, filter.value, filter.operator);
            } else {
                const filterGroup = fg as FilterGroup;
                if (filterGroup.operator.length !== filterGroup.filters.length - 1) {
                    throw new Error('filter group\'s operator length must equal it\'s filters length - 1.');
                }
                const filtersResult: boolean[] = [];
                for (const filter of filterGroup.filters) {
                    filtersResult.push(this.execFilter(obj, filter));
                }
                let result = this.execFilterGroupOperate(filtersResult[0], filtersResult[1], filterGroup.operator[0]);
                for (let i = 2; i < filtersResult.length; i++) {
                    result = this.execFilterGroupOperate(result, filtersResult[i], filterGroup.operator[i - 1]);
                }
                return result;
            }
        }
    }

    private execFilterValueOperate(left: any, right: any, operator: FilterValueOperator) {
        switch (operator) {
            case FilterValueOperator.Equal:
                return left === right;
            case FilterValueOperator.NotEqual:
                return left !== right;
            case FilterValueOperator.Great:
                return left > right;
            case FilterValueOperator.GreatThan:
                return left >= right;
            case FilterValueOperator.Less:
                return left < right;
            case FilterValueOperator.LessThan:
                return left <= right;
            case FilterValueOperator.StartsWith:
                if (left == null || right == null) { return false; }
                if (left['indexOf'] != null) {
                    return left.indexOf(right) === 0;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t indexOf method.`);
                }
            case FilterValueOperator.NotStartsWith:
                if (left == null || right == null) { return false; }
                if (left['indexOf'] != null) {
                    return left.indexOf(right) !== 0;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t indexOf method.`);
                }
            case FilterValueOperator.EndsWith:
                if (left == null || right == null) { return false; }
                if (left['lastIndexOf'] != null) {
                    const index = left.lastIndexOf(right);
                    return index + right.length === left.length;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t lastIndexOf method.`);
                }
            case FilterValueOperator.NotEndsWith:
                if (left == null || right == null) { return false; }
                if (left['lastIndexOf'] != null) {
                    const index = left.lastIndexOf(right);
                    return index + right.length < left.length;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t lastIndexOf method.`);
                }
            case FilterValueOperator.LeftContains:
                if (left == null || right == null) { return false; }
                if (left['indexOf'] != null) {
                    const index = left.indexOf(right);
                    return index >= 0;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t indexOf method.`);
                }
            case FilterValueOperator.LeftNotContains:
                if (left == null || right == null) { return false; }
                if (left['indexOf'] != null) {
                    const index = left.indexOf(right);
                    return index < 0;
                } else {
                    throw new Error(`${GetType(left)} hasn\'t indexOf method.`);
                }
            case FilterValueOperator.RightContains:
                if (left == null || right == null) { return false; }
                if (right['indexOf'] != null) {
                    const index = right.indexOf(left);
                    return index >= 0;
                } else {
                    throw new Error(`${GetType(right)} hasn\'t indexOf method.`);
                }
            case FilterValueOperator.RightNotContains:
                if (left == null || right == null) { return false; }
                if (right['indexOf'] != null) {
                    const index = right.indexOf(left);
                    return index < 0;
                } else {
                    throw new Error(`${GetType(right)} hasn\'t indexOf method.`);
                }
            default:
                return false;
        }
    }

    private execFilterGroupOperate(a: boolean, b: boolean, operator: FilterGroupOperator) {
        switch (operator) {
            case FilterGroupOperator.And:
                return a && b;
            case FilterGroupOperator.Or:
                return a || b;
            default:
                return false;
        }
    }
}
