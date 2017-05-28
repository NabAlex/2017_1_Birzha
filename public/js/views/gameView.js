import BaseView from './baseView';

import { startGame, debugGame } from '../game/init'

class GameView extends BaseView {
    constructor(node) {
        super(node);
        this.pushContainer = document.getElementById("push-container");
    }

    show() {
        super.show();
        let div = document.getElementById("site-interface");
        div.style.visibility = 'hidden';
        this.pushContainer.style.visibility = 'visible';

        if(!mainConfiguration.debugMode)
            startGame(this.node);
        else
            debugGame(this.node);
    }
    hide() {
        super.hide();

        this.pushContainer.style.visibility = 'hidden';
        let div = document.getElementById("site-interface");
        div.style.visibility = "visible";

    }

}

export default GameView;

