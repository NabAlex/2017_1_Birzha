let instance = null;
class Ticker {
    constructor() {
        if(instance){
            return instance;
        }
        this.store = [];
        this.destroySortTime = [];

        this.handler = function () {
            let nowTime = Ticker.getNow();
            while(this.destroySortTime.length > 0) {
                let lastInfo = this.destroySortTime[this.destroySortTime.length - 1];
                if(nowTime >= lastInfo.destroyTime) {
                    lastInfo.destroyFunc();
                    this.destroySortTime.pop();
                } else
                    break;
            }

            this.store.forEach((item) => {
                if(item && !item.paused)
                    item.callback();
            });
        }.bind(this);

        createjs.Ticker.addEventListener("tick", this.handler);
        createjs.Ticker.setInterval(200);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.paused = false;
        instance = this;
    }

    static getNow() {
        return (new Date()).getTime();
    }

    addCallback(callBack){
        this.store.push({
            callback: callBack,
            paused: true
        });

        return this.store.length - 1;
    }

    addRunWithTime(timeM, callback, destructFunc) {
        let id = this.addCallback(callback);

        this.destroySortTime.unshift({
            destroyTime: Ticker.getNow() + timeM,
            destroyFunc: destructFunc
        });
        tickerInstance.setPausedCallback(id, false);

        return id;
    }

    setPausedCallback(index, paused){
        this.store[index].paused = paused;
    }

    removeCallback(index){
        delete this.store[index];
    }

    removeAllCallbacks(){
        this.store = [];
    }
}

export let tickerInstance = new Ticker();