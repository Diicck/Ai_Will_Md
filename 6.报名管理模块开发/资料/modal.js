// 导入mitt库，一个轻量级的所有前端场景的事件总线（Event Bus）
import mitt from 'mitt'
// 创建一个事件总线实例
export const mitter = mitt();
// 定义一个常量MODELKEY，用作事件命名的前缀
const MODELKEY = 'modal:';

/**
 * 监听指定弹窗（ModalName）的打开和关闭事件
 * @param ModalName
 * @param modalOptions
 */
export const on = (ModalName, modalOptions) => {
    mitter.on(`${MODELKEY}${ModalName}:open`, (arg) => {
        modalOptions.open(arg)
    })
    mitter.on(`${MODELKEY}${ModalName}:close`, (arg) => {
        modalOptions.close(arg)
    })
}
/**
 * 取消监听指定弹窗（ModalName）的事件
 * @param ModalName
 */
export const off = (ModalName) => {
    mitter.off(`${MODELKEY}${ModalName}:open`)
    mitter.off(`${MODELKEY}${ModalName}:close`)
}

/**
 * 打开指定名称的弹窗（ModalName），并传递可选的数据（data）
 * @param ModalName 弹窗Name
 */
export const open = (ModalName, data = null) => {
    mitter.emit(`${MODELKEY}${ModalName}:open`, data)
}

/**
 * 关闭指定名称的弹窗（ModalName），并传递可选的数据（data）
 */
export const close = (ModalName, data = null) => {
    mitter.emit(`${MODELKEY}${ModalName}:close`, data)
}
