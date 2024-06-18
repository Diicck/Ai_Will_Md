// 引入FileSaver.js
import { saveAs } from 'file-saver';

/**
 * 下载文件
 */
export function download(name = 'temp.txt', data, type = 'blob') {
    if (type == 'blob') {
        let blob = new Blob([data]);
        saveAs(blob, name);
    } else if (type == 'data') {
        saveAs(data, name);
    } else if (type == 'url') {
        window.open(data)
    }

}