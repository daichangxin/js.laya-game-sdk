import { Method, Handler } from '@pawgame/game-library';

export class AsyncHandler {
    private _success: Handler;
    private _fail: Handler;
    private _complete: Handler;

    callSuccess(...args: unknown[]) {
        if (this._success) {
            this._success.runWith(args);
        }
        this.callComplete();
    }

    callFail(...args) {
        if (this._fail) {
            this._fail.runWith(args);
        }
        this.callComplete();
    }

    callComplete(...args) {
        if (this._complete) {
            this._complete.runWith(args);
        }
    }

    onSuccess(caller: unknown, hander: Method) {
        if (!this._success) {
            this._success = Handler.create(caller, hander, null, false);
        } else {
            this._success.setTo(caller, hander, null, false);
        }
    }

    onFail(caller: unknown, handler: Method) {
        if (!this._fail) {
            this._fail = Handler.create(caller, handler, null, false);
        } else {
            this._fail.setTo(caller, handler, null, false);
        }
    }

    onComplete(caller: unknown, handler: Method) {
        if (!this._complete) {
            this._complete = Handler.create(caller, handler, null, false);
        } else {
            this._complete.setTo(caller, handler, null, false);
        }
    }
}
