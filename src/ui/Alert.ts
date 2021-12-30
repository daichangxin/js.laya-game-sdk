import { Handler, ObjectUtils } from '@pawgame/game-library';
import { Panel } from '../mvc/Panel';
import { RequestLimit } from '../utils/RequestLimit';

export interface IAlertStyle {
    title?: string;
    okLabel?: string;
    cancelLabel?: string;
    /** ui中对应的state，用于切换显示状态 */
    state?: number;
}

export class BaseAlert extends Panel {
    protected btn_ok: fgui.GButton;
    protected btn_cancel: fgui.GButton;
    protected txt_title: fgui.GTextField;
    protected txt_content: fgui.GTextField;

    protected _okHandler: Handler;
    protected _cancelHandler: Handler;

    protected _state: fgui.Controller;

    showContent(content: string, okHandler?: Handler, cancelHandler?: Handler, style?: IAlertStyle) {
        if (this._isShow) {
            this.bringTop();
        } else {
            this.show();
        }
        if (!this._isReady) {
            this.addReady(this, this.showContent, [content, okHandler, cancelHandler, style]);
            return;
        }
        this._okHandler = okHandler;
        this._cancelHandler = cancelHandler;

        if (this.txt_title) {
            this.txt_title.text = style && style.title ? style.title : '提示';
        }
        this.txt_content.text = content;

        this.btn_ok.title = style && style.okLabel ? style.okLabel : '确定';
        this.btn_cancel.title = style && style.cancelLabel ? style.cancelLabel : '取消';

        if (this._state) {
            this._state.selectedIndex = ObjectUtils.toInt(style.state);
        }
    }

    protected doReady() {
        this._isMode = true;
        this._isCenter = true;

        this.btn_ok = this.getChild('btn_ok').asButton;
        this.btn_ok.onClick(this, this.onOKClick);

        this.btn_cancel = this.getChild('btn_cancel').asButton;
        this.btn_cancel.onClick(this, this.onCancelClick);

        this._state = this.getController('state');

        if (this.getChild('txt_title')) {
            this.txt_title = this.getChild('txt_title').asTextField;
        }
        this.txt_content = this.getChild('txt_content').asTextField;
    }

    protected onOKClick() {
        if (RequestLimit.isLimit('Alert.onOKClick', 300)) return;
        this.hide();
        if (this._okHandler) {
            this._okHandler.run();
        }
    }

    protected onCancelClick() {
        if (RequestLimit.isLimit('Alert.onCancelClick', 300)) return;
        this.hide();
        if (this._cancelHandler) {
            this._cancelHandler.run();
        }
    }
}
