import ScoreBoard from './boards/score_board'
import MenuBoard from './boards/menu_board'
import ZoomBoard from './boards/zoom_board'
import ProgressBar from './bars/progress'

import NotifyBoard from './boards/notify_board';

class GameControls{
    constructor(){
        this.scoreBoard = new ScoreBoard();
        this.menuBoard = new MenuBoard();
        // this.zoomBoard = new ZoomBoard();
        this.progressBar = new ProgressBar();

        this.notifyBoard = new NotifyBoard();
    }

    /**
     * @param push - example { text: [MAIN_TEXT], header: [HEADER] }
     */
    pushNotify(push) {
        this.notifyBoard.pushNotify(push);
    }

    destruct(){
        this.scoreBoard.destruct();
        this.menuBoard.destruct();
        // this.zoomBoard.destruct();
        this.notifyBoard.hide();
        this.progressBar.stop();
        this.progressBar.hide();
    }
}

export default GameControls;
