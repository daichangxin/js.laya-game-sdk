import { Method, Handler } from '@pawgame/game-library';

export class Clock {
    private _leftTime: number;
    private _tickHandler: Handler;
    private _timeoutHandler: Handler;
    private _isTicking: boolean;

    constructor() {
        this._leftTime = 0;
    }

    /** leftTime: 秒 */
    setTo(leftTime: number, startNow = false) {
        this._leftTime = leftTime;
        if (leftTime > 0 && startNow) {
            this.startTick();
        } else {
            this.stopTick();
        }
    }

    onTick(caller: unknown, tick: Method, args?: unknown[]) {
        if (!this._tickHandler) {
            this._tickHandler = Handler.create(caller, tick, args, false);
        } else {
            this._tickHandler.setTo(caller, tick, args, false);
        }
        return this;
    }

    onTimeout(caller: unknown, handler: Method, args?: unknown[]) {
        if (!this._timeoutHandler) {
            this._timeoutHandler = Handler.create(caller, handler, args, false);
        } else {
            this._timeoutHandler.setTo(caller, handler, args, false);
        }
        return this;
    }

    getLeftTime() {
        return this._leftTime;
    }

    getIsTicking() {
        return this._isTicking;
    }

    private startTick() {
        if (this._leftTime > 0) {
            this._isTicking = true;
            Laya.timer.loop(1000, this, this.tick);
            this.tick();
        } else {
            this.stopTick(true);
        }
    }

    private tick() {
        if (this._leftTime < 0) {
            this.stopTick(true);
            return;
        }
        if (this._tickHandler) {
            this._tickHandler.run();
        }
        this._leftTime -= 1;
    }

    private stopTick(timeout?: boolean) {
        Laya.timer.clear(this, this.tick);
        this._isTicking = false;
        if (timeout && this._timeoutHandler) {
            this._timeoutHandler.run();
        }
    }

    awaken() {
        this.startTick();
    }

    sleep() {
        this.stopTick();
    }
}
