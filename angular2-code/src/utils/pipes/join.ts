import { Pipe, PipeTransform } from '@angular/core';
import { GetType, DeepValueGetter } from '../func';

/**
 * 数组转字符串的join管道
 *
 * @author alfadb
 * @created 2017-02-16
 *
 * @howToUse `{{ value | join:'间隔符':'属性路径' }}`
 *
 * @description
 *      当不传属性路径时，间隔符可不传，默认为', '
 *      当传入属性路径时，间隔符必须传入
 *
 * @example
 *      {{ [1,2,3] | join }} // 1,2,3
 *      {{ [1,2,3] | join:'|' }} // 1|2|3
 *      {{ [{a:1,b:{c:4}},{a:2,b:{c:3}}] | join:'|':'b.c' }} // 4|3
 */
@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {
    public transform(value: any[], ...args: any[]): string {
        if (value == null) { return null; }
        if (GetType(value) !== 'array') { return value + ''; }
        let sep: string;
        const props: any[] = [];
        if (args == null || args.length === 0) {
            sep = ', ';
        } else {
            sep = args[0] || ', ';
            for (let i = 1; i < args.length; i++) {
                let prop = args[i];
                if (prop == null || GetType(prop) !== 'string') {
                    continue;
                }
                const si = prop.split('.');
                for (let j = 0; j < si.length; j++) {
                    prop = si[j];
                    if (prop == null) { continue; }
                    props.push(prop);
                }
            }
        }
        if (props.length === 0) {
            return value.join(sep);
        } else {
            const result: any[] = [];
            for (const item of value) {
                const val = DeepValueGetter(item, props);
                if (val != null) {
                    result.push(val);
                }
            }
            return result.join(sep);
        }
    }
}
