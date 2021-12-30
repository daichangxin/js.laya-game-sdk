import { GFacade, Singleton } from '@pawgame/game-library';
import { EventConsts } from '../consts/EventConsts';

export interface IScene {
    awaken(): void;
    sleep(): void;

    data: unknown;
    getType(): number;
}

let _scene: IScene;

const getCurrent = () => {
    return _scene;
};

const change = (sceneCls: { new (): IScene }, data?: unknown) => {
    const newScene = Singleton.get(sceneCls);
    if (_scene === newScene) return;
    const pre = _scene;
    _scene = newScene;
    if (pre) {
        pre.sleep();
    }

    if (_scene) {
        if (data !== undefined) {
            _scene.data = data;
        }
        _scene.awaken();
    }
    GFacade.inst.dispatch(EventConsts.SCENE_CHANGE);
};

export const Scene = {
    change,
    getCurrent,
};
