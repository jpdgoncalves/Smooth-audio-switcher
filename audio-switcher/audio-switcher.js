export default class AudioSwitcher {

    constructor() {

        //PUBLIC
        this.pauseDelay = 3;
        this.playDelay = 3;
        this.changeFactor = 0.01;
        /**
         * @type {HTMLAudioElement}
         */
        this.toPause = undefined;
        /**
         * @type {HTMLAudioElement}
         */
        this.toPlay = undefined;
        this.ondone = () => {
            console.log("Switching is now complete");
        }

        //PRIVATE
        this._oldVolume = 0;
    }

    /**
     * 
     * @param {HTMLAudioElement} toPause 
     * @param {HTMLAudioElement} toPlay 
     */
    switch(toPause, toPlay) {
        if(this.isSwitching() || toPause.paused || !toPlay.paused) {
            return;
        }

        const smoothLowering = () => {
            const toPause = this.toPause;
            if(toPause.volume !== 0) {
                this._lowerVolume();
                setTimeout(smoothLowering, this.pauseDelay * 1000 * this.changeFactor);
            } else {
                const toPlay = this.toPlay;
                toPlay.volume = 0;
                toPause.pause();
                toPlay.play();
                setTimeout(smoothIncrease, this.playDelay * 1000 * this.changeFactor);
            }
        };
        const smoothIncrease = () => {
            const toPlay = this.toPlay;
            if(toPlay.volume !== this._oldVolume) {
                this._increaseVolume();
                setTimeout(smoothIncrease, this.playDelay * 1000 * this.changeFactor);
            } else {
                this.toPause = undefined;
                this.toPlay = undefined;
                this.ondone();
            }
        };

        this.toPause = toPause;
        this.toPlay = toPlay;
        this._oldVolume = this.toPause.volume;
        setTimeout(smoothLowering, this.pauseDelay * 1000 * this.changeFactor);
    }

    isSwitching() {
        return this.toPause && this.toPlay;
    }

    _lowerVolume() {
        const toPause = this.toPause
        const newVolume = toPause.volume - (this._oldVolume * this.changeFactor);
        toPause.volume = newVolume > 0 ? newVolume : 0;
    }

    _increaseVolume() {
        const toPlay = this.toPlay
        const newVolume = toPlay.volume + (this._oldVolume * this.changeFactor);
        toPlay.volume = newVolume > this._oldVolume ? this._oldVolume : newVolume;
    }

}