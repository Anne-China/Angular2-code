import { Component, Host, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { DataGridComponent } from '../../../../utils';

import { ClientProjectService, ClientProject } from '../../../../data-adapters/order/project';
import { LayoutComponent } from '../../../../framework/index';
import { Category } from '../../../../data-adapters/material/categories/category.model';
import { Brand } from '../../../../data-adapters/material/brands/brands.model';
import { Product, MxWorker } from '../../../../data-adapters/order/project/project.model';
import { ProductSelectorComponent } from './edit/edit.component';
import { ProductDeleteComponent } from './del/del.component';
import { GlobalDicts } from '../../../../data-adapters/app.dicts';
import { JobSelectorComponent } from './jobedit/jobedit.component';
import { JobDeleteComponent } from './jobdel/jobdel.component';

@Component({
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.scss']
})
export class ProjectDetailComponent implements OnDestroy, OnInit {
    public projectID: string;
    public project: ClientProject;
    public packages: { [key: number]: string } = {};
    public categories: Category[] = [];
    public brands: Brand[] = [];
    public get skills() { return GlobalDicts.Construction.User.Skill; }
    constructor(
        @Host() public layout: LayoutComponent,
        private dialog: MdDialog,
        private snackBar: MdSnackBar,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private srv: ClientProjectService) {
        this.layout.isFill = false;
        this.layout.addBreadcrumb('工程管理', '/order/project');
        this.layout.addBreadcrumb('工程详情');
        activatedRoute.params.forEach((param: { pid: string }) => {
            this.projectID = param == null ? null : param.pid;
        });
        if (this.projectID === null) {
            this.router.navigate(['/order/project']);
        } else {
            this.srv.queryProject({
                pager: { index: 1, size: 10 },
                filter: { ID: this.projectID }
            }).subscribe((data) => {
                if (data == null || data.data.length === 0) {
                    this.router.navigate(['/order/project']);
                } else {
                    this.project = data.data[0];
                    this.initData();
                }
            });
        }
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
        this.layout.removeLastBreadcrumb();
    }

    public ngOnInit() {
        this.queryProduct();
        this.querySelectedProduct();
        this.queryWorkers();
        this.querySelectedWorkers();
    }

    public initData() {
        this.srv.queryPackages().subscribe((packages) => {
            this.packages = packages;
        });
    }

    public query = {
        packageID: null,
        categoryID: null,
        brandID: null,
        skillID: null
    };

    public packageChanged(packageID: number) {
        this.query.categoryID = null;
        this.categories = [];
        if (packageID != null) {
            this.srv.queryCategoriesByPackageID(packageID).subscribe((categories) => {
                this.categories = categories;
            });
        }
        this.categoryChanged(null);
    }

    public categoryChanged(categoryID: number) {
        this.query.brandID = null;
        this.brands = [];
        if (categoryID != null) {
            this.srv.queryBrandsByCategoryID(categoryID).subscribe((brands) => {
                this.brands = brands;
                console.log(brands);
            });
        }
    }

    @ViewChild('candidateProductDataGrid') public candidateProductDataGrid: DataGridComponent;
    @ViewChild('selectedProductDataGrid') public selectedProductDataGrid: DataGridComponent;
    public queryProduct() {
        this.srv.queryCandidateProducts(this.query.categoryID, this.query.brandID).subscribe((products) => {
            this.candidateProductDataGrid.setData(products);
        });
    }
    public querySelectedProduct() {
        this.srv.querySelectedProducts(this.projectID).subscribe((products) => {
            this.selectedProductDataGrid.setData(products);
        });
    }
    public addProduct(product: Product) {
        this.dialog.open(ProductSelectorComponent, {
            disableClose: true,
            width: '500px'
        }).afterClosed().subscribe((value: number) => {
            if (value != null) {
                this.srv.addSelectProduct(this.projectID, product.ID, value).subscribe(() => {
                    this.snackBar.open(`操作成功！`, null, { duration: 1000 });
                    this.querySelectedProduct();
                });
            }
        });
    }
    public editProductQuantity(product: Product) {
        this.dialog.open(ProductSelectorComponent, {
            disableClose: true,
            width: '500px',
            data: product.Quantity
        }).afterClosed().subscribe((value: number) => {
            if (value != null) {
                this.srv.editSelectProductQuantity(this.projectID, product.ID, value).subscribe(() => {
                    this.snackBar.open(`操作成功！`, null, { duration: 1000 });
                    this.querySelectedProduct();
                });
            }
        });
    }
    public delProduct(product: Product) {
        this.dialog.open(ProductDeleteComponent, {
            disableClose: true,
            width: '500px',
            data: product
        }).afterClosed().subscribe((value: number) => {
            if (value) {
                this.srv.delSelectProduct(this.projectID, product.ID).subscribe(() => {
                    this.snackBar.open(`操作成功！`, null, { duration: 1000 });
                    this.querySelectedProduct();
                });
            }
        });
    }

    @ViewChild('candidateWorkerDataGrid') public candidateWorkerDataGrid: DataGridComponent;
    @ViewChild('selectedWorkerDataGrid') public selectedWorkerDataGrid: DataGridComponent;
    public queryWorkers() {
        this.srv.queryCandidateWorkers(this.query.skillID).subscribe((workers) => {
            this.candidateWorkerDataGrid.setData(workers);
        });
    }
    public querySelectedWorkers() {
        this.srv.querySelectedWorkers(this.projectID).subscribe((workers) => {
            this.selectedWorkerDataGrid.setData(workers);
        });
    }
    public addWorker(worker: MxWorker) {
        this.dialog.open(JobSelectorComponent, {
            disableClose: true,
            width: '500px'
        }).afterClosed().subscribe((value: number) => {
            if (value != null) {
                this.srv.addSelectWorker(this.projectID, worker.MxcomeNO, worker.ID, value).subscribe(() => {
                    this.snackBar.open(`操作成功！`, null, { duration: 1000 });
                    this.querySelectedWorkers();
                });
            }
        });
    }
    public delWorker(worker: MxWorker) {
        this.dialog.open(JobDeleteComponent, {
            disableClose: true,
            width: '500px',
            data: worker
        }).afterClosed().subscribe((value: number) => {
            if (value) {
                this.srv.delSelectWorker(this.projectID, worker.DpsID).subscribe(() => {
                    this.snackBar.open(`操作成功！`, null, { duration: 1000 });
                    this.querySelectedWorkers();
                });
            }
        });
    }

    // 用户已选
    @ViewChild('myWorkerDataGrid') public myWorkerDataGrid: DataGridComponent;
    @ViewChild('myMaterialDataGrid') public myMaterialDataGrid: DataGridComponent;

    public queryWorkerMaterial() {
        this.srv.queryWorkerMaterial(this.projectID).subscribe((worker) => {
            console.log('------response [0] = ' + worker[0]);
            console.log('------response [1] = ' + worker[1]);
            this.myWorkerDataGrid.setData(worker[0]);
            this.myMaterialDataGrid.setData(worker[1]);
        });
    }
}
