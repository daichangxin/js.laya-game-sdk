import { Singleton } from '@pawgame/game-library';
/** 声音管理 */
export class SoundManager {
    static get inst() {
        return Singleton.get(SoundManager);
    }

    private _isSysMute = false;
    private _isSoundMute = false;
    private _isMusicMute = false;
    private _musicChannel: Laya.SoundChannel;
    private _musicURL: string;

    private invalidate() {
        const isMusicMute = this._isSysMute || this._isMusicMute;
        const isSoundMute = this._isSysMute || this._isSoundMute;
        Laya.SoundManager.musicMuted = isMusicMute;
        Laya.SoundManager.soundMuted = isSoundMute;
        if (!isMusicMute) {
            if (this._musicChannel) {
                try {
                    this._musicChannel.resume();
                } catch (err) {
                    if (this._musicURL) {
                        this.playMusic(this._musicURL);
                    }
                }
            } else if (this._musicURL) {
                this.playMusic(this._musicURL);
            }
        }
    }

    get isMusicMute() {
        return this._isMusicMute;
    }

    set isMusicMute(v: boolean) {
        if (this._isMusicMute === v) return;
        this._isMusicMute = v;
        this.invalidate();
    }

    get isSoundMute() {
        return this._isSoundMute;
    }

    set isSoundMute(v: boolean) {
        if (this._isSoundMute === v) return;
        this._isSoundMute = v;
        this.invalidate();
    }

    get isMute() {
        return this._isMusicMute && this._isSoundMute;
    }

    set isMute(v: boolean) {
        if (this._isMusicMute === v && this._isSoundMute === v) return;
        this._isMusicMute = v;
        this._isSoundMute = v;
        this.invalidate();
    }

    set sysMute(v: boolean) {
        if (this._isSysMute === v) return;
        this._isSysMute = v;
        this.invalidate();
    }

    playSound(url: string) {
        if (this._isSysMute || this._isSoundMute || !url) return;
        Laya.SoundManager.playSound(url);
    }

    playMusic(url: string) {
        if (this._musicChannel && this._musicChannel.url === url) {
            try {
                this._musicChannel.resume();
                return;
            } catch (err) {
                //
            }
        }
        this.disposeMusic();
        this._musicURL = url;
        if (this._isSysMute || this._isMusicMute || !url) {
            return;
        }
        if (url) {
            this._musicChannel = Laya.SoundManager.playMusic(url);
        }
    }

    stopMusic() {
        if (!this._musicChannel) return;
        this._musicChannel.stop();
    }

    private disposeMusic() {
        if (!this._musicChannel) return;
        if (!this._musicChannel.isStopped) {
            this._musicChannel.stop();
        }
        this._musicChannel = null;
        this._musicURL = null;
    }
}
