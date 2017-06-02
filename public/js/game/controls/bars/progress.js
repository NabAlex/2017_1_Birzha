/**
 * Created by algys on 01.06.17.
 */


class ProgressBar {
    constructor() {
        this.progressBar = document.createElement("progress");
        this.progressBar.className = "CyclicProgressBar";
        this.progressBar.id = "cyclic-time-progress";
        this.progressBar.max = mainConfiguration.timeForStep / 5 | 0;

        document.body.appendChild(this.progressBar);

        this.hide();
    }

    start(time, callback){
        let timePerIter = time / this.progressBar.max | 0;
        this.IntervalId = setInterval(()=>{
            this.progressBar.value++;
            if(this.progressBar.value === this.progressBar.max) {
                clearInterval(this.IntervalId);
                if(callback)
                    callback();
            }
        }, timePerIter);
        // let handrler = function() {
        //
        // }.bind(this);
        this.show();
    }

    stop(){
        clearInterval(this.IntervalId);
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