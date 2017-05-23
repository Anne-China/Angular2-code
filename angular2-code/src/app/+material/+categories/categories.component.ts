import { Component, Host, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LayoutComponent } from '../../../framework/layout/layout.component';
import { Category } from '../../../data-adapters/material/categories/category.model';
import {
    CategoriesService,
    Brand,
    Provider,
    BrandsService,
    ProviderService,
    Material,
    MaterialService
} from '../../../data-adapters/material';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MdDialog, MdSnackBar } from '@angular/material';
import { TreeViewNode, DataLoaderParameter, DataGridComponent, DataGridResizeListenner } from '../../../utils';
import { Observable } from 'rxjs/Rx';
import { TreeViewContainerComponent } from '../../../utils/tree-view/tree-view-container.component';
import { StaticHosts } from '../../../data-adapters/api.config';
import { MaterialEditComponent } from './material-edit/material-edit.component';

@Component({
    templateUrl: 'categories.component.html',
    styleUrls: ['categories.component.scss'],
    animations: [
        trigger('detail', [
            state('true', style({ height: '*' })),
            state('false', style({ height: 102 })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('categoryImg', [
            state('true', style({ maxHeight: 120 })),
            state('false', style({ maxHeight: 36 })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('left', [
            state('true', style({ marginLeft: -370, marginRight: 20 })),
            state('false', style({ marginLeft: 0 })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('top', [
            state('true', style({ marginTop: -122, marginBottom: 20 })),
            state('false', style({ marginTop: 0 })),
            transition('* => *', animate('.2s'))
        ])
    ]
})
export class CategoriesComponent implements OnDestroy {
    private isExpandedBeforeMax = 'false';
    public isExpanded = 'false';
    public isMax = 'false';
    public rootCategory: Category = { ID: 0 };
    public cachedBrands: { [key: number]: Brand } = {};
    public cachedProviders: { [key: number]: Provider } = {};
    public selectedTreeNode: TreeViewNode<Category>;

    constructor(
        @Host() private layout: LayoutComponent,
        private dialog: MdDialog,
        private snackBar: MdSnackBar,
        private srv: CategoriesService,
        private brandSrv: BrandsService,
        private providerSrv: ProviderService,
        private materialSrv: MaterialService
    ) {
        this.layout.addBreadcrumb('品种分类及材料管理', './categories');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    @ViewChild(TreeViewContainerComponent) public treeView: TreeViewContainerComponent;

    public queryCategories = (parameter: DataLoaderParameter) => {
        return this.srv.queryCategories(parameter);
    }

    public onTreeViewSelect(node: TreeViewNode<Category>) {
        this.selectedTreeNode = node;
        Observable.from(node.data.BrandIDs)
            .filter((id) => this.cachedBrands[id] == null)
            .toArray()
            .mergeMap((ids: number[]) => this.brandSrv.queryBrandByIDs(ids))
            .subscribe((brands: Brand[]) => {
                brands.forEach((brand: Brand) => {
                    this.cachedBrands[brand.ID] = brand;
                });
            });
        Observable.from(node.data.ProviderIDs)
            .filter((id) => this.cachedProviders[id] == null)
            .toArray()
            .mergeMap((ids: number[]) => this.providerSrv.queryProviderByIDs(ids))
            .subscribe((providers: Provider[]) => {
                providers.forEach((provider: Provider) => {
                    this.cachedProviders[provider.ID] = provider;
                });
            });
        this.queryMaterialData();
    }

    public get category() { return this.selectedTreeNode == null ? null : this.selectedTreeNode.data; }
    public get categoryName() {
        return this.getCategoryPath(this.selectedTreeNode);
    }

    public addCategory(parent?: TreeViewNode<Category>) {
        const parentPath = this.getCategoryPath(parent);
        this.dialog.open(CategoryEditComponent, {
            disableClose: true,
            width: '700px',
            data: {
                parentPath,
                category: { ParentID: parent == null || parent.data == null ? 0 : parent.data.ID },
                cachedBrands: this.cachedBrands,
                cachedProviders: this.cachedProviders
            }
        }).afterClosed().subscribe((value: Category) => {
            if (value != null) {
                this.srv.addCategory(value).subscribe((id: number) => {
                    this.snackBar.open(`新增品种分类“${value.Name}”成功。`, null, { duration: 1000 });
                    value.ID = id;
                    value.Picture = StaticHosts.GetRes(value.Picture);
                    let node: TreeViewNode<Category>;
                    if (parent == null) {
                        node = this.treeView.addRoot(value);
                    } else {
                        node = parent.addChild(value);
                    }
                    setTimeout(() => {
                        this.treeView.select(node);
                    });
                });
            }
        });
    }

    public addChildCategory() {
        if (this.selectedTreeNode == null) {
            return;
        }
        this.addCategory(this.selectedTreeNode);
    }

    private getCategoryPath(node: TreeViewNode<Category>) {
        if (node == null) {
            return null;
        }
        let result = node.data.Name;
        let parent = node.$$parent;
        while (parent != null && parent.data != null) {
            result = parent.data.Name + '/' + result;
            parent = parent.$$parent;
        }
        return result;
    }

    public toggleMax() {
        if (this.isMax === 'true') {
            this.isMax = 'false';
            this.isExpanded = this.isExpandedBeforeMax;
        } else {
            this.isExpandedBeforeMax = this.isExpanded;
            this.isExpanded = 'false';
            this.isMax = 'true';
        }
        setTimeout(() => {
            DataGridResizeListenner.emit();
        }, 250);
    }

    public query = {
        Name: null
    };

    public getFilter = () => {
        return { ...this.query, CategoryID: this.selectedTreeNode == null ? null : this.selectedTreeNode.data.ID };
    }

    public materialsLoader = (parameter: DataLoaderParameter) => {
        return this.materialSrv.queryMaterials(parameter);
    }

    @ViewChild(DataGridComponent) public materialDataGrid: DataGridComponent;
    public queryMaterialData() {
        this.materialDataGrid.loadData();
    }

    public onMaterialsLoaded() {
        console.log('loaded');
        this.materialDataGrid.datas
            .map((item: Material) => item.BrandID)
            .filter((id) => this.cachedBrands[id] == null)
            .distinct()
            .toArray()
            .mergeMap((ids: number[]) => this.brandSrv.queryBrandByIDs(ids))
            .subscribe((brands: Brand[]) => {
                brands.forEach((brand: Brand) => {
                    this.cachedBrands[brand.ID] = brand;
                });
            });
        this.materialDataGrid.datas
            .map((item: Material) => item.ProviderID)
            .filter((id) => this.cachedProviders[id] == null)
            .distinct()
            .toArray()
            .mergeMap((ids: number[]) => this.providerSrv.queryProviderByIDs(ids))
            .subscribe((providers: Provider[]) => {
                providers.forEach((provider: Provider) => {
                    this.cachedProviders[provider.ID] = provider;
                });
            });
    }

    public addMaterial() {
        if (this.selectedTreeNode == null) {
            return;
        }
        const categoryPath = this.getCategoryPath(this.selectedTreeNode);
        this.dialog.open(MaterialEditComponent, {
            disableClose: true,
            width: '700px',
            data: {
                categoryPath,
                material: { CategoryID: this.selectedTreeNode.data.ID }
            }
        }).afterClosed().subscribe((value: Material) => {
            if (value != null) {
                this.materialSrv.addMaterial(value).subscribe(() => {
                    this.snackBar.open(`新增材料“${value.Name}”成功。`, null, { duration: 1000 });
                    this.queryMaterialData();
                });
            }
        });
    }

    public editCategory() {
        this.snackBar.open('功能未实现，敬请期待。', null, { duration: 1000 });
    }

    public delCategory() {
        this.snackBar.open('功能未实现，敬请期待。', null, { duration: 1000 });
    }

    public editMaterial(material: Material) {
        this.snackBar.open('功能未实现，敬请期待。', null, { duration: 1000 });
    }

    public delMaterial(material: Material) {
        this.snackBar.open('功能未实现，敬请期待。', null, { duration: 1000 });
    }
}
