'use strict';

const pug = require("pug");
const sass = require("node-sass");

/******* PUG-WORK ******/
const includeDirsPug = [
    "./public/js/blocks",
    "./public/js/game/game_templates"
];

const includeDirsScss = [
    "./public/scss",
    "./node_modules/bootstrap"
];

let compiler = require('./compiler');

compiler(includeDirsPug, "./public/js/templates", ["pug"], "js", (data, name) => {
    let compiled = pug.compileClient(data, {
        compileDebug: false,
        name: name
    });

    compiled += "\nexport default " + name + ";";
    return compiled;
});

compiler(includeDirsScss, './public/css', ["scss", "css"], "css", (data, name) => {
    let compiled = sass.renderSync({
        data: data
    });

    return compiled.css;
});

// run
if (process.argv[2] === "debug") {
    const expr = require("express");
    const app = expr();

    /*********************/
    app.use(expr.static('./public'));

    app.get('/login', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get('/logout', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get('/main', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get('/about', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get('/leaderboard', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get('/game', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.get(/.*/, function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.listen(process.env.PORT || 3000, '0.0.0.0', function () {
        console.log(`Example app listening on port ${process.env.PORT || 3000} !`);
    });

    console.log("Server started!");
}

