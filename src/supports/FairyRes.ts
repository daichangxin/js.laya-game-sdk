import { PackageRes } from './PackageRes';

/** 异步加载fairy包中引用的所有美术资源 */
const loadPackageItems = (pkg: fgui.UIPackage): Promise<void> => {
    return new Promise((resolve, reject) => {
        // console.log('test', 'loadPackageItems.start', pkg.name);
        if (Object.prototype.hasOwnProperty.call(pkg, '_items')) {
            // eslint-disable-next-line dot-notation
            const allItems: { file: string }[] = pkg['_items'];
            const reqList: { url: string; type?: string; priority?: number }[] = [];
            allItems.forEach((item) => {
                if (!item.file) return;
                reqList.push({ url: item.file, type: Laya.Loader.IMAGE });
            });
            // console.log('test', 'loadPackageItems.reqList.length:', reqList.length);
            if (reqList.length) {
                // console.log('test', 'loadPackageItems', pkg.name, Stringf.stringify(reqList));
                Laya.loader.load(
                    reqList,
                    Laya.Handler.create(null, (res) => {
                        if (res) {
                            // console.log('test', 'loadPackageItems.complete', pkg.name);
                            resolve();
                        } else {
                            // console.warn('test', 'loadPackageItems.fail', pkg.name);
                            reject();
                        }
                    }),
                );
            } else {
                // console.warn('test', 'loadPackageItems.none reqList@pkg', pkg.name);
                resolve();
            }
        } else {
            // console.warn('test', 'loadPackageItems.none _items@pkg', pkg.name);
            resolve();
        }
    });
};

/** 异步加载fairygui包定义文件 */
const loadPackage = (resName: string): Promise<fgui.UIPackage> => {
    return new Promise((resolve, reject) => {
        // console.log('test', 'loadPackage', resName);
        Laya.loader.load(
            `${resName}.${fgui.UIConfig.packageFileExtension}`,
            Laya.Handler.create(null, (res) => {
                if (res) {
                    const pkg = fgui.UIPackage.addPackage(resName);
                    // console.log('test', 'loadPackage.complete', resName);
                    resolve(pkg);
                } else {
                    // console.warn('test', 'loadPackage.fail', resName);
                    reject(res);
                }
            }),
            null,
            Laya.Loader.BUFFER,
        );
    });
};

const _resDic: Record<string, PackageRes> = {};
const getPackageRes = (resName: string) => {
    let res = _resDic[resName];
    if (!res) {
        res = new PackageRes(resName);
        _resDic[resName] = res;
    }
    return res;
};

export const FairyRes = {
    loadPackageItems,
    loadPackage,
    getPackageRes,
};
