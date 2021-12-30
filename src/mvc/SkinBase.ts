import { EventHandler, GFacade, Method } from '@pawgame/game-library';
import { ReadyExecute } from '../utils/ReadyExecute';

export class SkinBase {
    protected _skin: fgui.GObject;

    protected _isReady: boolean;
    protected _ready: ReadyExecute;

    protected _events: { [type: string]: EventHandler } = {};

    protected _data: unknown;

    constructor(skin?: fgui.GObject) {
        if (skin) {
            this.skin = skin;
        }
    }

    protected doReady() {
        //
    }

    get skin() {
        return this._skin;
    }

    set skin(v: fgui.GObject) {
        this._skin = v;
        if (!v) return;
        v.on('display', this, this.onAddedToStage);
        v.on('undisplay', this, this.onRemovedFromStage);
        // eslint-disable-next-line dot-notation
        this['$skin'] = this._skin['$skin'];
        this.doReady();
        this._isReady = true;
        if (this._ready) {
            this._ready.isReady = true;
        }
    }

    addReady(caller: unknown, handler: Method, args?: unknown[]) {
        if (this._isReady) {
            handler.apply(caller, args);
        } else {
            if (!this._ready) {
                this._ready = new ReadyExecute();
            }
            this._ready.add2(handler, caller, args);
        }
    }

    get isReady() {
        return this._isReady;
    }

    protected onAddedToStage() {
        GFacade.inst.addMultiListener(this, this._events);
        this.doAwaken();
    }

    protected onRemovedFromStage() {
        GFacade.inst.removeMultiListener(this, this._events);
        this.doSleep();
    }

    protected doAwaken() {
        //
    }

    protected doSleep() {
        //
    }

    get data() {
        return this._data;
    }

    set data(v: unknown) {
        this._data = v;
        this.doData();
    }

    protected doData() {
        //
    }

    protected getChild(name: string) {
        return this._skin.asCom.getChild(name);
    }

    protected getController(name: string) {
        return this._skin.asCom.getController(name);
    }

    protected getTransition(name: string) {
        return this._skin.asCom.getTransition(name);
    }
}
