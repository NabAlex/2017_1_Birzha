'use strict';

import User from '../game_objects/user/user';
import Tower from '../game_objects/models/tower';

import Controls from '../controls/gameControls';
import FinishBoard from '../controls/boards/finish_board';

import BasePage from './base_page';
import Enemy from '../game_objects/enemy/enemy';

import { tickerInstance } from '../ulits/ticker';
import { getPushContainer } from '../ulits/system';

class PlayPage extends BasePage {
    constructor(world, connection) {
        super(world);

        this.enemiesData = [];
        this.enemiesObject = {};

        this.user = null;

        this.connection = connection;

        this.nowPerforming = null;
        this.listeners = [];
    }

    splitUsers(array, nickname) {
        let me = null;
        for(let user in array) {
            array[user].color = window.userColors[(user % 4)];
            this.controls.scoreBoard
                .addPlayerToScoreBoard(array[user].nickname, array[user].units, array[user].color);
            if(array[user].nickname === nickname) {
                me = array[user];
                console.log(array[user]);
            } else {
                this.enemiesData.push(array[user]);
            }
        }
        return me;
    }


    startPage(room, myNickname) {
        this.room = room;
        this.enemiesObject = [];
        this.user = null;
        this.controls = this.controls || new Controls();
        this.controls.pushNotify({text: pushText.startGame});
        this.controls.menuBoard.addExitListener(()=>{
            this.connection.send(ACTION_EXIT_ROOM);
            this.stopPage();
        });
        let lastScores = null;

        let perfomingPlayer = room.pid;
        let meData = this.splitUsers(room.players, myNickname);
        this.user = new User(this.connection, this.world, meData);
        let myId = this.user.pid;
        if(perfomingPlayer === myId) {
            this.nowPerforming = this.user;
            this.user.setPerforming(true);
        }

        for(let index in this.enemiesData) {
            let enemyData = this.enemiesData[index];
            this.enemiesObject[enemyData.id] = new Enemy(this.connection, this.world, enemyData);
            if(enemyData.id === perfomingPlayer) {
                this.nowPerforming = this.enemiesObject[enemyData.id];
                this.enemiesObject[enemyData.id].setPerforming(true);
            }
        }

        this.controls.progressBar.start();

        this.listeners.push({
            method: DATATYPE_NEWBONUS,
            id: this.connection.addEventListen(DATATYPE_NEWBONUS, (json) => {
                    let bonuses = json["bonuses"];
                    bonuses.forEach((item) => {
                        let x = item.x;
                        let y = item.y;
                        let value = item.value;
                        if (this.world.getTowerFromMap({x: x, y: y})) {
                            return;
                        }
                        let bonus = new Tower(this.world, x, y, towerType.BONUS, value, null);
                        this.world.addTowerToMap({x: x, y: y}, bonus);
                        bonus.draw();
                    });
                })
        });

        this.listeners.push({
            method: DATATYPE_PLAYER_DISCONNECT,
            id: this.connection.addEventListen(DATATYPE_PLAYER_DISCONNECT, (json) => {
                let pid = json["pid"];
                let nextpid = json["giveMoveToPid"];
                this.enemiesObject[pid].removeAll();
                delete this.enemiesObject[pid];
                this.nowPerforming.setPerforming(false);
                if (nextpid === this.user.pid)
                    this.nowPerforming = this.user;
                else
                    this.nowPerforming = this.enemiesObject[nextpid];
                this.nowPerforming.setPerforming(true);
                this.controls.pushNotify({text: "Now playing " + this.nowPerforming.nickName + " !"});
            })
        });

        this.listeners.push({
            method: DATATYPE_YOU_WIN,
            id: this.connection.addEventListen(DATATYPE_YOU_WIN, () => {
                this.showWin(this.user.nickName);
            })
        });

        /* code for algys */
        this.listeners.push({
            method: DATATYPE_PLAYERMOVE,
            id: this.connection.addEventListen(DATATYPE_PLAYERMOVE, (json) => {
                let nextpid = json["nextpid"];
                let pid = json["pid"];
                let result = json["result"];

                this.nowPerforming.setPerforming(false);
                if (nextpid === this.user.pid)
                    this.nowPerforming = this.user;
                else
                    this.nowPerforming = this.enemiesObject[nextpid];

                console.log("Draw !");

                let valueUpdates = json["valueUpdate"];
                let newNodes = json["newNodes"];
                let newLinks = json["newLinks"];
                let removedNodes = json["removedNodes"];
                let removedLinks = json["removedLinks"];
                let scores = json["scores"];
                let deadPid = json["deadpid"];

                //   debugger;

                if (deadPid != null) {
                    if (deadPid !== this.user.pid) {
                        this.enemiesObject[deadPid].removeAll();
                        delete this.enemiesObject[deadPid];

                    } else {
                        /* show */
                        this.user.removeAll();
                        this.showLose(this.user.nickName);
                     //   this.stopPage();
                        return;
                    }
                }

                if (removedLinks) {
                    removedLinks.forEach((removedLink) => {
                        let from = removedLink["l"];
                        let to = removedLink["r"];
                        let fromTower = this.world.getTowerFromMap(from);
                        let toTower = this.world.getTowerFromMap(to);
                        let pid = fromTower.client_id;
                        if (pid !== this.user.pid)
                            this.enemiesObject[pid].removeLink(fromTower.point, toTower.point);
                        else
                            this.user.removeLink(fromTower.point, toTower.point);
                    });
                }

                if (removedNodes) {
                    removedNodes.forEach((removedNode) => {
                        let pid = this.world.getTowerFromMap(removedNode).client_id;
                        if (pid === this.user.pid)
                            this.user.removeNode(removedNode);
                        else
                            this.enemiesObject[pid].removeNode(removedNode);
                    });
                }

                if (newNodes) {
                    newNodes.forEach((newNode) => {
                        let pid = newNode["pid"];
                        if (pid !== this.user.pid) {
                            this.enemiesObject[pid].addNewTower(newNode);
                        }
                    });
                }

                /* update enemies */
                if (valueUpdates) {
                    valueUpdates.forEach((update) => {
                        let point = {
                            x: update["x"],
                            y: update["y"]
                        };
                        let newUnits = update["value"];
                        let tower = this.world.getTowerFromMap(point);
                        let pid = tower.client_id;
                        if (pid !== this.user.pid)
                            this.world.getTowerFromMap(point).changeUnits(newUnits);
                    });
                }

                if (result === "ACCEPT_WIN" || result === "ACCEPT_LOSE")
                    /* update user */
                    this.user.acceptMove(json);

                if (newLinks) {
                    newLinks.forEach((newLink) => {
                        let from = newLink["l"];
                        let to = newLink["r"];
                        let fromTower = this.world.getTowerFromMap(from);
                        let toTower = this.world.getTowerFromMap(to);
                        let pid = fromTower.client_id;
                        if (pid !== this.user.pid)
                            this.enemiesObject[pid].createLink(fromTower, toTower);
                        else
                            this.user.createLink(fromTower, toTower);
                    });
                }

                if (scores) {
                    if (JSON.stringify(lastScores) !== JSON.stringify(scores)) {
                        this.controls.scoreBoard.clear();
                        scores.forEach((score) => {
                            let tempUser;
                            if (score.pid === this.user.pid)
                                tempUser = this.user;
                            else
                                tempUser = this.enemiesObject[score.pid];
                            this.controls.scoreBoard.addPlayerToScoreBoard(tempUser.nickName,
                                score.score,
                                tempUser.color);
                        });
                    }
                }

                this.controls.progressBar.reset();
                this.controls.progressBar.start();
                this.nowPerforming.setPerforming(true);
                this.controls.pushNotify({text: "Now playing " + this.nowPerforming.nickName + " !"});
                this.world.update();

                // for(let i = 0; i<12; i++){
                //     let str = "";
                //     for(let j = 0; j<12; j++){
                //         if(this.world.arrayMap[j] != null) {
                //             if (this.world.arrayMap[j][i] != null) {
                //                 str += this.world.arrayMap[j][i].units + " ";
                //             } else
                //                 str += "0 ";
                //         } else
                //             str += "0 ";
                //     }
                //     console.log(str);
                // }
            })
        });

        this.listeners.push({
            method: DATATYPE_ROOM_DESTRUCT,
            id: this.connection.addEventListen(DATATYPE_ROOM_DESTRUCT, (json) => {
                alert("Room is destructed !");
                this.stopPage();
            })
        });

        /* was kicked */
        this.listeners.push({
            method: DATATYPE_ERROR,
            id: this.connection.addEventListen(DATATYPE_ERROR, (json) => {
                alert("You was kicked!");
                this.stopPage();
            })
        });

        /* event status server and pid*/
        this.listeners.push({
            method: DATATYPE_ROOMINFO,
            id: this.connection.addEventListen(DATATYPE_ROOMINFO, (json) => {
                let status = json["status"];
                this.world.area.setSize(json["fieldHeight"], json["fieldWidth"]);
                if (status === STATUS_PLAYING && "pid" in json) {
                    let pid = json["pid"];

                    if (pid === this.user.pid) {
                        this.nowPerforming = this.user;
                    } else if (pid in this.enemiesObject) {
                        this.nowPerforming = this.enemiesObject[pid];
                    }
                    this.nowPerforming.setPerforming(true);
                    this.world.update();
                } else {
                    alert("wtf!!!!");
                }
            })
        });

        window.onbeforeunload = ()=>{
            this.connection.send(ACTION_EXIT_ROOM);
            this.connection.disconnect();
        };
    }

    showStatus(boardStatus) {
        boardStatus.show(() => {
            /* hide */
            console.log("need request pointer");
            this.world.canvas.requestPointerLock();
            boardStatus.hide();
        }, () => {
            /* to menu */
            this.stopPage();
            this.connection.send(ACTION_EXIT_ROOM);
        });
    }

    showWin(nickname) {
        document.exitPointerLock();
        this.showStatus( new FinishBoard(getPushContainer(), "win") );
    }

    showLose(nickname) {
        document.exitPointerLock();
        this.showStatus( new FinishBoard(getPushContainer(), "lose") );
    }

    removeAllListeners(){
        if(this.connection)
            this.listeners.forEach((item)=>{
                this.connection.deleteListenIndex(item.method, item.id);
            });
        this.listeners = [];
    }

    stopPage() {
        this.world.map.removeAllChildren();
        this.world.update();
        this.world.clear();
        this.controls.destruct();
        this.removeAllListeners();
        this.user.destruct();
        delete this.user;
        delete this.enemiesObject;
        this.user = null;
        this.enemiesObject = [];
        this.enemiesData = [];
        this.controls = null;
        tickerInstance.removeAllCallbacks();
        document.exitPointerLock();
    }
}

export default PlayPage;