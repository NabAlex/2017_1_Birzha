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

        root.innerHTML = statusboard({
            status: status,
            srcImage: srcImages[status]
        });

        this.root = root;
    }

    wrapperClick(event) {
        let count = event.target.getAttribute("num");
        this.callback(count);
    }
}