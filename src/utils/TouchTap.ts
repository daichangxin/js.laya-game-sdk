import { Method } from '@pawgame/game-library';

/** 传参有bug，问题待修 */
export const strictTap = (target: Laya.Sprite, caller: unknown, onTap: Method, onTagArgs?: unknown[]) => {
    target.offAll(Laya.Event.MOUSE_DOWN);
    target.offAll(Laya.Event.MOUSE_UP);
    target.on(Laya.Event.MOUSE_DOWN, null, (e: Laya.Event) => {
        const { stageX, stageY } = e;
        const onMouseUp = (evt: Laya.Event) => {
            if (Math.abs(evt.stageX - stageX) < 10 && Math.abs(evt.stageY - stageY) < 10) {
                onTap.apply(caller, onTagArgs);
            }
            target.offAll(Laya.Event.MOUSE_UP);
        };
        target.on(Laya.Event.MOUSE_UP, null, onMouseUp);
    });
};
