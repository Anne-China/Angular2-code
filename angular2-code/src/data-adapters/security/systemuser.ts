import { SystemRole } from './systemrole';
import { UserSpecialPrivilege } from './user-special-privilege';

export interface SystemUser {
    ID?: string;
    UserName?: string;
    Name?: string;
    Avatar?: string;
    Roles?: SystemRole[];
    Privileges?: UserSpecialPrivilege[];
}
