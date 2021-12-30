import { Singleton } from '@pawgame/game-library';
import { IResize, Resize } from '../utils/Resize';
import { TouchOut } from '../utils/TouchOut';
import { Panel } from './Panel';
import { SkinBase } from './SkinBase';

export class UILayer implements IResize {
    static get inst() {
        return Singleton.get(UILayer);
    }

    private _root: fgui.GComponent;
    private _curSceneUI: fgui.GObject;
    private _sceneContainer: fgui.GComponent;
    private _uiContainer: fgui.GComponent;
    private _windowContainer: fgui.GComponent;
    // private _windowOrderIndex = 0;
    private _popUpList: Panel[];

    constructor() {
        this._root = fgui.GRoot.inst.addChild(new fgui.GComponent()).asCom;
        this._sceneContainer = this._root.addChild(new fgui.GComponent()).asCom;
        this._uiContainer = this._root.addChild(new fgui.GComponent()).asCom;
        this._windowContainer = this._root.addChild(new fgui.GComponent()).asCom;
        this._popUpList = [];
        Resize.add(this);
    }

    resize(width: number, height: number) {
        this._root.setSize(width, height);
        this._sceneContainer.setSize(width, height);
        this._windowContainer.setSize(width, height);
    }

    showScene(scene: fgui.GObject) {
        if (this._curSceneUI === scene && scene.displayObject && scene.displayObject.displayedInStage) return;
        if (this._curSceneUI) {
            const pre = this._curSceneUI;
            this._curSceneUI = null;

            pre.removeFromParent();
            // Console.log('test', 'hideScene:', pre);
        }

        this._curSceneUI = scene;
        if (scene) {
            this._sceneContainer.addChild(scene);
            // this._root.addChild(scene);
            // scene.sortingOrder = this._sceneOrderIndex;
            // Console.log('test', 'showScene success, index:', scene.sortingOrder);
        }
    }

    showUI(view: fgui.GObject | SkinBase) {
        const child = view instanceof fgui.GObject ? view : view.skin;
        this._uiContainer.addChild(child);
    }

    showWindow(win: Panel | fgui.GObject) {
        const child = win instanceof Panel ? win.skin : win;
        // 要先addChild，再sort，否则不生效
        // this._root.addChild(child);
        this._windowContainer.addChild(child);
        // child.sortingOrder = this._windowOrderIndex++;
        if (win instanceof Panel) {
            this._popUpList.push(win);
        }
    }

    showPopUp(popUp: Panel) {
        const child = popUp.skin;
        this._windowContainer.addChild(child);
        // 将popUp拉到最后一个
        const i = this._popUpList.indexOf(popUp);
        if (i !== -1) {
            this._popUpList.splice(i, 1);
        }

        this._popUpList.push(popUp);
        TouchOut.inst.add(child.displayObject, this.closePopUp, this);
    }

    private closePopUp() {
        while (this._popUpList.length) {
            const popUp = this._popUpList[this._popUpList.length - 1];
            if (!popUp.isShow) {
                this._popUpList.pop();
                continue;
            }
            // 遇到了不可popUp关闭的界面，则停止往下检索
            if (!popUp.isPopUp) {
                break;
            }
            // 可关闭，关闭后停止检索(只关闭一个)
            if (popUp.hide()) {
                this._popUpList.pop();
            }
            break;
        }
    }

    // TODO 尴尬，sortOrdering不生效，setChildIndex也不生效，闹哪样，以后再整
    bringWindowTop(win: fgui.GObject | Panel) {
        // 重复调用，面板可能还在加载中
        if (!win) return;
        const child = win instanceof fgui.GObject ? win : win.skin;
        if (child && child.parent) {
            // child.parent.addChild(child);
            child.parent.setChildIndex(child, child.parent.numChildren - 1);
            if (win instanceof Panel) {
                // 拉到最后一个
                const i = this._popUpList.indexOf(win);
                if (i !== -1) {
                    this._popUpList.splice(i, 1);
                }
                this._popUpList.push(win);
            }
        }
    }

    getUIRoot() {
        return this._root;
    }
}
