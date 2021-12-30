import { FairyRes } from './FairyRes';

export class PackageRes {
    private _resName: string;
    private _pkg: fgui.UIPackage;
    private _isAllLoaded = false;

    constructor(resName: string) {
        this._resName = resName;
    }

    loadAll(): Promise<fgui.UIPackage> {
        if (this._isAllLoaded) {
            return Promise.resolve(this._pkg);
        }
        return new Promise((resolve, reject) => {
            FairyRes.loadPackage(this._resName)
                .then((pkg) => {
                    FairyRes.loadPackageItems(pkg)
                        .then(() => {
                            this._isAllLoaded = true;
                            this._pkg = pkg;
                            resolve(pkg);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getPkg() {
        return this._pkg;
    }

    isAllLoaded() {
        return this._isAllLoaded;
    }
}
