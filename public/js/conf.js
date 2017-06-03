window.mainConfiguration = {
    debugMode: false,
    needAppCache: true,

    roomTypes: [2, 3, 4, 5],
    roomPrefix: "Required ? more player", /* ? ~ number of current count */
    roomPrefixEmpty: "Room is empty",
    roomDeclaration: "Fight vs ? players",
    quickStart: "Choose best room for me!",

    pingPongTime: 5000,

    pushNotifyDelay: 5000,
    pushNotifyDelta: 100,

    starSize: 1,
    countStar: 1,

    animateLightTime: 200,
    lightWidth: 5,
    timeForStep: 25000
};

window.DATATYPE_ROOMINFO = "DATATYPE_ROOMINFO";
window.DATATYPE_PLAYERMOVE = "DATATYPE_PLAYERMOVE";
window.DATATYPE_NEWBONUS = "DATATYPE_NEWBONUS";
window.DATATYPE_ERROR = "DATATYPE_ERROR";
window.DATATYPE_HELLO = "DATATYPE_HELLO";
window.DATATYPE_ROOM_DESTRUCT = "DATATYPE_ROOM_DESTRUCTION";
window.DATATYPE_PLAYER_DISCONNECT = "DATATYPE_PLAYER_DISCONNECT";
window.DATATYPE_ROOMMANAGER_UPDATE = "DATATYPE_ROOMMANAGER_UPDATE";
window.DATATYPE_YOU_WIN = "DATATYPE_YOU_WIN";

window.ACTION_GIVE_ME_ROOM = "ACTION_GIVE_ME_ROOM";
window.ACTION_GAME_MOVE = "ACTION_GAME_MOVE";
window.ACTION_PING = "ACTION_PING";
window.ACTION_EXIT_ROOM = "ACTION_EXIT_ROOM";

window.RES_OK = 0;
window.RES_ROLLBACK = 1;
window.RES_ERROR = 2;

window.STATUS_CREATING = "STATUS_CREATING";
window.STATUS_PLAYING = "STATUS_PLAYING";
window.STATUS_READY = "STATUS_READY";

window.conf = {
    ip: [
        {prefixSocket : "ws://", prefix: "http://", host: "172.16.84.20", port: ":8081", path: "/game "},
        {prefixSocket : "ws://", prefix: "http://", host: "192.168.1.102", port: ":8081", path: "/game"},
        {prefixSocket : "ws://", prefix: "http://", host: "172.16.90.25", port: ":8081", path: "/game"},
        {prefixSocket : "ws://", prefix: "http://", host: "172.20.10.4", port: ":8081", path: "/game"},
        {prefixSocket : "ws://", prefix: "http://", host: "localhost", port: ":8081", path: "/game"},
        {prefixSocket : "wss://", prefix: "https://", host: "cyclic-server.herokuapp.com", port: "", path: "/game"},
        {prefixSocket : "ws://", prefix: "http://", host: "172.16.94.65", port: ":8081", path: "/game"}
    ],
    baseIP: 3,

    // UI
    rectSize: 100,
    borderSize: 8,

    defaultStartUnit: 100,

    userSize: 5,
    radiusTower: 37,
    betweenTowersPadding: 0,
    paddingHintX: 40,
    paddingHintY: 40

};

window.defaultServer = conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api';

window.towerType = {
    DEFAULT: 0,
    BONUS: 1,
    ENEMY: 2,
    MY_MAIN: 3,
    ENEMY_MAIN: 4
};

window.userColors = {
    0: "turquoise",
    1: "green",
    2: "blue",
    3: "orange",
    4: "purple",
    5: "bonus"
};

window.pushText = {
    startGame: "Start game!"
};

window.srcImages = {
    "win": "/img/youwin.png",
    "lose": "/img/youlose.png"
};
window.userTowers = {
    "turquoise": "../img/nodes/sea.png",
    "green": "../img/nodes/green.png",
    "blue": "../img/nodes/blue.png",
    "orange": "../img/nodes/orange.png",
    "purple": "../img/nodes/purple.png",
    "bonus": "../img/nodes/brown.png"
};

window.areaConf = {
    cellStyles : {
        "default": {
            color: "#dbffd0",
            alpha: 0.1
        },
        "allowed": {
            color: "#dbffd0",
            alpha: 0.3
        },
        "denied": {
            color: "#ff254a",
            alpha: 0.8
        },
        "selected": {
            color: "#dbffd0",
            alpha: 0.2
        }
    }
};
