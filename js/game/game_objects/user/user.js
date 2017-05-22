import GraphTree from '../../graph/graph_tree';

import UserAction from './user_action';
import UserInterface from './user_interface';

import GameObject from '../game_object';

import Tower from '../models/tower'

class User extends GameObject {
    constructor(connection, world, info) {
        let point = {
            x: info.beginX,
            y: info.beginY
        };
        let clientId = info.id;
        let userNick = info.nickname;
        let units = info.units;

        super(world, clientId, userNick);

        this.color = info.color;
        this.arrayMap = world.arrayMap;
        this.userInterface = new UserInterface(world, {
            "getRealPosition": this.myRealPosition.bind(this),
            "addTower": this.addNewTower.bind(this),
            "setCurrentNode": this.setCurrentNode.bind(this),
            "getClientId": () => { return this.pid; },
            "getPerforming": () => { return this.performing },
            "getMyColor": () => { return this.color },
            "getTower": () => { return this.currentNode.data; }
        }, point);

        this.userAction = new UserAction(connection);

        console.log("My nick: " + userNick);

        /*** Events ***/
        // connection.eventListen(DATATYPE_HELLO, (json) => {
        //     console.log("My nick: " + json["nickname"]);
        // });
        /**************/

        this.myGraph = new GraphTree(world, this.color);

        let tower = this.generateMyTower(point, units);

        this.mainNode = this.myGraph.addNewVertexToCurrent(tower);
        this.setTowerNode(tower, this.mainNode);

        this.currentNode = this.mainNode;
        this.world.addTowerToMap(point, tower);

        this.drawObject();

        //update camera
        this.world.area.markSelectedCell(point.x, point.y, true);
        let pxPoint = this.world.area.getPixelPoint(point.x, point.y);
        this.world.setOffsetForCenter(pxPoint.x, pxPoint.y);
        this.world.area.world.stage.update();
        this.world.update();
        scrollTo(0,0);
    }

    setPerforming(flag) {
        this.performing = flag;
        this.myGraph.shapes.forEach((val, item)=>{
            item.setPerforming(flag);
        });
    }

    setTowerNode(tower, node) {
        tower.parentNode = node;
    }

    /* this function returns CURRENT NODE */
    playerMoveFree(fromNode, newPoint, unitsCount) {
        fromNode.data.units -= unitsCount;

        let tower = this.generateMyTower(newPoint, unitsCount);
        this.world.addTowerToMap(newPoint, tower);

        /* action */
        this.userAction.createTown(fromNode.data.point, newPoint, unitsCount);

        let newNode = this.myGraph.addNewVertexToCurrent(tower);
        this.setTowerNode(tower, newNode);
        return newNode;
    }

    playerMoveBonus(fromNode, bonusTower, unitsCount) {
        fromNode.data.units -= unitsCount;
        let newUnits = bonusTower.units + unitsCount;

        /* make from bonus to user */
        bonusTower.refreshTower(towerType.DEFAULT, newUnits, fromNode.parentNode, this.pid);
        bonusTower.setUserColor(this.color);
        /***************************/

        this.world.addTowerToMap(bonusTower.point, bonusTower);

        /* action */
        this.userAction.createTown(fromNode.data.point, bonusTower.point, unitsCount);

        let newNode = this.myGraph.addNewVertexToCurrent(bonusTower);
        this.setTowerNode(bonusTower, newNode);
        return newNode;
    }

    playerMoveLink(fromNode, toNode, unitsCount) {
        fromNode.data.units -= unitsCount;
    }

    playerMoveFight(userNode, enemyNode, unitsCount) {
        this.waitNode = userNode;
        this.waitUnits = unitsCount;
        this.userAction.createTown(userNode.data.point, enemyNode.data.point, unitsCount);
    }

    addNewTower(pointNewTower, units) {
        let placeTower = this.getFromMap(pointNewTower);
        this.setPerforming(false); // TODO if error
        if (placeTower === null) {
            this.currentNode = this.playerMoveFree(this.currentNode, pointNewTower, units);
        } else { // TODO work fight
            if (placeTower.client_id > 0) {
                this.playerMoveFight(this.currentNode, placeTower.parentNode, units);
            } else {
                this.currentNode = this.playerMoveBonus(this.currentNode, placeTower, units);
            }
        }
        this.drawObject();
    }

    setCurrentNode(pointCurrentTower) {
        let tower = this.getFromMap(pointCurrentTower);
        if(tower.client_id === this.pid) {
            if(tower.parentNode === null)
                alert("wtf!");
            this.currentNode = tower.parentNode;
            this.myGraph.setCurrentVertex(tower.parentNode);
        }
    }

    createVertextData(position, units) {
        if(typeof position !== "object")
            return null;

        position["units"] = units;
        return position
    }

    newBonus(position) {}

    myRealPosition() {
        return {x: this.currentNode.data.realX, y: this.currentNode.data.realY};
    }

    drawObject() {
        this.myGraph.showNodes();
        this.world.update();
    }

    generateMyTower(point, units) {
        let tower = new Tower(this.world, point.x, point.y, towerType.DEFAULT,
            units);
        tower.setUserColor(this.color);
        tower.client_id = this.pid;
        return tower;
    }

    getFromMap(point) {
        let r = this.world.arrayMap[point.x][point.y];
        if(!r)
            return null;
        return r;
    }

    removeNode(point){
        this.myGraph.removeNode(point);
        this.world.removeTowerFromMap(point);
        this.currentNode = this.myGraph.rootNode;
        this.drawObject();
    }

    acceptMove(json) {
        debugger;
        let result = json["result"];
        if(result === "ACCEPT_LOSE")
            return;

        let newNodes = json["newNodes"];

        let myNewNode = newNodes.find((item)=>{
            return (item.pid === this.pid);
        });

        if(myNewNode){
            if(!this.waitNode || !this.waitUnits)
                return;

            let fromNode = this.waitNode;
            let unitsCount = this.waitUnits;
            let newUnits = myNewNode.value;
            let newPoint = {
                x: myNewNode.x,
                y: myNewNode.y
            };
            fromNode.data.units -= unitsCount;

            let tower = this.generateMyTower(newPoint, newUnits);
            this.world.addTowerToMap(newPoint, tower);

            let newNode = this.myGraph.addNewVertexToCurrent(tower);
            this.setTowerNode(tower, newNode);
        }

        this.drawObject();
        this.waitUnits = null;
        this.waitNode = null;
    }
}

export default User;
