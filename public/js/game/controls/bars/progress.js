/**
 * Created by algys on 01.06.17.
 */
import { tickerInstance }from '../../ulits/ticker';

class ProgressBar {
    constructor() {
        this.progressBar = document.createElement("progress");
        this.progressBar.className = "CyclicProgressBar";
        this.progressBar.id = "cyclic-time-progress";
        this.progressBar.max = 500;

        document.body.appendChild(this.progressBar);

        this.timePerIter = mainConfiguration.timeForStep / this.progressBar.max ;
        this.start_time = null;
        this.last_time = null;
        this.state = "stop";
        this.handler = function() {
            let now = (new Date()).getTime();
            if(now >= this.last_time + this.timePerIter){
                this.last_time = now;
                this.progressBar.value++;
            }
            if(now - this.start_time >= mainConfiguration.timeForStep)
                tickerInstance.setPausedCallback(this.handlerId, true);
        }.bind(this);
        this.handlerId = tickerInstance.addCallback(this.handler);
        this.hide();
    }

    start(){
        this.last_time = (new Date()).getTime();
        this.start_time = this.lastTime;
        tickerInstance.setPausedCallback(this.handlerId, false);
        this.show();
    }

    stop(){
        tickerInstance.setPausedCallback(this.handlerId, true);
    }

    reset(){
        this.progressBar.value = 0;
    }

    hide() {
        this.progressBar.hidden = true;
    }

    show() {
        this.progressBar.hidden = false;
    }
}

export default ProgressBar;