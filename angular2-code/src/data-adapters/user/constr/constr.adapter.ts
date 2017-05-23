import { Injectable } from '@angular/core';
import { UserConstr } from './constr.model';
import { UserConstrCert } from './constr-cert.model';
import { StaticHosts } from '../../api.config';
import { GlobalDicts } from '../../app.dicts';

@Injectable()
export class UserConstrAdapter {
    public fromQueryUsers(response: any): { total: number, data: UserConstr[] } {
        const result: UserConstr[] = [];
        for (const res of response.res) {
            if (res != null) {
                let cest = res.state === 0 ? 0 : parseInt(`${res.state}`.charAt(0));
                let trst = res.state === 0 ? 0 : parseInt(`${res.state}`.charAt(1));
                if (isNaN(cest)) {
                    cest = 0;
                }
                if (isNaN(trst)) {
                    trst = 0;
                }
                const user: UserConstr = {
                    ID: res.user_id,
                    Name: res.user_name,
                    Nickname: res.nick_name,
                    Phone: res.tel,
                    Sex: res.sex,
                    Avatar: StaticHosts.GetRes(res.pic),
                    TypeID: res.user_type,
                    Type: GlobalDicts.Construction.User.Type[res.user_type],
                    CreateTimestamp: res.create_time,
                    CreateTime: new Date(res.create_time),
                    CertStatusID: cest,
                    CertStatus: GlobalDicts.Construction.User.Status.Certification[cest],
                    TrainingStatusID: trst,
                    TrainingStatus: GlobalDicts.Construction.User.Status.Training[trst]
                };
                if (res.accredited_info != null) {
                    user.CertInfo = this.convertUserCertInfo(JSON.parse(res.accredited_info));
                }
                result.push(user);
            }
        }
        return { total: response.rows, data: result };
    }

    public convertUserCertInfo(res: any): UserConstrCert {
        if (res == null) {
            return null;
        }
        const result: UserConstrCert = {
            Age: res.age,
            Name: res.user_name,
            CardID: res.card_id,
            Sex: res.sex,
            WorkYears: res.gz_year,
            Location: res.location,
            StyleIDs: res.style == null ? [] : res.style,
            Styles: [],
            SkillIDs: res.skill == null ? [] : res.skill,
            Skills: [],
            FailedDescription: res.notpass_desc,
            SparePhone: res.bak_tel,
            TypeID: res.user_type,
            Type: GlobalDicts.Construction.User.Type[res.user_type]
        };
        for (const skillID of result.SkillIDs) {
            let skill = GlobalDicts.Construction.User.Skill[skillID];
            if (skill == null) {
                skill = skillID;
            }
            result.Skills.push(skill);
        }
        for (const styleID of result.StyleIDs) {
            let style = GlobalDicts.Construction.User.Style[styleID];
            if (style == null) {
                style = styleID;
            }
            result.Styles.push(style);
        }
        return result;
    }
}
