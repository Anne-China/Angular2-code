import {
    Component, Input, forwardRef,
    ElementRef, Renderer, OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { IsBlank, DeepValueGetter, GetType, ConvertBoolean } from '../func';

/**
 * 为毛要这样写？官方这样说的，我也不知道为什么，不要问我……
 *
 * @author alfadb
 * @created 2017-02-16
 */
export const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
};

/**
 * Dropdown(就是俗称的下拉框)组件
 *
 * @howToUse
 *      <dropdown [(ngModel)]="model"
 *                (change)="onChange($event)"
 *                (focus)="onFocus($event)"
 *                (blur)="onBlur($event)"
 *                width="200"
 *                tabindex="1",
 *                [options]="['选项1','选项2','选项3']"
 *                display-prop="prop.prop"
 *                placeholder="请选择"
 *                direction="up"
 *                max-height="200"
 *                required
 *                readonly
 *                disabled>
 *      </dropdown>
 *
 * @say 写文档写得想死了……
 * @author alfadb
 * @created 2017-02-16
 */
@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.scss'],
    providers: [DROPDOWN_VALUE_ACCESSOR]
})
export class DropdownComponent implements ControlValueAccessor, OnInit {
    /**
     * @param hostRef {ElementRef}
     * @param renderer {Renderer}
     *
     * @author alfadb
     * @created 2017-02-16
     */
    constructor(private hostRef: ElementRef, private renderer: Renderer) { }

    /**
     * 组件初始化
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public ngOnInit() {
        if (this.width != null) {
            this.renderer.setElementStyle(this.hostRef.nativeElement, 'width', this.width + 'px');
        }
    }

    /** 值改变事件 */
    @Output('change') public onChangeEvent = new EventEmitter<any>();

    private _required: boolean;
    private _value: any;
    private _disabled: boolean = false;

    /** 宽度 */
    @Input() public width: number;

    private _canClear = false;
    /** 是否可清除选择 */
    @Input('can-clear') set canClear(value: any) {
        this._canClear = ConvertBoolean(value);
    }
    get canClear() { return this._canClear; }

    public selectableOptions: any[] = [];
    /** 设置后选项 */
    @Input() set options(value: any) {
        if (value == null) {
            this.selectableOptions = [];
        }
        const vt = GetType(value);
        if (vt === 'array') {
            this.selectableOptions = value;
        } else if (vt === 'object') {
            const result: Array<{ value: number, text: string }> = [];
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    const ikey = parseInt(key);
                    result.push({ value: ikey, text: value[key] });
                }
            }
            this.displayProp = 'text';
            this.valueProp = 'value';
            this.selectableOptions = result;
        } else {
            this.selectableOptions = [value];
        }
    }
    /** 设置显示属性 */
    @Input('display-prop') public displayProp: string;
    /** 设在值属性 */
    @Input('value-prop') public valueProp: string;
    /** 设置未选择时，显示的内容 */
    @Input() public placeholder: string;

    private _onTouchedCallback: () => void = () => { return; };
    private _onChangeCallback: (_: any) => void = () => { return; };

    /** 获取显示值 */
    public displayText(value: any) {
        if (IsBlank(this.displayProp)) {
            return value;
        } else {
            return DeepValueGetter(value, this.displayProp);
        }
    }

    public getValue(value: any) {
        if (IsBlank(this.valueProp)) {
            return value;
        } else {
            return DeepValueGetter(value, this.valueProp);
        }
    }

    public clear(e: MouseEvent) {
        setTimeout(() => {
            this.value = null;
        });
    }

    @Input()
    get required(): boolean {
        return this._required;
    }
    /** required验证器 */
    set required(value) {
        this._required = ConvertBoolean(value);
    }

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    /** 是否禁用 */
    set disabled(value) {
        this._disabled = ConvertBoolean(value);
    }

    get value(): any {
        return this._value;
    }
    /** 当前值 */
    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
            this.onChangeEvent.emit(v);
        }
    }

    /** 实现ControlValueAccessor方法，别乱调 */
    public writeValue(value: any) {
        this._value = value;
    }

    /** 实现ControlValueAccessor方法，别乱调 */
    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    /** 实现ControlValueAccessor方法，别乱调 */
    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }
}
