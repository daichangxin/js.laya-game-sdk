import { FairyUtils } from './FairyUtils';

export class FairySkinBase<T> extends fgui.GComponent {
    $skin: T;
    protected doReady() {
        //
    }

    getChild(name: string): fgui.GObject {
        return this.$skin[name] || super.getChild(name);
    }

    protected constructFromXML(xml: unknown) {
        super.constructFromXML(xml);
        this.$skin = FairyUtils.getMembersInfo(this) as T;
        // 如果是文本，批量拉到最上层
        if (this.numChildren > 1) {
            for (let i = 0, len = this.numChildren; i < len; i++) {
                const item = this.getChildAt(i);
                if (
                    item instanceof fgui.GTextField ||
                    item instanceof fgui.GTextInput ||
                    item instanceof fgui.GRichTextField ||
                    item instanceof fgui.GBasicTextField
                ) {
                    this.setChildIndex(item, this.numChildren - 1);
                }
            }
        }
        this.on('display', this, this.onAddedToStage);
        this.on('undisplay', this, this.onRemovedFromStage);
        this.doReady();
    }

    protected onAddedToStage() {
        this.doAwaken();
    }

    protected onRemovedFromStage() {
        this.doSleep();
    }

    dispose() {
        super.dispose();
        this.off('display', this, this.onAddedToStage);
        this.off('undisplay', this, this.onRemovedFromStage);
    }

    protected doAwaken() {
        //
    }

    protected doSleep() {
        //
    }
}
