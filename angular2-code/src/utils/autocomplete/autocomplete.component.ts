import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    OnInit,
    ElementRef,
    Renderer,
    ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { ConvertBoolean, IsBlank, DeepValueGetter, GetType } from '../func';
import { DataLoaderParameter } from '../dataloader-parameter';
import { MdAutocompleteTrigger } from '@angular/material';

/**
 * 为毛要这样写？官方这样说的，我也不知道为什么，不要问我……
 *
 * @author alfadb
 * @created 2017-03-21
 */
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteComponent),
    multi: true
};

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html',
    styleUrls: ['autocomplete.component.scss'],
    providers: [AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
    private _required: boolean;
    private _value: any;
    private _disabled: boolean = false;
    private _readonly: boolean = false;

    public inputCtrl: FormControl;

    /**
     * @param hostRef {ElementRef}
     * @param renderer {Renderer}
     *
     * @author alfadb
     * @created 2017-03-21
     */
    constructor(private hostRef: ElementRef, private renderer: Renderer) {
        this.inputCtrl = new FormControl();
    }

    /**
     * 组件初始化
     *
     * @author alfadb
     * @created 2017-03-21
     */
    public ngOnInit() {
        if (this.width != null) {
            this.renderer.setElementStyle(this.hostRef.nativeElement, 'width', this.width + 'px');
        }
        this.inputCtrl.valueChanges.subscribe((v) => {
            if (IsBlank(v)) {
                this.selectValue(null);
            } else if (GetType(v) === 'object' && v['_$$$$_']) {
                this.selectValue(v.data);
            }
        });
        this.options = this.inputCtrl.valueChanges
            .map((search: any) => {
                this._isFirstLoaded = true;
                if (search != null && GetType(search) !== 'string') {
                    search = IsBlank(this.displayProp) ?
                        search : DeepValueGetter(search.data, this.displayProp) as string;
                }
                const parameter: DataLoaderParameter = {
                    pager: { index: 1, size: 20 },
                    filter: { Name: search }
                };
                console.log('---------search = ' + search);
                return this.dataLoader(parameter).map((items: any[]) => items.map((item: any) => {
                    console.log('---------search = ' + JSON.stringify(item));
                    return {
                        data: item,
                        _$$$$_: true
                    };
                }));
            });
    }

    @ViewChild('inputRef') public inputRef: ElementRef;

    public inputBlur() {
        const input = this.inputRef.nativeElement as HTMLInputElement;
        if (this._selectObject == null) {
            if (!IsBlank(this.inputCtrl.value) && !IsBlank(input.value)) {
                // this.inputCtrl.setValue(null);
            }
        } else {
            const option = {
                data: this._selectObject,
                _$$$$_: true
            };
            if (this.displayText(option) !== input.value) {
                this.inputCtrl.setValue(option);
            }
        }
    }

    private _isFirstLoaded = false;
    public inputFocus() {
        if (!this._isFirstLoaded) {
            this.inputCtrl.setValue(this._selectObject == null ? null : {
                data: this._selectObject,
                _$$$$_: true
            });
            this._isFirstLoaded = true;
        }else {
            this.inputCtrl.setValue(null);
        }
    }

    /** 设置异步加载数据函数 */
    @Input('data-loader') public dataLoader: (parameter: DataLoaderParameter) => Observable<any[]>;

    public options: Observable<Observable<any[]>>;

    /** 值改变事件 */
    @Output('change') public onChangeEvent = new EventEmitter<any>();

    @ViewChild(MdAutocompleteTrigger) public autoComplete: MdAutocompleteTrigger;

    /** 宽度 */
    @Input() public width: number;

    private _canClear = false;
    /** 是否可清除选择 */
    @Input('can-clear') set canClear(value: any) {
        this._canClear = ConvertBoolean(value);
    }
    get canClear() { return this._canClear; }

    /** 设置显示属性 */
    @Input('display-prop') public displayProp: string;
    /** 设在值属性 */
    @Input('value-prop') public valueProp: string;
    /** 设置未选择时，显示的内容 */
    @Input() public placeholder: string;

    private _onTouchedCallback: () => void = () => { return; };
    private _onChangeCallback: (_: any) => void = () => { return; };

    /** 获取显示值 */
    public displayText = (option: any) => {
        if (option == null) {
            return null;
        }
        if (IsBlank(this.displayProp)) {
            return option.data;
        } else {
            return DeepValueGetter(option.data, this.displayProp);
        }
    }

    public optionValue(option: any) {
        if (IsBlank(this.valueProp)) {
            return option;
        } else {
            return DeepValueGetter(option, this.valueProp);
        }
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

    @Input()
    get readonly(): boolean {
        return this._readonly;
    }
    /** 是否只读 */
    set readonly(value) {
        this._readonly = ConvertBoolean(value);
    }

    get value(): any {
        return this._value;
    }
    /** 当前值 */
    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
        }
    }

    private _selectObject: any;
    private selectValue(value: any) {
        if (this._selectObject === value) {
            return;
        }
        if (this.valueProp != null) {
            this.value = DeepValueGetter(value, this.valueProp);

        } else {
            this.value = value;
        }
        this._selectObject = value;
        this.onChangeEvent.emit(this.value);
    }

    /** 实现ControlValueAccessor方法，别乱调 */
    public writeValue(value: any) {
        this._value = value;
        this._selectObject = value;
        this.inputBlur();
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
