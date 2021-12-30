import { Method, Singleton } from '@pawgame/game-library';

interface TouchOutItem {
    target: Laya.Sprite;
    handler: Method;
    caller: unknown;
    args?: unknown[];
}

export class TouchOut {
    static get inst() {
        return Singleton.get(TouchOut);
    }

    private _tempRect = new Laya.Rectangle();
    private _all: TouchOutItem[] = [];

    constructor() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    }

    add(target: Laya.Sprite, handler: Method, caller: unknown, args?: unknown[]) {
        // 检查是否注册过，有则更新
        const has = this._all.some((item) => {
            return item.target === target;
        });
        if (has) return;
        this._all.push({
            target,
            handler,
            caller,
            args,
        });
    }

    remove(target: Laya.Sprite, caller: unknown, handler: Method) {
        for (let i = 0, len = this._all.length; i < len; i++) {
            const item = this._all[i];
            if (item.caller === caller && item.target === target && item.handler === handler) {
                this._all.splice(i, 1);
                i -= 1;
                len -= 1;
            }
        }
    }

    private _rect = new Laya.Rectangle();
    private onMouseDown(evt: Laya.Event) {
        if (!this._all.length) return;
        this._all.forEach((item) => {
            if (!item.target.parent || !item.target.displayedInStage) return;
            this._rect = Laya.Utils.getGlobalPosAndScale(item.target);
            this._rect.width = item.target.width;
            this._rect.height = item.target.height;
            if (this._rect.contains(evt.stageX, evt.stageY)) return;
            item.handler.apply(item.caller, item.args);
        });
    }
}
