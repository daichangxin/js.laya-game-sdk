import { Method, Handler } from '@pawgame/game-library';

export class ReadyExecute {
    private _isReady: boolean;
    private _readyExecutes: Handler[];

    constructor() {
        this._isReady = false;
    }

    add(handler: Method, caller: unknown, ...args: unknown[]) {
        this.add2(handler, caller, args);
    }

    add2(handler: Method, caller: unknown, args?: unknown[]) {
        if (handler == null || caller == null) return;
        if (this._isReady) {
            handler.apply(caller, args);
            return;
        }

        if (!this._readyExecutes) {
            this._readyExecutes = [Handler.create(caller, handler, args, true)];
        } else {
            const has = this._readyExecutes.some((item) => {
                return item.caller === caller && item.method === handler;
            });
            if (!has) {
                this._readyExecutes.push(Handler.create(caller, handler, args, true));
            }
        }
    }

    set isReady(v: boolean) {
        if (this._isReady === v) return;
        this._isReady = v;
        if (v && this._readyExecutes && this._readyExecutes.length) {
            let temp = this._readyExecutes.concat();
            this._readyExecutes.length = 0;
            this._readyExecutes = null;

            while (temp.length) {
                temp.shift().run();
            }
            temp.length = 0;
            temp = null;
        }
    }

    get isReady() {
        return this._isReady;
    }
}
