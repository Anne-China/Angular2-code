import { Injectable } from '@angular/core';
import { Provider } from './provider.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';

@Injectable()
export class ProviderAdapter {
    public fromQueryProviders(response: any): { total: number, data: Provider[] } {
        const result: Provider[] = [];
        for (const res of response.res) {
            if (res != null) {
                result.push(this.convertProvider(res));
            }
        }
        return { total: response.rows, data: result };
    }

    public fromQueryProviderByIDs(response: any[]): Provider[] {
        const result: Provider[] = [];
        for (const res of response) {
            if (res != null) {
                result.push(this.convertProvider(res));
            }
        }
        return result;
    }

    public toQueryProviderParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['sup_name'] = value.filter['Name'];
        }
        return params;
    }

    public toAddProvider(value: Provider) {
        return value == null ? {} : {
            sup_name: value.Name,
            adress: value.Address,
            tel: value.Phone,
            level: value.Level
        };
    }

    public toEditProvider(value: Provider) {
        return value == null ? {} : { sup_id: value.ID, ...this.toAddProvider(value) };
    }

    private convertProvider(res: any) {
        const provider: Provider = {
            ID: res.sup_id,
            Name: res.sup_name,
            Phone: res.tel,
            Address: res.adress,
            Level: res.level
        };
        return provider;
    }
}
