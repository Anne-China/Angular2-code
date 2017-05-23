import { UrlCombine } from '../utils/func';

// /** ---------- 正式环境 主机地址---------- */
// export const ApiHosts = {
//     main: 'http://119.23.16.167:9681/mxcome/',
//     commonUploadUrl: 'http://119.23.16.167:9681/mxcome/appjrc/doUploadImg.do',
//     phoneAppUploadUrl: 'http://119.23.16.167:9681/mxcome/webService/doUploadApp.do'
// };
//
// /** ---------- 正式环境 静态资源主机地址---------- */
// export const StaticHosts = {
//     /** 默认资源主机地址 */
//     default: 'http://119.23.16.167:9681/mxcome/',
//     GetRes: (path: string, host: string = 'default') => {
//         if (path == null) {
//             return null;
//         }
//         return (/^https?\:\/\//.test(path) ? path : UrlCombine(StaticHosts[host], path));
//     }
// };
/** ---------- 测试环境 主机地址---------- */
export const ApiHosts = {
    main: 'http://192.168.1.128:8080/mxcome/',
    commonUploadUrl: 'http://192.168.1.128:8080/mxcome/appjrc/doUploadImg.do?dev_mode=true',
    phoneAppUploadUrl: 'http://192.168.1.128:8080/mxcome/webService/doUploadApp.do?dev_mode=true'
};

/** ---------- 测试环境 静态资源主机地址---------- */
export const StaticHosts = {
    /** 默认资源主机地址 */
    default: 'http://192.168.1.128:8080/mxcome/',
    GetRes: (path: string, host: string = 'default') => {
        if (path == null) {
            return null;
        }
        return (/^https?\:\/\//.test(path) ? path : UrlCombine(StaticHosts[host], path));
    }
};
