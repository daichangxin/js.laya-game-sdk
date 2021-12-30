import { SkinBase } from '../mvc/SkinBase';
import { RES } from '../net/Res';
import { FairyLoader } from '../supports/FairyLoader';
import { FairyRes } from '../supports/FairyRes';
import { ReadyExecute } from '../utils/ReadyExecute';
/**
 * 特效异步播放
 * 暂时只支持特效独立资源格式（fgui编辑器中设置）
 */
export class GMovieClicp extends SkinBase {
    private _icon: fgui.GLoader;
    private _resReady: ReadyExecute;
    constructor() {
        super(new FairyLoader());
    }

    protected doReady() {
        this._icon = this._skin.asLoader;
        this._icon.align = 'center';
        this._icon.verticalAlign = 'middle';
        this._resReady = new ReadyExecute();
    }

    async setURL(resName: string, itemName: string) {
        this._resReady.isReady = false;
        const pkg = await FairyRes.loadPackage(resName);
        if (!pkg) return;
        const item = pkg.getItemByName(itemName);
        if (!item) return;
        const resURI = `res/ui/${pkg.name}_atlas_${item.id}.png`;
        RES.load(resURI).then(() => {
            this._icon.url = fgui.UIPackage.getItemURL(pkg.name, itemName);
            this._resReady.isReady = true;
        });
    }

    setPlay(times: number, endHandler?: Laya.Handler) {
        if (!this._resReady.isReady) {
            this._resReady.add2(this.setPlay, this, [times, endHandler]);
            return;
        }
        this._icon.content.setPlaySettings(0, -1, times, -1, endHandler);
    }

    dispose() {
        this._icon.dispose();
    }
}
