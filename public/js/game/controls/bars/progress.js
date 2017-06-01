/**
 * Created by algys on 01.06.17.
 */


class ProgressBar {
    constructor() {
        this.progressBar = document.createElement("progress");
        this.progressBar.className = "CyclicProgressBar";
        this.progressBar.id = "cyclic-time-progress";
        this.progressBar.max = 10000;

        document.body.appendChild(this.progressBar);

        this.hide();
    }

    start(time, callback){
        let timePerIter = time / this.progressBar.max;
        this.IntervalId = setInterval(()=>{
            this.progressBar.value++;
            if(this.progressBar.value === this.progressBar.max) {
                clearInterval(this.IntervalId);
                if(callback)
                    callback();
            }
        }, timePerIter);
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