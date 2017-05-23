import { AddingFileFailedType } from './adding-file-failed-type';

export interface AddingFileFailedEvent {
    file: { name: string, size: number, displaySize: string, mime: string };
    type: AddingFileFailedType;
    options: { queueLimit: number, sizeLimit: number, allowedExtensions: string[] };
    defaultMessage: string;
}
