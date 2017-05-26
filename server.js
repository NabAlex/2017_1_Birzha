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
