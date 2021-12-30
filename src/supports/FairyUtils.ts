/** 检查是否fgui的默认命名 */
const isDefaultName = (name: string) => {
    if (!name) return true;
    const firstChar = name.charAt(0);
    if (firstChar === 'n' || firstChar === 'c' || firstChar === 't') {
        // eslint-disable-next-line no-restricted-globals
        return !isNaN(Number(name.substring(1)));
    }
    return false;
};

/**
 * 只能计算一行或者一列，自由摆放的无法计算
 */
const getListWidth = (list: fgui.GList) => {
    // list.columnCount 是设计中用的，不是计算得到的，所以不能用
    const count = list.numItems;
    if (count === 0) return 0;
    const { scaleX } = list;
    let result = 0;
    for (let i = 0; i < count; i++) {
        result += list.getChildAt(0).width;
    }
    result += (count - 1) * list.columnGap;
    result *= scaleX;
    return result;
};

const getListHeight = (list: fgui.GList) => {
    const count = list.numItems;
    if (count === 0) return 0;
    const { scaleY } = list;
    let result = 0;
    for (let i = 0; i < count; i++) {
        result += list.getChildAt(0).height;
    }
    result += (count - 1) * list.lineGap;
    result *= scaleY;
    return result;
};

/** 设置组件扩展 */
const setExtension = <T extends fgui.GComponent>(pkgName: string, itemName: string, type: { new (): T }) => {
    fgui.UIObjectFactory.setPackageItemExtension(fgui.UIPackage.getItemURL(pkgName, itemName), type);
};

/** 获取所有fgui组件中的子对象(非默认命名) */
const getMembersInfo = (skin: fgui.GComponent) => {
    const result = {};
    // children
    let i = 0;
    let len = 0;
    for (i = 0, len = skin.numChildren; i < len; i++) {
        const child = skin.getChildAt(i);
        const childName = child.name;
        // 忽略空命名
        if (!isDefaultName(childName)) {
            result[childName] = child;
        }
    }
    // transition
    const transitionList: fgui.Transition[] = skin._transitions;
    for (i = 0, len = transitionList.length; i < len; i++) {
        const t = transitionList[i];
        const tName = t.name;
        // 忽略空命名
        if (!isDefaultName(tName)) {
            result[tName] = t;
        }
    }
    // controller
    const controllerList: fgui.Controller[] = skin._controllers;
    for (i = 0, len = controllerList.length; i < len; i++) {
        const c = controllerList[i];
        const cName = c.name;
        // 忽略空命名
        if (!isDefaultName(cName)) {
            result[cName] = c;
        }
    }
    return result;
};

/** 创建一个list的渲染器 */
export type ListRendererType = (list: fgui.GList, data: unknown[]) => void;
const createListRenderer = (
    caller: unknown,
    render: { (index: number, item: fgui.GObject, data: unknown) },
): ListRendererType => {
    return (list: fgui.GList, data: unknown[]) => {
        list.removeChildrenToPool();
        for (let i = 0, len = data.length; i < len; i++) {
            const item = list.addItemFromPool();
            render.call(caller, i, item, data[i]);
        }
    };
};

/** 动态渲染list */
const renderList = (
    list: fgui.GList,
    data: unknown[],
    caller: unknown,
    render: { (index: number, item: fgui.GObject, data: unknown) },
) => {
    list.removeChildrenToPool();
    for (let i = 0, len = data.length; i < len; i++) {
        const item = list.addItemFromPool();
        render.call(caller, i, item, data[i]);
    }
};

export const FairyUtils = {
    getListWidth,
    getListHeight,
    setExtension,
    getMembersInfo,
    createListRenderer,
    renderList,
};
