class Room {
    constructor(connection, waitPage, id, nickName, runGame) {
        this.meId = id;
        this.meNickName = nickName;

        this.players = new Array(conf.countUsersInRoom);

        this.roomId = -1;
        this.pid = -1;

        this.runGame = runGame;
        this.waitPage = waitPage;

        this.connection = connection;

        this.connection.addEventListen(DATATYPE_ROOMINFO, (json) => {
            let roomId = json["roomID"];
            let status = json["status"];
            let players = json["players"];
            let pID = json["pid"];
            debugger;
            this.players = players;

            if(status === STATUS_PLAYING) {
                this.pid = pID;

                this.runGame(this, json["fieldHeight"], json["fieldWidth"]);

                this.waitPage.setEnableRotation(false);
            }

            console.log("Get [room.js]: " + roomId);
        });
    }

    deleteListenRoomInfo() {
        this.connection.deleteListen(DATATYPE_ROOMINFO);
    }

    iAmReady(countChoose) {
        // TODO update api
        this.connection.send(ACTION_GIVE_ME_ROOM,
            (countChoose) ? { "roomCapacity": countChoose } : {}
        );

        this.waitPage.setEnableRotation(true);
    }

    addUser(id, nickName) {
        this.usersNames.push({
            id: id,
            nickName: nickName
        });
    }

}

export default Room;