import { Singleton } from '@pawgame/game-library';

export enum CacheType {
    NONE = 0,
    FOREVER = 1,
}

interface CacheInfo {
    url: string;
    lastUsedTime: number;
    usedTimes: number;
}

export class CacheManager {
    static get inst() {
        return Singleton.get(CacheManager);
    }

    private _cacheTypeDic: Record<string, CacheType>;
    private _todoDic: Record<string, CacheInfo>;

    constructor() {
        this._cacheTypeDic = {};
        this._todoDic = {};
    }

    startUp() {
        Laya.timer.loop(1000, this, this.dispose);
    }

    setCacheType(url: string, type: CacheType) {
        this._cacheTypeDic[url] = type;
    }

    private dispose() {
        const now = Date.now();
        const all = Object.entries(this._todoDic);
        all.forEach(([url, cacheInfo]) => {
            if (cacheInfo.usedTimes > 0) return;
            if (this._cacheTypeDic[url] === CacheType.FOREVER) return;
            if (now - cacheInfo.lastUsedTime <= 20000) return;
            this.disposeTexture(url);
        });
    }

    private disposeTexture(url: string) {
        Laya.loader.cancelLoadByUrl(url);
        Laya.loader.clearTextureRes(url);
        // Console.log('sys', 'CacheManager.disposeTexture:', url);
        if (url in this._todoDic) {
            this._todoDic[url] = null;
            delete this._todoDic[url];
        }
    }

    addToDisposeQueue(url: string, now?: boolean) {
        if (now) {
            this.disposeTexture(url);
        } else {
            let cacheVo = this._todoDic[url];
            if (!cacheVo) {
                cacheVo = { url, lastUsedTime: Date.now(), usedTimes: 0 };
                this._todoDic[url] = cacheVo;
            } else {
                cacheVo.lastUsedTime = Date.now();
                cacheVo.usedTimes -= 1;
            }
            // Console.log('sys', 'addToDisposeQueue, url' + url + ', usedTimes:' + cacheVo.usedTimes);
        }
    }

    removeFromDisposeQueue(url: string) {
        let cacheVo = this._todoDic[url];
        if (!cacheVo) {
            cacheVo = { url, lastUsedTime: Date.now(), usedTimes: 1 };
            this._todoDic[url] = cacheVo;
        } else {
            cacheVo.usedTimes += 1;
            cacheVo.lastUsedTime = Date.now();
        }
        // Console.log('sys', 'removeFromDisposeQueue, url' + url + ', usedTimes:' + cacheVo.usedTimes);
    }
}
