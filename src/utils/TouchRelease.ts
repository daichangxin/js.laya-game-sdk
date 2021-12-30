import { Method, Handler } from '@pawgame/game-library';

/** 手指弹起 */
export class TouchRelease {
    private static _init = false;
    private static _handlers: Handler[] = [];

    static init() {
        this._init = true;
        const { stage } = Laya;
        stage.on(Laya.Event.MOUSE_OUT, this, this.onRelease);
        stage.on(Laya.Event.MOUSE_UP, this, this.onRelease);
    }

    static on(caller: unknown, handler: Method) {
        if (!this._init) {
            this.init();
        }
        this._handlers.push(Handler.create(caller, handler, null, false));
    }

    static onRelease() {
        for (let i = 0, len = this._handlers.length; i < len; i++) {
            const item = this._handlers[i];
            item.run();
            if (item.once) {
                this._handlers.splice(i, 1);
                i -= 1;
                len -= 1;
            }
        }
    }

    static off(caller: unknown, hander: Method) {
        for (let i = 0, len = this._handlers.length; i < len; i++) {
            const item = this._handlers[i];
            if (item.method === hander && item.caller === caller) {
                this._handlers.splice(i, 1);
                i -= 1;
                len -= 1;
            }
        }
    }

    static onOnce(caller: unknown, handler: Method) {
        if (!this._init) {
            this.init();
        }
        this._handlers.push(Handler.create(caller, handler, null, true));
    }
}
