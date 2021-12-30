import { ObjectUtils } from '@pawgame/game-library';

/** 时间间隔记录 */
export class TimeRecord {
    private _time = 0;
    private _start = 0;

    get time() {
        return this._time;
    }

    set time(v: number) {
        const fixedValue = ObjectUtils.toFloat(v);
        this._time = fixedValue;
        this._start = Laya.timer.currTimer;
    }

    get elapsed() {
        return Laya.timer.currTimer - this._start;
    }

    /**
     * 设定时间减去时间间隔(ms)
     */
    get timeLeft() {
        const left = this._time - this.elapsed;
        return Math.max(0, left);
    }

    /**
     * 设定时间加上时间间隔(ms)
     */
    get now() {
        return this._time + this.elapsed;
    }
}
