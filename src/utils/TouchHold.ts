import { Method } from '@pawgame/game-library';

/**
 * 按住tick
 */
export class TouchHold {
    private _target: Laya.Sprite;
    private _enabled: boolean;

    private _touchDownCaller: unknown;
    private _touchDownHandler: Method;
    private _touchDownHandlerArgs: unknown[];
    private _delayToStartTick: number;

    private _isTicking: boolean;

    constructor(target: Laya.Sprite) {
        this._target = target;
        this.enabled = true;
    }

    setTouchDownHandler(delayToStartTick: number, caller: unknown, handler: Method, args?: unknown[]) {
        this._delayToStartTick = delayToStartTick;
        this._touchDownCaller = caller;
        this._touchDownHandler = handler;
        this._touchDownHandlerArgs = args;
    }

    set enabled(v: boolean) {
        if (this._enabled === v) return;
        this._enabled = v;
        const t = this._target;
        if (v) {
            t.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        } else {
            t.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.cancelTouch();
        }
    }

    get enalbed() {
        return this._enabled;
    }

    private onMouseDown() {
        this._isTicking = false;
        const t = this._target;
        t.on(Laya.Event.MOUSE_UP, this, this.cancelTouch);
        t.on(Laya.Event.MOUSE_OUT, this, this.cancelTouch);
        t.on(Laya.Event.RIGHT_MOUSE_UP, this, this.cancelTouch);
        Laya.timer.loop(this._delayToStartTick, this, this.tickTouchDown, null, true);
        this.tickTouchDown();
    }

    private tickTouchDown() {
        if (this._touchDownCaller && this._touchDownHandler) {
            this._touchDownHandler.apply(this._touchDownCaller, this._touchDownHandlerArgs);
        }
        this._isTicking = true;
    }

    /**
     * 首次触发按下为false，后续的tick为true
     */
    get isTicking() {
        return this._isTicking;
    }

    cancelTouch() {
        const t = this._target;
        t.off(Laya.Event.MOUSE_UP, this, this.cancelTouch);
        t.off(Laya.Event.MOUSE_OUT, this, this.cancelTouch);
        t.off(Laya.Event.RIGHT_MOUSE_UP, this, this.cancelTouch);
        Laya.timer.clear(this, this.tickTouchDown);
        this._isTicking = false;
    }
}
