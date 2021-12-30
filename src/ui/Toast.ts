import { Resize } from '../utils/Resize';
import { BaseToastItem } from './BaseToastItem';

export class Toast {
    private static cache: BaseToastItem[] = [];

    private _itemCls: { new (): BaseToastItem };
    private _fromX: number;
    private _fromY: number;
    private _toY: number;
    private _allMessage: string[];
    private _messageList: BaseToastItem[] = [];

    constructor(itemCls: { new (): BaseToastItem }) {
        this._itemCls = itemCls;
        this._allMessage = [];
        this._fromX = Resize.getWidth() * 0.5;
        this._fromY = Resize.getHeight() * 0.8;
        this._toY = this._fromY - 100;
    }

    show(message: string) {
        if (!message) return;
        this._allMessage.push(message);
        Laya.timer.loop(100, this, this.doShow);
    }

    private doShow() {
        const message = this._allMessage.shift();
        if (this._allMessage.length === 0) {
            Laya.timer.clear(this, this.doShow);
        }
        const toast = this.createToast(message);
        toast.skin.setXY(this._fromX, this._fromY);
        toast.skin.alpha = 1;
        fgui.GRoot.inst.addChild(toast.skin);
        this._messageList.push(toast);

        Laya.Tween.to(toast.skin, { y: this._toY }, 400, null, Laya.Handler.create(this, this.onMoveEnd, [toast]));
    }

    private onMoveEnd(tt: BaseToastItem) {
        // eslint-disable-next-line no-param-reassign
        tt.$isEnd = true;
        let temp: number = this._toY;
        let toast: BaseToastItem;
        for (let i: number = this._messageList.length - 1; i >= 0; i--) {
            toast = this._messageList[i];
            if (!toast.$isEnd) continue;
            toast.skin.y = temp;
            temp -= toast.skin.height;
        }

        Laya.Tween.to(tt.skin, { alpha: 0 }, 2200, Laya.Ease.quintIn, Laya.Handler.create(this, this.recycle, [tt]));
    }

    private createToast(message: string) {
        let toast: BaseToastItem;
        if (!Toast.cache.length) {
            toast = new this._itemCls();
            toast.skin.touchable = false;
        } else {
            toast = Toast.cache.pop();
        }
        toast.setMessage(message);
        toast.$isEnd = false;
        return toast;
    }

    private recycle(toast: BaseToastItem) {
        if (!toast) return;
        const i = this._messageList.indexOf(toast);
        this._messageList.splice(i, 1);

        Laya.Tween.clearAll(toast.skin);
        toast.skin.removeFromParent();
        Toast.cache.push(toast);
    }
}
