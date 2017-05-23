import { Observable } from 'rxjs/Observable';

import { DataLoaderParameter } from '../dataloader-parameter';
import { DataSource } from '../datasource/datasource';

export class TreeViewNode<T> {
    private _dataSource: DataSource<T>;

    public $$dataLoaded = false;
    public $$dataLoading = false;
    public $$expanded = false;
    public $$firstExpanded = false;
    public $$children: Array<TreeViewNode<T>> = [];
    public $$rootKey: any;

    public get $$level() {
        return this.$$parent == null ? 0 : this.$$parent.$$level + 1;
    }

    constructor(
        public data: T,
        public $$keyProp: string,
        private dataLoader: (parameter: DataLoaderParameter) =>
            any[] | Observable<any[] | { total: number, data: any[] }>,
        public $$parent: TreeViewNode<T>,
        private _sortProp: string,
        private _sortDir: string,
        public nodeTemplate: any,
        private $$isRoot: boolean = false) {

        if (this.$$isRoot) {
            this.$$expanded = true;
            this.$$firstExpanded = true;
        }
    }

    public toggleExpand() {
        this.$$expanded = !this.$$expanded;
        if (!this.$$firstExpanded) {
            this.$$firstExpanded = true;
            if (!this.$$dataLoaded && !this.$$dataLoading) {
                this.loadData();
            }
        }
    }

    public loadData() {
        if (this.$$dataLoading || this.$$dataLoaded) {
            return;
        }
        this.$$dataLoading = true;
        if (this._dataSource == null) {
            this._dataSource = new DataSource<T>();
            this._dataSource.options.serverFilting = true;
            this._dataSource.options.serverPaging = true;
            this._dataSource.setRemoteDataLoader(this.dataLoader);
            this._dataSource.dataChangedEvent.subscribe(() => {
                this.$$dataLoaded = true;
                this.$$dataLoading = false;
                this.$$children = [];
                this._dataSource.data.subscribe((item) => {
                    this.$$children.push(new TreeViewNode(
                        item,
                        this.$$keyProp,
                        this.dataLoader,
                        this,
                        this._sortProp,
                        this._sortDir,
                        this.nodeTemplate
                    ));
                });
            });
        }
        const parameter: DataLoaderParameter = {
            pager: { index: 1, size: 999999 },
            sortor: { prop: this._sortProp, dir: this._sortDir },
            filter: {}
        };
        if (!this.$$isRoot) {
            parameter.filter[this.$$keyProp] = this.data[this.$$keyProp];
        } else if (this.$$rootKey != null) {
            parameter.filter[this.$$keyProp] = this.$$rootKey;
        }
        this._dataSource.remoteLoadData(parameter);
    }

    public addChild(data: T) {
        const node = new TreeViewNode(
            data,
            this.$$keyProp,
            this.dataLoader,
            this,
            this._sortProp,
            this._sortDir,
            this.nodeTemplate
        );
        this.$$children.push(node);
        return node;
    }
}
