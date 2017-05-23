import { Injectable } from '@angular/core';
import { SystemUser } from './systemuser';
import { SystemRole } from './systemrole';
import { Privilege } from './privilege';
import { UserSpecialPrivilege } from './user-special-privilege';

/** 登录接口数据适配器 */
@Injectable()
export class SecurityAdapter {
    public login(response: any): SystemUser {
        if (response == null || response.lenth === 0) {
            return;
        }
        const user: SystemUser = {
            ID: response[0].sys_user_id,
            UserName: response[0].user_name,
            Name: response[0].zs_name,
            Avatar: response[0].head_img
        };
        return user;
    }

    public queryUserPrivilege(response: any): { roles: SystemRole[], privileges: UserSpecialPrivilege[] } {
        const result: { roles: SystemRole[], privileges: UserSpecialPrivilege[] } = { roles: [], privileges: [] };
        if (response == null) {
            return result;
        }
        if (response.funcs != null) {
            for (const func of response.funcs) {
                const privilege = this.convertUserSpecialPrivilege(func);
                if (privilege != null) {
                    result.privileges.push(privilege);
                }
            }
        }
        if (response.roles != null) {
            for (const item of response.roles) {
                const role = this.convertSystemRole(item);
                if (role != null) {
                    result.roles.push(role);
                }
            }
        }
        return result;
    }

    public queryRolePrivileges(response: any): Privilege[] {
        const result: Privilege[] = [];
        if (response == null) {
            return result;
        }
        for (const func of response) {
            const privilege = this.convertPrivilege(func);
            if (privilege != null) {
                result.push(privilege);
            }
        }
        return result;
    }

    private convertPrivilege(func: any): Privilege {
        if (func == null) {
            return;
        }
        const result: Privilege = {
            Code: func.funcode,
            Name: func.func_name,
            Url: func.func_url,
            ParentCode: func.parent_code
        };
        return result;
    }

    private convertUserSpecialPrivilege(func: any): UserSpecialPrivilege {
        const privilege = this.convertPrivilege(func) as UserSpecialPrivilege;
        privilege.Denied = !!func.denied;
        return privilege;
    }

    private convertSystemRole(role: any): SystemRole {
        if (role == null) {
            return;
        }
        const result: SystemRole = {
            ID: role.role_id,
            Name: role.role_name,
            Privileges: []
        };
        return result;
    }
}
