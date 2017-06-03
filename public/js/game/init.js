'use strict';

import Area from './game_area/area';
import World from './game_area/world';

import Loader from './ulits/loader';

import MenuPage from './pages/menu_page';
import PlayPage from './pages/play_page';

import Connection from './services/connection';
import Room from './services/room';
import User from './game_objects/user/user' /* add for debug */
import { getPushContainer } from './ulits/system';

function loadResourse(callback) {
    let needFilesForProjectManifest = [
        {id: "playButton", src: "./img/play.png"},
        {id: "greenTower", src: userTowers["green"]},
        {id: "turquoiseTower", src: userTowers["turquoise"]},
        {id: "blueTower", src: userTowers["blue"]},
        {id: "orangeTower", src: userTowers["orange"]},
        {id: "purpleTower", src: userTowers["purple"]},
        {id: "bonusTower", src: userTowers["bonus"]}
    ];

    new Loader(needFilesForProjectManifest, callback);
}

function startGame(elementDOM) {
    let connectionService = null;
    let room = null;

    const iAmReady = function (countChoose) {
        if(room === null) {
            alert("room ~ null");
            return;
        }

        room.iAmReady(countChoose);
    };

    let area = new Area(elementDOM);
    let world = new World(elementDOM, area);

    // No connection
    let menuPage = new MenuPage(world, iAmReady);

    let startConnect = (result) => {
        window.resources = result;
        connectionService = new Connection((status) => {
            if(status === RES_ERROR) {
                alert("error connect server!"); // error
                return;
            }
            connectionService.createPingPong();
            let playPage = new PlayPage(world, connectionService, null); // TODO loading

            let ifstop = () => {
                /* stop */
                menuPage.startPage();
            };

            connectionService.addEventListen(DATATYPE_HELLO, (json) => {
                let nickname = json["nickname"];

                if(nickname === null) {
                    alert("error");
                    return;
                }

                console.log("start after hello");
                menuPage.startPage(result);
                menuPage.startRoomChoose(connectionService);

                room = new Room(connectionService, menuPage, (room, height, width) => {
                    area.setSize(height, width);
                    world.reconfigure();
                    menuPage.stopPage(); // destruct room choose
                    playPage.startPage(room, nickname);
                });

            });
        });
    };

    getPushContainer().innerHTML = `<div class="cyclic-loader" style="margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;"></div>`;
    loadResourse((result) => {
        getPushContainer().innerHTML = '';

        console.log(result);
        startConnect(result);
    });
}

function debugGame(elementDOM) {

    let connectionService = null;
    let room = null;

    let area = new Area(elementDOM);
    let world = new World(elementDOM, area);

    const iAmReady = () => {
        menuPage.stopPage();
        let user = new User(null, world, {
            beginX: 10, beginY: 10, id: 1,
            nickname: "noname", units: 100,
            color: "green"
        });

        user.setPerforming(true);

        // new PlayPage(world, null).startPage(null);
    };

    let menuPage = new MenuPage(world, iAmReady);
    loadResourse((result) => {
        console.log(result);
        menuPage.startPage(result);
    });
}

export { startGame, debugGame };