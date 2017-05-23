import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DataGridComponent, DataLoaderParameter } from '../../../../utils';
import { MdDialogRef } from '@angular/material';
import { ClientProject, DesignerService } from '../../../../data-adapters/order';

@Component({
    templateUrl: 'designer.component.html',
    styleUrls: ['designer.component.scss'],
})
export class DesignerComponent implements AfterViewInit {
    public clientProject: ClientProject = {};
    constructor(
        public dialogRef: MdDialogRef<DesignerComponent>,
        public srv: DesignerService,
    ) { }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;

    public queryData() {
        this.dataGrid.loadData();
    }
    public ngAfterViewInit() {
        setTimeout(() => {
            this.queryData();
        });
    }
    public query = {
        MxcomeId: null
    };
    public getFilter = () => {
        return { ...this.query };
    }
    public designerLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryDesigner(parameter);
    }

    public save() {
        this.dialogRef.close(this.dataGrid.selectedItem);
    }
}
