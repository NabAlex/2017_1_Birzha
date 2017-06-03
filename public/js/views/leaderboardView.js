import BaseView from './baseView';

import highscore from '../templates/highscore'
import Request from '../request'

class LeaderBoardView extends BaseView {
    updateLeaderBoard(response) {
        if (response.status != 200) {
            alert("wtf!");
            return;
        }

        response.json().then((json) => {
            console.log(json);
            this.node.innerHTML = highscore({ users: json["scoreBoard"] });
        });
    }

    show() {
        new Request(defaultServer)
            .addResponse(this.updateLeaderBoard.bind(this))
            .request('/scoreboard?page=1');

        this.node.innerHTML = highscore({ load: true });

        this.node.hidden = false;
        this.node.style.display = "contents";
    }

    hide() {
        this.node.hidden = true;
        //this.node.style.display = "none";
    }
}

export default LeaderBoardView;