import { Injectable } from '@angular/core';
import { ClientProject, Address, HouseInfo, Product, MxWorker, ChoiceItem} from './project.model';
import { DataLoaderParameter } from '../../../utils/dataloader-parameter';
import { GlobalDicts } from '../../app.dicts';
import { IsBlank } from '../../../utils/func';
import { Category } from '../../material/categories/category.model';
import { Brand } from '../../material/brands/brands.model';
import { StaticHosts } from '../../api.config';

@Injectable()
export class ClientProjectAdapter {
    public fromQueryProject(response: any): { total: number, data: ClientProject[] } {
        const result: ClientProject[] = [];
        for (const res of response.res) {
            if (res != null) {
                const project: ClientProject = {
                    ID: res.mDecora.pid,
                    Publisher: res.mDecora.pusher,
                    PublishTime: res.mDecora.add_time,
                    ContactName: res.mDecora.user_name,
                    ContactGender: res.mDecora.sex,
                    ContactPhone: res.mDecora.mx_pj_tel,
                    Address: {
                        Country: res.country,
                        Province: res.province,
                        City: res.city,
                        District: res.county,
                        Street: res.address,
                        Estate: res.mDecora.estate.remark,
                        Building: res.mDecora.estate.dongNo,
                        Unit: res.mDecora.estate.unitNo,
                        Floor: res.mDecora.estate.floor,
                        Doorplate: res.mDecora.estate.doorplate,
                    },
                    HouseInfo: {
                        IndoorArea: res.mDecora.house.carpetArea,
                        OutdoorArea: res.mDecora.house.outdoorArea,
                        Room: res.mDecora.house.room,
                        Hall: res.mDecora.house.hall,
                        Kitchen: res.mDecora.house.galley,
                        Bathroom: res.mDecora.house.toilet,
                        Garage: res.mDecora.house.garage
                    },
                    TypeID: res.de_type,
                    Type: GlobalDicts.Client.Project.Types[res.de_type],
                    DesignerID: res.design_id,
                    DesignerName: res.design_name
                };
                const addr = project.Address;
                addr.Area = `${addr.Province}${addr.City}${addr.District}${addr.Street}`;
                addr.Detail = addr.Estate;
                if (!IsBlank(addr.Building)) {
                    addr.Detail += `${addr.Building}栋`;
                }
                if (!IsBlank(addr.Unit)) {
                    addr.Detail += `${addr.Unit}单元`;
                }
                if (!IsBlank(addr.Floor)) {
                    addr.Detail += `${addr.Floor}楼`;
                }
                if (!IsBlank(addr.Doorplate)) {
                    addr.Detail += `${addr.Doorplate}房`;
                }
                const hinfo = project.HouseInfo;
                hinfo.Detail = '';
                if (hinfo.Room > 0) {
                    hinfo.Detail += `${hinfo.Room}室`;
                }
                if (hinfo.Hall > 0) {
                    hinfo.Detail += `${hinfo.Hall}厅`;
                }
                if (hinfo.Kitchen > 0) {
                    hinfo.Detail += `${hinfo.Kitchen}厨`;
                }
                if (hinfo.Bathroom > 0) {
                    hinfo.Detail += `${hinfo.Bathroom}卫`;
                }
                if (hinfo.Garage > 0) {
                    hinfo.Detail += `${hinfo.Garage}车库`;
                }
                result.push(project);
            }
        }
        return { total: response.rows, data: result };
    }

    public toQueryProjectParameter(value: DataLoaderParameter) {
        if (value == null) {
            return {};
        }
        const params = JSON.parse(JSON.stringify(value));
        if (value.filter != null) {
            params.filter = {};
            params.filter['customer'] = value.filter['Publisher'];
            params.filter['tel'] = value.filter['ContactPhone'];
            params.filter['pid'] = value.filter['ID'];
        }
        return params;
    }

    public fromQueryCategoriesByPackageID(res: any[]) {
        if (res == null) {
            return [];
        }
        const result: Category[] = [];
        for (const item of res) {
            result.push({
                Name: item.catory_name,
                ID: item.catory_id
            });
        }
        return result;
    }

    public fromQueryBrandsByCategoryID(response: any[]) {
        if (response == null) {
            return [];
        }
        const result: Brand[] = [];
        for (const res of response) {
            result.push({
                ID: res.brand_id,
                Name: res.brand_name,
                Logo: StaticHosts.GetRes(res.brand_pic),
                RecommandWeight: res.is_tui,
                SellWellWeight: res.is_hot,
                Provider: { ID: res.supplier, Name: res.sup_name }
            });
        }
        return result;
    }

    public fromQueryProducts(response: any[]) {
        if (response == null) {
            return [];
        }
        const result: Product[] = [];
        for (const res of response) {
            const product: Product = {
                ID: res.product_id,
                Name: res.product_name,
                CategoryName: res.category_name,
                CategoryID: res.category,
                BrandName: res.brand_name,
                BrandID: res.brand,
                Price: res.price,
                Stock: res.stock,
                Quantity: res.num
            };
            if (res.speci_model != null) {
                try {
                    product.Specification = JSON.parse(res.speci_model);
                } catch (error) {
                    product.Specification = [res.speci_model];
                }
            }
            result.push(product);
        }
        return result;
    }

    public fromQueryCandidateWorkers(response: any[]) {
        if (response == null) {
            return [];
        }
        const result: MxWorker[] = [];
        for (const res of response) {
            const mxworker: MxWorker = {
                ID: res.pv_id,
                Name: res.user_name,
                NickName: res.nick_name,
                Score: res.score,
                SkillIDs: res.skill_style == null ? [] : JSON.parse(res.skill_style),
                Skills: [],
                GetOrders: res.getorder_l,
                MxcomeNO: res.mxcome_no,
                WorkYears: res.gz_year,
                Gender: res.sex,
                Avatar: StaticHosts.GetRes(res.pic)
            };
            for (const skillID of mxworker.SkillIDs) {
                const skillName = GlobalDicts.Construction.User.Skill[skillID];
                if (skillName != null) {
                    mxworker.Skills.push(skillName);
                }
            }
            result.push(mxworker);
        }
        return result;
    }

    public fromQuerySelectedWorkers(response: any[]) {
        if (response == null) {
            return [];
        }
        const result: MxWorker[] = [];
        for (const res of response) {
            const mxworker: MxWorker = {
                ID: res.pv_id,
                Name: res.user_name,
                Score: res.score,
                GetOrders: res.getorder_l,
                MxcomeNO: res.mxcome_no,
                WorkYears: res.gz_year,
                Gender: res.sex,
                Avatar: StaticHosts.GetRes(res.pic),
                JobID: res.job,
                Job: GlobalDicts.Construction.User.Skill[res.job],
                DpsID: res.dps_id
            };
            result.push(mxworker);
        }
        return result;
    }

    public fromQuerySelectedWorkerMaterial(response: any) {
        if (response == null) {
            return [];
        }
        const res1: ChoiceItem[] = [];
        if (response.res1 != null) {
            for (const res of response.res1) {
                const choiceItem: ChoiceItem = {
                    itemId: res.itemId,
                    itemValue: res.itemValue,
                    ititle: res.ititle,
                    desc: res.desc
                };
                res1.push(choiceItem);
            }
        }

        const res2: ChoiceItem[] = [];

        if (response.res2 != null) {
            for (const res of response.res2) {
                const choiceItem: ChoiceItem = {
                    itemId: res.itemId,
                    itemValue: res.itemValue,
                    ititle: res.ititle,
                    desc: res.desc
                };
                res2.push(choiceItem);
            }
        }

        console.log('------res1------' + res1);
        console.log('------res2------' + res2);
        const res = [];
        res.push(res1);
        res.push(res2);
        return res;
    }
}
