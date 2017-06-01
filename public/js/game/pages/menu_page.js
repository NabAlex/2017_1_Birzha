import BasePage from './base_page';

import PerformBoard from '../controls/boards/performBoard'
import Ticker from '../ulits/ticker';

class MenuPage extends BasePage {
    constructor(world, callBackIfRun) {
        super(world);
        this.callbackIfRun = callBackIfRun;

        this.children = [];

        this.buttonMenu = null;
        this.roomBoard = null; /* choose room */
        this.listeners = [];
        this.ticker = new Ticker();
    }

    startPage(resource) {
        resource = resource || this.resource;
        this.resource = resource;
        this.stoped = false;
        let cellCenter = this.world.area.getExactPosition(this.world.area.fullSize.x / 2, this.world.area.fullSize.y / 2);
        let cenX = cellCenter.x, cenY = cellCenter.y;
        this.world.setOffsetForCenter(cenX, cenY);
        scrollTo(0, 0);
        document.body.style.overflow = "hidden";

        this.buttonMenu = this.world.newImage(resource.getResult("playButton"));
        this.buttonMenu.x = cenX;
        this.buttonMenu.y = cenY;
        this.buttonMenu.regX = this.buttonMenu.image.width / 2;
        this.buttonMenu.regY = this.buttonMenu.image.height / 2;

        this.world.update();
        this.world.area.update();

        this.buttonAnimate = function (event) {
            this.buttonMenu.rotation += 2;
            this.world.update();
        }.bind(this);

        this.handlerId = this.ticker.addCallback(this.buttonAnimate);

        const onClickRun = (event) => {
            this.callbackIfRun();
        };

        this.buttonMenu.on('click', onClickRun.bind(this));
    }

    startRoomChoose(connection) {
        connection = connection || this.connection;
        this.connection = connection;
        this.roomBoard = new PerformBoard(document.getElementById("push-container"),
            this.chooseRoomByClient.bind(this));

        this.listeners.push({
            method: DATATYPE_ROOMMANAGER_UPDATE,
            id: connection.addEventListen(DATATYPE_ROOMMANAGER_UPDATE, (json) => {
                /* update room status */
                if(this.stoped){
                    this.startPage();
                    this.startRoomChoose();
                }
                this.roomBoard.update(json["freerooms"]);
            })
        });
    }

    chooseRoomByClient(chooseCount) {
        this.roomBoard.destruct();
        this.callbackIfRun(chooseCount);
    }

    stopPage() {
        if(this.roomBoard !== null)
            this.roomBoard.destruct();

        this.world.map.removeChild(this.buttonMenu);
        //    this.removeAllListeners();
        this.stoped = true;
        this.world.update();
    }

    setEnableRotation(flag) {
        this.ticker.setPausedCallback(this.handlerId, !flag);
        this.world.update();
    }

    removeAllListeners(){
        if(this.connection)
            this.listeners.forEach((item)=>{
                this.connection.deleteListenIndex(item);
            });
        this.listeners = [];
    }
}

export default MenuPage;