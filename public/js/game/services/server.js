'use strict';

class ServerConnect {
    /**
     * @param server as string
     * @param opened
     */
    constructor(server, opened) {
        this.statusServer = false; // TODO change

        this.socket = new WebSocket(server);

        this.opened = opened;

        this.socket.onopen = () => {
            opened(RES_OK);
        };

        this.socket.onerror = () => {
            opened(RES_ERROR);
        }
    }

    /**
     * @param json_data as Object
     * @param callback  as function
     */
    sendData(json_data) {
        let needSend = ServerConnect.toJson(json_data);
        if(needSend["action"] !== ACTION_PING)
            console.log("Send: " + needSend);

        this.socket.send(needSend);
    }

    disconnect(){
        this.socket.close();
    }

    /**
     * @param func as function(event)
     */
    set onMessage(func) {
        this.socket.onmessage = function (event) {
            func(ServerConnect.fromJson(event.data));
        }
    }

    static toJson(obj) {
        return JSON.stringify(obj);
    }

    static fromJson(text) {
        return JSON.parse(text);
    }
}

export default ServerConnect;