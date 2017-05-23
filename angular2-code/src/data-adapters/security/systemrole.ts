import { Privilege } from './privilege';

export interface SystemRole {
    ID?: number;
    Name?: string;
    Privileges?: Privilege[];
}
