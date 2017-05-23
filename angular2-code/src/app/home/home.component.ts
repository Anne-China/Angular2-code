import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { Passport } from '../../framework';
import { DataGridComponent } from '../../utils';

@Component({
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements AfterViewInit {
  constructor(
    public passport: Passport
  ) {
    for (let i = 0; i < 48; i++) {
      this.data.push({
        userid: `user-${i}`,
        name: `姓名-${i}`,
        balance: 9 * i,
        freeze: i,
        total: 10 * i,
        province: `湖南-${i}`,
        city: `长沙-${i}`,
        district: `岳麓区-${i}`,
        address: `麓谷-${i}`,
      });
    }
  }

  public ngAfterViewInit() {
    this.dataGrid.setData(this.data);
  }

  public testModel: string;

  public ss: string;

  @ViewChild('userDataGrid') public dataGrid: DataGridComponent;

  public data: any[] = [];

  public rowBtn(row: any) {
    alert(row.userid);
  }

  public ssChange(e) {
    this.dataGrid.rows[0].data.name = e;
  }
}
