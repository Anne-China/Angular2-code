import { FileItem } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadResultType } from './file-upload-result-type';

export interface FileUploadResult {
    file: FileItem;
    url: string;
    status: FileUploadResultType;
}
