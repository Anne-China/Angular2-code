import { Pipe, PipeTransform } from '@angular/core';
import { GetType, ConvertInt } from '../func';

/**
 * 生成数字数组
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @howToUse
 *      {{ [] | range:start:end }}
 *      {{ [] | range:[start,end] }}
 *
 * @description
 *      start及end类型为number，生成范围为[start,end]
 *      如果end不传或为空，则结果仅有一个元素，即：[start]
 *      如果start也为空，则仅返回空数组
 *      也可将start和end用数组传入
 *
 * @example
 *      {{ [] | range }} // []
 *      {{ [] | range:1 }} // [1]
 *      {{ [] | range:2:2 }} // [2]
 *      {{ [] | range:1:5 }} // [1,2,3,4,5]
 *      {{ [] | range:5:1 }} // [5,4,3,2,1]
 *
 *      {{ [] | range:[] }} // []
 *      {{ [] | range:[1] }} // [1]
 *      {{ [] | range:[2,2] }} // [2]
 *      {{ [] | range:[1,5] }} // [1,2,3,4,5]
 *      {{ [] | range:[5,1] }} // [5,4,3,2,1]
 */
@Pipe({
    name: 'range'
})
export class RangePipe implements PipeTransform {
    public transform(value: number[], ...args: any[]) {
        let paras = args;
        if (paras == null) {
            return [];
        }
        if (args.length === 1 && GetType(args[0]) === 'array') {
            paras = args[0];
            if (paras.length === 1 && args.length > 1) {
                paras = [args[0][0], args[1]];
            }
        }
        if (paras == null || paras.length === 0) {
            return [];
        }
        const start = ConvertInt(paras[0]);
        const end = ConvertInt(paras[1]);
        if (isNaN(start) && isNaN(end)) {
            return [];
        }
        if (isNaN(start)) {
            return [end];
        }
        if (isNaN(end)) {
            return [start];
        }
        if (start === end) {
            return [start];
        }
        const result: any[] = [];
        if (start > end) {
            for (let i = start; i >= end; i--) {
                result.push(i);
            }
        } else {
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
        }
        return result;
    }
}
