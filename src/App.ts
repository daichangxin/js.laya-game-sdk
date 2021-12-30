import { GFacade } from '@pawgame/game-library';
import { EventConsts } from './consts/EventConsts';
import { CacheManager } from './net/CacheManager';
import { RES } from './net/Res';
import { FairyLoader } from './supports/FairyLoader';
import { FairySkinBase } from './supports/FairySkinBase';
import { Resize } from './utils/Resize';

export class App {
    static readonly inst = new App();
    private _isAwaken = true;

    init() {
        fgui.UIObjectFactory.setLoaderExtension(FairyLoader);
        Laya.stage.addChild(fgui.GRoot.inst.displayObject);

        // stage 变化
        const { stage } = Laya;
        stage.on(Laya.Event.RESIZE, this, this.onResize);
        this.onResize();

        stage.on('blur', this, this.onStageBlur);
        stage.on('focus', this, this.onStageFocus);

        this.initLaya();
        this.initFairyGUI();

        CacheManager.inst.startUp();
    }

    private initLaya() {
        // 增加webP解析支持
        Laya.Loader.typeMap.webp = 'image';
    }

    private initFairyGUI() {
        // 覆盖fairygui的getChild方法，提高性能
        const rawNewObject = fgui.UIObjectFactory.newObject;
        fgui.UIObjectFactory.newObject = (pi: fgui.PackageItem): fgui.GObject => {
            if (!pi.extensionType && pi.objectType === fgui.ObjectType.Component) {
                const skin = new FairySkinBase();
                skin.packageItem = pi;
                return skin;
            }
            return rawNewObject(pi);
        };

        // fgui的getRes增加地址过滤，方便使用webP
        fgui.AssetProxy.inst.getRes = (url: string) => {
            return RES.getRes(url);
        };
    }

    pause() {
        this._isAwaken = false;
        GFacade.inst.dispatch(EventConsts.STAGE_SLEEP);
    }

    resume() {
        this._isAwaken = true;
        GFacade.inst.dispatch(EventConsts.STAGE_AWAKEN);
    }

    get isAwaken() {
        return this._isAwaken;
    }

    private onStageBlur() {
        this.pause();
    }

    private onStageFocus() {
        this.resume();
    }

    private onResize() {
        const { width, height } = Laya.stage;
        Resize.resize(width, height);
    }
}
