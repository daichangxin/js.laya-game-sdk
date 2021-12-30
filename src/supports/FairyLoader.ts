import { CacheManager } from '../net/CacheManager';
import { RES } from '../net/Res';
import { FairyRes } from './FairyRes';

export class FairyLoader extends fgui.GLoader {
    static _$id = 0;
    failIcon: string;
    /** 缩略资源，只支持同步资源访问 */
    thumbIcon: string;
    private _$id = 0;

    private _preURL: string;
    private _isRendered: boolean;

    constructor() {
        super();
        this.touchable = false;
        FairyLoader._$id += 1;
        this._$id = FairyLoader._$id;
    }

    protected loadContent() {
        const pre = this._preURL;
        if (pre && pre !== this.url) {
            CacheManager.inst.addToDisposeQueue(pre);
        }
        this._preURL = this.url;
        this._isRendered = false;
        super.loadContent();
        // 如果这时没有渲染完，说明是异步的资源
        if (!this._isRendered && this.thumbIcon) {
            this.setTempURL(this.thumbIcon);
        }
    }

    protected loadExternal() {
        const texture = RES.getRes(this.url);
        if (texture) {
            this.onExternalLoadSuccess(texture);
        } else {
            super.loadExternal();
        }
    }

    protected async loadFromPackage(itemURL: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const item = fgui.UIPackage.getItemByURL(itemURL);
            if (item && item.owner && item.owner.customId) {
                const pkgRes = FairyRes.getPackageRes(item.owner.customId);
                if (pkgRes && !pkgRes.isAllLoaded) {
                    pkgRes
                        .loadAll()
                        .then(() => {
                            super.loadFromPackage(itemURL);
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    return;
                }
            }
            this._isRendered = true;
            super.loadFromPackage(itemURL);
            resolve();
        });
    }

    protected onExternalLoadSuccess(texture: Laya.Texture) {
        this._isRendered = true;
        // 这里的texture，因为多次调用url，导致不准
        const pre = texture ? texture.url : null;
        const trueUrl = super.url;
        const trueTexture = RES.getRes(trueUrl);
        if (pre !== trueUrl) {
            // Console.warn('test', '重复url 保护触发, pre & now:', pre, true_url);
        }
        if (!trueTexture) {
            console.warn('test', `GLoader.error, url:${trueUrl}`, this._$id);
            return;
        }
        super.onExternalLoadSuccess(trueTexture);
        CacheManager.inst.removeFromDisposeQueue(trueUrl);
        // Console.warn('success', 'GLoader, url:' + true_url, this.__id);
    }

    /** 设置临时icon贴图，只支持同步资源 */
    setTempURL(url: string) {
        if (fgui.ToolSet.startsWith(url, 'ui://')) {
            this.loadFromPackage(url);
        } else {
            this.content.texture = RES.getRes(url);
        }
    }

    protected onExternalLoadFailed() {
        super.onExternalLoadFailed();
        if (super.url !== this.failIcon && this.failIcon) {
            this.setTempURL(this.failIcon);
        } else {
            console.warn('test', `GLoader.onExternalLoadFailed, url:${this.url}`, this._$id);
        }
    }
}
