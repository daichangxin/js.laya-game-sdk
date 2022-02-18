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
