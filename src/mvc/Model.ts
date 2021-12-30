import { CMDRes, CMDResManager, Notifier } from '@pawgame/game-library';

export class ModelData extends Notifier {
    protected reg(cmd: number | string, handler: (res: CMDRes) => unknown) {
        CMDResManager.inst.reg(cmd, this, handler);
    }
}
