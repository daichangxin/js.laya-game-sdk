import { FairyRes } from '../supports/FairyRes';
import { Panel } from './Panel';

export class AsyncPanel extends Panel {
    protected _resName: string;
    protected _pkg: fgui.UIPackage;
    protected _uiName: string;
    protected _preRes: string[];
    protected _isLoading = false;

    constructor(resName: string, uiName: string, panelName?: string) {
        super(null, panelName);
        this._resName = resName;
        this._uiName = uiName;
    }

    protected async load() {
        if (this._isReady || this._isLoading) return;
        this._isLoading = true;
        if (this._preRes) {
            this._preRes.forEach(async (item) => {
                await FairyRes.getPackageRes(item).loadAll();
            });
        }
        const pkgRes = FairyRes.getPackageRes(this._resName);
        await pkgRes.loadAll();
        this._pkg = pkgRes.getPkg();
        if (this._pkg) {
            const oper = new fgui.AsyncOperation();
            oper.createObject(this._pkg.name, this._uiName);
            oper.callback = Laya.Handler.create(this, (skin: fgui.GObject) => {
                this._isLoading = false;
                this.onResReady();
                this.skin = skin;
                if (this._isShow) {
                    super.show();
                }
            });
        } else {
            this.onResError();
            if (this._isShow) {
                this._isShow = false;
            }
        }
        this._isLoading = false;
    }

    protected onResReady() {
        //
    }

    protected onResError() {
        //
    }

    show() {
        if (!this.canShow()) return;
        if (this._isReady) {
            super.show();
            return;
        }

        this._isShow = true;
        if (this._isLoading) return;
        this.load();
    }
}
