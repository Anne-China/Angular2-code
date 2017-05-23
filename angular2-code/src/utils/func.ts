/** 变量类型候选 */
const _types: any = {};
'Boolean Number String Function Array Date RegExp Object Error'
    .split(' ')
    .forEach((e: string, i: number): void => {
        _types['[object ' + e + ']'] = e.toLowerCase();
    });
/**
 * 获取变量类型
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @param value 要检测类型的变量
 * @returns 变量类型
 */
export function GetType(value: any): string {
    'use strict';
    return _types[Object.prototype.toString.call(value)];
}

/**
 * 判断对象是否存在且不为空
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @param obj 判断对象
 * @returns true or false
 */
export function IsPresent(obj: any): boolean {
    return obj !== undefined && obj !== null;
}

/**
 * 判断字符串是否是空字符串
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @param str 判断对象
 * @returns true or false
 */
export function IsBlank(str: string): boolean {
    return !(IsPresent(str) && str.toString().trim() !== '');
}

/**
 * 转换为boolean
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @description 不为空且不为“false”则返回true
 * @param value 转换对象
 * @returns 转换结果 true or false
 */
export function ConvertBoolean(value: any): boolean {
    return value != null && `${value}`.toLowerCase() !== 'false';
}

/**
 * 转换为整形
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @description 失败则返回NaN
 * @param value 转换对象
 * @returns 转换结果 int or NaN
 */
export function ConvertInt(value: any): number {
    if (value != null) {
        const vt = GetType(value);
        if (vt === 'number') {
            return value;
        } else if (vt === 'string') {
            const nv = parseInt(value, 10);
            if (!isNaN(nv)) {
                return nv;
            }
        }
    }
    return NaN;
}

/**
 * 获取目标对象的指定属性路径的值
 *
 * @author alfadb
 * @created 2017-03-06
 *
 * @param obj 目标对象
 * @param path 属性路径，可传入属性路径字符串或属性名数组
 * @returns 属性值
 */
export function DeepValueGetter(obj: any, path: string | string[]) {
    if (obj == null || path == null) {
        return obj;
    }

    let current = obj;
    const tpath = GetType(path);
    let props: string[];
    if (tpath === 'string') {
        props = (path as string).split('.');
    } else if (tpath === 'array') {
        props = path as string[];
    } else {
        return obj;
    }
    for (const prop of props) {
        if (current[prop] == null) {
            current = null;
            break;
        } else {
            current = current[prop];
        }
    }
    return current;
}

/**
 * 字符串形式的数字加减计算
 * @description 主要用于精确加减浮点数
 *
 * @author alfadb
 * @created 2017-02-16
 */
export class StringNumberCalc {
    /**
     * 加法
     *
     * @param arg1 左值
     * @param arg2 右值
     * @returns 计算结果(string类型)
     */
    public static add(arg1: any, arg2: any) {
        if (arg1 == null && arg2 == null) {
            return null;
        }
        if (arg1 == null || arg2 == null) {
            return arg1 || arg2;
        }
        if (!/^[+\-]?\d+(\.\d+)?$/.test(arg1) || !/^[+\-]?\d+(\.\d+)?$/.test(arg2)) {
            return NaN;
        }
        const n1 = arg1 + '';
        const n2 = arg2 + '';
        let dot1i = n1.indexOf('.');
        if (dot1i > 0) {
            dot1i = n1.length - dot1i - 1;
        } else { dot1i = 0; }
        let dot2i = n2.indexOf('.');
        if (dot2i > 0) {
            dot2i = n2.length - dot2i - 1;
        } else { dot2i = 0; }
        const maxd = Math.max(dot1i, dot2i);
        if (maxd > 0) {
            let n1n = n1.replace('.', '');
            for (let i = dot1i; i < maxd; i++) {
                n1n += '0';
            }
            let n2n = n2.replace('.', '');
            for (let i = dot2i; i < maxd; i++) {
                n2n += '0';
            }
            const n = (parseInt(n1n) + parseInt(n2n)).toString();
            const result = n.substr(0, n.length - maxd) + '.' + n.substr(n.length - maxd);
            if (result.startsWith('.')) {
                return '0' + result;
            } else if (result.startsWith('-.')) {
                return '-0' + result.substr(1);
            }
            return result;
        } else {
            return (parseInt(arg1) + parseInt(arg2)).toString();
        }
    }

    /**
     * 减法
     *
     * @param arg1 左值
     * @param arg2 右值
     * @returns 计算结果(string类型)
     */
    public static sub(arg1: any, arg2: any) {
        if (arg2 != null) {
            let n2 = arg2 + '';
            if (n2.startsWith('-')) {
                n2 = n2.substr(1);
            } else if (n2.startsWith('+')) {
                n2 = '-' + n2.substr(1);
            } else {
                n2 = '-' + n2;
            }
            return StringNumberCalc.add(arg1, n2);
        }
        return arg1;
    }
}

/**
 * 合并Url
 *
 * @author alfadb
 * @created 2017-03-11
 *
 * @param args url片段参数表
 * @returns 合并后的Url
 */
export function UrlCombine(...args: string[]): string {
    if (args == null || args.length === 0) {
        return null;
    }
    let url = '';
    for (const arg of args) {
        if (arg != null) {
            if (!IsBlank(url) && !url.endsWith('/')) {
                url += '/';
            }
            url += arg.startsWith('/') ? arg.substr(1, arg.length - 1) : arg;
        }
    }
    return url;
}
