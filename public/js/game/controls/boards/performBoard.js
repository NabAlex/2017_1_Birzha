import roombase from "../../../templates/roombase";
import room from "../../../templates/room";

class PerformBoard {
    constructor(root, callback, youWin) {
        root.innerHTML = roombase({
            quickStart: mainConfiguration.quickStart
        });
        this.root = root;

        this.board = document.getElementById("cyclic-rooms-container");

        mainConfiguration.roomTypes.forEach((roomCount) => {
            let tempDiv = document.createElement('template');
            tempDiv.innerHTML = room({
                count: roomCount,
                countText: mainConfiguration.roomPrefixEmpty,
                roomText: mainConfiguration.roomDeclaration.replace("?", roomCount)
            });

            let finalDiv = tempDiv.content.firstChild;

            finalDiv.countPlayers = roomCount;
            finalDiv.onclick = this.wrapperClick.bind(this);
            finalDiv.setAttribute("num", roomCount);

            this.board.appendChild(finalDiv);
        });

        this.callback = callback;
        document.getElementById("cyclic-rooms-button-quick").onclick = () => {
            this.callback(null);
        };
    }

    wrapperClick(event) {
        let count = event.target.getAttribute("num");
        this.callback(count);
    }

    update(statusArray) {
        let childs = this.board.childNodes;
        childs.forEach((obj, index) => {
            let nowStatus = statusArray[index];

            let count = obj.getAttribute("num");
            if (count === nowStatus["capacity"])
                alert("wtf! please sync room server and client");

            let getNumField = document.getElementById("cyclic-menu-room-count-" + count);
            if (getNumField) {
                if (nowStatus["queue"] === 0) {
                    getNumField.innerHTML = mainConfiguration.roomPrefixEmpty
                }
                else {
                    getNumField.innerHTML =
                        mainConfiguration.roomPrefix.replace("?", count - nowStatus["queue"]);
                }
            }
        });
    }

    destruct() {
        /* delete */
        this.root.innerHTML = "";
    }
}

export default PerformBoard;
