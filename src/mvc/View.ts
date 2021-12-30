import { Singleton } from '@pawgame/game-library';
import { Panel } from './Panel';
import { IScene, Scene } from './Scene';

type PanelToggleState = 0 | 1 | -1;

const togglePanel = <T extends Panel>(panelCls: { new (): T }, toggleState?: PanelToggleState, data?: unknown): T => {
    if (!panelCls) return null;
    const state = toggleState === undefined ? -1 : toggleState;
    if (state === 0 && !Singleton.has(panelCls)) return null;
    const panel = Singleton.get(panelCls);
    switch (state) {
        case 0:
            if (panel.isShow) {
                panel.hide();
            }
            break;
        case 1:
            if (panel.isShow) {
                panel.bringTop();
            } else {
                panel.show();
            }
            break;
        case -1:
            if (panel.isShow) {
                panel.hide();
            } else {
                panel.show();
            }
            break;
        default:
            break;
    }
    if (data !== undefined) {
        panel.toggleData(data);
    }
    return panel;
};

/** 打开/关闭界面，需外部注册Panel的名称: `registerInst('PanelName', PanelClass);` */
const togglePanelByName = <T extends Panel>(panelName: string, state?: PanelToggleState, data?: unknown): T => {
    if (!panelName) {
        console.warn('sys', `toggleName.error, panelName:${panelName} not found`);
        return null;
    }
    const inst = Singleton.getRegistedInst(panelName) as { new (): T };
    if (!inst) return null;
    return togglePanel(inst, state, data);
};

const changeScene = (sceneCls: { new (): IScene }, data?: unknown) => {
    Scene.change(sceneCls, data);
};

export const View = {
    togglePanel,
    togglePanelByName,
    changeScene,
};
