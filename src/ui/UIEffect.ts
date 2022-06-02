import { TouchRelease } from '../utils/TouchRelease';

class BounceEffect {
    private _targetList: fgui.GObject[];
    private _touchingList: fgui.GObject[];

    constructor() {
        this._targetList = [];
        this._touchingList = [];
        TouchRelease.on(this, this.onRelease);
    }

    private onRelease() {
        while (this._touchingList.length) {
            const target = this._touchingList.shift();
            const rateX = target.scaleX > 0 ? 1 : -1;
            const rateY = target.scaleY > 0 ? 1 : -1;

            Laya.Tween.clearAll(target);
            Laya.Tween.to(target, { scaleX: 1 * rateX, scaleY: 1 * rateY }, 150, Laya.Ease.backOut);
        }
    }

    bounce(target: fgui.GObject, toScale = 0.9, hover = false) {
        if (this._targetList.indexOf(target) !== -1) return;
        this._targetList.push(target);
        target.setPivot(0.5, 0.5);
        target.on(Laya.Event.MOUSE_DOWN, this, () => {
            const rateX = target.scaleX > 0 ? 1 : -1;
            const rateY = target.scaleY > 0 ? 1 : -1;
            Laya.Tween.clearAll(target);
            Laya.Tween.to(target, { scaleX: toScale * rateX, scaleY: toScale * rateY }, 100, Laya.Ease.quadOut);
            this._touchingList.push(target);
        });

        if(hover){
            target.on(Laya.Event.MOUSE_OVER, this, () => {
                const colorFilter: Laya.ColorFilter = new Laya.ColorFilter();
                colorFilter.adjustBrightness(30);
                colorFilter.adjustSaturation(30);
                target.filters = [colorFilter];
            });
            target.on(Laya.Event.MOUSE_OUT, this, () => {
                target.filters = [];
            });
        }
    }
}

/** 缩小-放大-弹一下 */
let bounceEf: BounceEffect;
const bounce = (target: fgui.GObject, hover = false, toScale = 0.9) => {
    if (!bounceEf) {
        bounceEf = new BounceEffect();
    }
    bounceEf.bounce(target, toScale, hover);
};

export const UIEffect = {
    bounce,
};
