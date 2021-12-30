import { Method } from '@pawgame/game-library';

/// /////////////////////////////////////// 执行间隔限制
const _limitDic: { [key: string]: number } = {};
const isLimit = (key: string, time = 500) => {
    const now = Laya.timer.currTimer;
    if (!_limitDic[key]) {
        _limitDic[key] = now;
        return false;
    }
    const lastTime = _limitDic[key];
    if (now - lastTime >= time) {
        _limitDic[key] = now;
        return false;
    }
    return true;
};

/// /////////////////////////////////////// 多次调用，仅执行一次
const _onceDic: { [key: string]: boolean } = {};
const once = (key: string, caller: unknown, func: Method, params?: unknown[]) => {
    if (_onceDic[key]) return;
    _onceDic[key] = true;
    func.apply(caller, params);
};

export const RequestLimit = {
    isLimit,
    once,
};
