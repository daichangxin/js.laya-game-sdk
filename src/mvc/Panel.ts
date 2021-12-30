import { GFacade } from '@pawgame/game-library';
import { EventConsts } from '../consts/EventConsts';
import { Resize } from '../utils/Resize';
import { Scene } from './Scene';
import { SkinBase } from './SkinBase';
import { UILayer } from './UILayer';

export class Panel extends SkinBase {
    protected _isShow: boolean;

    protected _isMode: boolean;
    protected _isPopUp: boolean;
    protected _isCenter: boolean;
    protected _isScene: boolean;
    protected _isUI: boolean;
    protected _usePanelTween: boolean;

    protected _modelBG: fgui.GGraph;

    private _includeList: number[];
    private _excludeList: number[];

    readonly panelName: string;

    constructor(skin?: fgui.GObject, panelName?: string) {
        super(skin);
        this.panelName = panelName;
        this._events[EventConsts.SCENE_CHANGE] = this.checkIncludeOutclude;
    }

    toggleData(data?: unknown) {
        if (!this._isReady) {
            this.addReady(this, this.toggleData, [data]);
            return;
        }
        this.data = data;
    }

    show() {
        if (!this.canShow()) return;
        this._isShow = true;
        const uiLayer = UILayer.inst;
        if (this._isMode) {
            const modelBG = this.getorcreateModelBG();
            const uiSkin = uiLayer.getUIRoot();
            modelBG.setSize(uiSkin.width, uiSkin.height);
            modelBG.setXY(0, 0);
            modelBG.alpha = 0;
            Laya.Tween.clearAll(modelBG);
            Laya.Tween.to(modelBG, { alpha: 1 }, 100);
            uiLayer.showWindow(modelBG);
        }
        if (this._isScene) {
            uiLayer.showScene(this._skin);
        } else if (this._isUI) {
            uiLayer.showUI(this._skin);
        } else if (this._isPopUp) {
            uiLayer.showPopUp(this);
        } else {
            uiLayer.showWindow(this);
        }

        const stageH = Resize.getHeight();
        if (!this._isScene && this._skin.height > stageH) {
            const scale = stageH / this._skin.height;
            this._skin.setScale(scale, scale);
            this._skin.setSize(Math.round(this._skin.width * scale), Math.round(this._skin.height * scale));
        }

        if (this._isCenter) {
            this._skin.center();
        }
        this.doXY();

        if (this._usePanelTween) {
            Laya.Tween.clearAll(this._skin);
            this._skin.setPivot(0.5, 0.5);
            Laya.Tween.to(this._skin, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.quartOut);
        }
        this.doShow();
    }

    hide() {
        this._isShow = false;
        if (this._skin) {
            if (this._usePanelTween) {
                Laya.Tween.clearAll(this._skin);
                Laya.Tween.to(
                    this._skin,
                    { scaleX: 0.8, scaleY: 0.8 },
                    200,
                    Laya.Ease.quadIn,
                    Laya.Handler.create(this, this.doHide),
                );
            } else {
                this.doHide();
            }
        }
        return true;
    }

    bringTop() {
        if (!this._isShow) return;
        if (this._isScene) return;
        const uiLayer = UILayer.inst;
        if (this._isMode && this._modelBG) {
            uiLayer.bringWindowTop(this._modelBG);
        }
        uiLayer.bringWindowTop(this);
    }

    protected doShow() {
        //
    }

    protected doHide() {
        if (!this._skin) return;
        this._skin.removeFromParent();
    }

    protected doXY() {
        //
    }

    protected getorcreateModelBG() {
        if (this._modelBG == null) {
            this._modelBG = new fgui.GGraph();
            this._modelBG.drawRect(0, null, '#000000CC');
        }
        return this._modelBG;
    }

    protected onAddedToStage() {
        super.onAddedToStage();
        if (this.panelName) {
            GFacade.inst.dispatch(EventConsts.PANEL_OPEN, this.panelName);
        }
    }

    protected onRemovedFromStage() {
        if (this._isMode && this._modelBG && this._modelBG.displayObject.displayedInStage) {
            this._modelBG.removeFromParent();
        }
        this._isShow = false;
        super.onRemovedFromStage();
        if (this.panelName) {
            GFacade.inst.dispatch(EventConsts.PANEL_CLOSE, this.panelName);
        }
    }

    get isShow() {
        return this._isShow;
    }

    get isPopUp() {
        return this._isPopUp;
    }

    get isMode() {
        return this._isMode;
    }

    /** 包含界面，界面会在场景切出后自动关闭 */
    protected includeIn(...sceneTypes: number[]) {
        if (!this._includeList) {
            this._includeList = sceneTypes;
        } else {
            sceneTypes.forEach((item) => {
                if (this._includeList.indexOf(item) !== -1) return;
                this._includeList.push(item);
            });
        }
    }

    /** 排除界面，界面会在场景切入后自动关闭 */
    protected excludeOut(...sceneTypes: number[]) {
        if (!this._excludeList) {
            this._excludeList = sceneTypes;
        } else {
            sceneTypes.forEach((item) => {
                if (this._excludeList.indexOf(item) !== -1) return;
                this._excludeList.push(item);
            });
        }
    }

    protected canShow() {
        const nowSceneType = Scene.getCurrent()?.getType();
        // includeIn中不存在当前场景，则关闭
        let sceneTypes = this._includeList;
        if (sceneTypes && sceneTypes.length && sceneTypes.indexOf(nowSceneType) === -1) {
            return false;
        }

        // excludeOut中存在当前场景，则关闭
        sceneTypes = this._excludeList;
        if (sceneTypes && sceneTypes.indexOf(nowSceneType) !== -1) {
            return false;
        }
        return true;
    }

    private checkIncludeOutclude() {
        if (!this.canShow()) {
            this.hide();
        }
    }
}
