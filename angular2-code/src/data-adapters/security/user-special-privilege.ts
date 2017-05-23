import { Privilege } from './privilege';

export interface UserSpecialPrivilege extends Privilege {
    Denied?: boolean;
}
