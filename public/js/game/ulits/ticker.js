let instance = null;
class Ticker {
    constructor() {
        if(instance){
            return instance;
        }
        this.store = [];
        this.handler = function () {
            this.store.forEach((item)=>{
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

    addCallback(callBack){
        this.store.push({
            callback: callBack,
            paused: true
        });
        return this.store.length-1;
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

export default Ticker;