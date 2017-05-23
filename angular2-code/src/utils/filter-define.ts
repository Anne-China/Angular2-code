/**
 * 筛选条件组操作类型
 *
 * @author alfadb
 * @created 2017-03-01
 */
export enum FilterGroupOperator {
    /** 与操作 */
    And,
    /** 或操作 */
    Or
}

/**
 * 筛选条件值操作类型
 *
 * @author alfadb
 * @created 2017-03-01
 */
export enum FilterValueOperator {
    /** 等于 */
    Equal,
    /** 不等于 */
    NotEqual,
    /** 大于 */
    Great,
    /** 小于 */
    Less,
    /** 大于或等于 */
    GreatThan,
    /** 小于或等于 */
    LessThan,
    /** 左值是否包含右值 */
    LeftContains,
    /** 右值是否包含左值 */
    RightContains,
    /** 左值是否不包含右值 */
    LeftNotContains,
    /** 右值是否不包含左值 */
    RightNotContains,
    /** 左值是否以右值开头 */
    StartsWith,
    /** 左值是否以右值结尾 */
    EndsWith,
    /** 左值是否以不右值开头 */
    NotStartsWith,
    /** 左值是否以不右值结尾 */
    NotEndsWith
}

/**
 * 筛选值条件参数
 *
 * @author alfadb
 * @created 2017-03-01
 */
export interface FilterParameter {
    /** 要筛选的属性(左值) */
    prop: string;
    /** 筛选条件值操作类型 */
    operator: FilterValueOperator;
    /** 右操作数 */
    value: any;
}

/**
 * 筛选组条件参数
 *
 * @author alfadb
 * @created 2017-03-01
 */
export interface FilterGroup {
    /** 筛选条件组操作类型 */
    operator: FilterGroupOperator[];
    /** 筛选条件组 */
    filters: Array<FilterParameter | FilterGroup>;
}
