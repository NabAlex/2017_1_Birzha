import statusboard from '../../../templates/statusboard'

class FinishBoard {
    /**
     *
     * @param root
     * @param status ~ "win" or "lose"
     */
    constructor(root, status) {
        if(!(status in srcImages))
            alert("wtf!");

        this.status = status;
        this.root = root;
    }

    show(callbackHide, callbackBackToMenu) {
        this.root.innerHTML = statusboard({
            status: this.status,
            srcImage: srcImages[this.status]
        });

        document.getElementById("status-board-hide").onclick = () => {
            this.hide();
            callbackHide();
        };

        document.getElementById("status-board-tomenu").onclick = () => {
            this.hide();
            callbackBackToMenu();
        };
    }

    hide() {
        this.root.innerHTML = "";
    }


}

export default FinishBoard;