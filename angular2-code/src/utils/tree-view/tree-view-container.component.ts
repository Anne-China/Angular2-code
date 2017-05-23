import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IsBlank, DeepValueGetter } from '../func';
import { DataLoaderParameter } from '../dataloader-parameter';
import { TreeViewNode } from './tree-view-node';

@Component({
    selector: 'tree-view-container',
    templateUrl: 'tree-view-container.component.html',
    styleUrls: ['tree-view-container.component.scss']
})
export class TreeViewContainerComponent implements OnInit {
    private _displayProp: string;
    private _keyProp: string;
    private _sortProp: string;
    private _sortDir = 'asc';
    private _loadingText = '正在加载...';
    private _dataLoader: (parameter: DataLoaderParameter) =>
        any[] | Observable<any[] | { total: number, data: any[] }>;
    private _rootKey: any;
    private _selected: TreeViewNode<any>;

    public rootNode: TreeViewNode<any>;

    get displayProp() { return this._displayProp; }
    @Input('display-prop') set displayProp(value) {
        if (!IsBlank(value)) {
            this._displayProp = `${value}`.trim();
        }
    }

    get keyProp() { return this._keyProp; }
    @Input('key-prop') set keyProp(value) {
        if (!IsBlank(value)) {
            this._keyProp = `${value}`.trim();
        }
    }

    get sortProp() { return this._sortProp; }
    @Input('sort-prop') set sortProp(value) {
        if (!IsBlank(value)) {
            this._sortProp = `${value}`.trim();
        }
    }

    get sortDir() { return this._sortDir; }
    @Input('sort-dir') set sortDir(value) {
        if (!IsBlank(value)) {
            const dir = `${value}`.trim();
            if (['asc', 'desc'].indexOf(dir) >= 0) {
                this._sortDir = dir;
            }
        }
    }

    get loadingText() { return this._loadingText; }
    @Input('loading-text') set loadingText(value) {
        if (!IsBlank(value)) {
            this._loadingText = `${value}`.trim();
        }
    }

    get dataLoader() { return this._dataLoader; }
    @Input('data-loader') set dataLoader(loader: (parameter: DataLoaderParameter) =>
        any[] | Observable<any[] | { total: number, data: any[] }>) {
        this._dataLoader = loader;
    }

    get rootKey() { return this._rootKey; }
    @Input('root-key') set rootKey(value) { this._rootKey = value; }

    get selected() { return this._selected; }
    @Input() set selected(value) { this._selected = value; }
    @Output('selected') public onSelectedChange = new EventEmitter<any>();

    public trackingFn(index: number, node: TreeViewNode<any>) {
        if (this.keyProp == null) {
            return index.toString();
        }
        return DeepValueGetter(node.data, this.keyProp);
    }

    public ngOnInit() {
        if (this.sortProp == null) {
            this.sortProp = this.displayProp;
        }
    }

    public select(node: TreeViewNode<any>) {
        if (this.selected === node) {
            return;
        }
        this.selected = node;
        this.onSelectedChange.emit(node);
        node.loadData();
        let parent = node.$$parent;
        while (parent != null) {
            if (!parent.$$expanded) {
                parent.toggleExpand();
            }
            parent = parent.$$parent;
        }
    }

    public displayText = (item: TreeViewNode<any>) => {
        if (item == null) {
            return null;
        }
        if (IsBlank(this.displayProp)) {
            return item.data;
        } else {
            return DeepValueGetter(item.data, this.displayProp);
        }
    }

    public isExpanded(node: TreeViewNode<any>) {
        let parent = node.$$parent;
        while (parent != null) {
            if (!parent.$$expanded) {
                return false;
            }
            parent = parent.$$parent;
        }
        return true;
    }

    public addRoot(data: any) {
        const node = new TreeViewNode(
            data,
            this.keyProp,
            this.dataLoader,
            this.rootNode,
            this._sortProp,
            this._sortDir,
            this.rootNode.nodeTemplate
        );
        this.rootNode.$$children.push(node);
        return node;
    }
}
