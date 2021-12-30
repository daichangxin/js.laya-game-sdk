import { Panel } from './Panel';
import { IScene } from './Scene';
import { View } from './View';
/** 异步面板场景封装 */
export class AsyncScene implements IScene {
    protected _panelCls: { new (): Panel };
    protected _data: unknown;

    private readonly _type: number;

    constructor(panelCls: { new (): Panel }, type?: number) {
        this._panelCls = panelCls;
        this._type = type;
    }

    protected showLoading() {
        //
    }

    protected hideLoading() {
        //
    }

    protected doAwaken() {
        //
    }

    protected doSleep() {
        //
    }

    protected doData() {
        //
    }

    set data(v: unknown) {
        this._data = v;
        this.doData();
    }

    get data() {
        return this._data;
    }

    getType() {
        return this._type;
    }

    awaken() {
        const p = View.togglePanel(this._panelCls, 1);
        if (!p.isReady) {
            this.showLoading();
        }
        p.addReady(this, this.hideLoading);
        this.doAwaken();
    }

    sleep() {
        View.togglePanel(this._panelCls, 0);
        this.doSleep();
    }
}
