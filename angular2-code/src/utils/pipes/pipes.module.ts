import { NgModule } from '@angular/core';
import { JoinPipe } from './join';
import { RangePipe } from './range';

/**
 * 自定义管道模块声明
 *
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    exports: [JoinPipe, RangePipe],
    declarations: [JoinPipe, RangePipe]
})
export class CustomPipesModule { }
