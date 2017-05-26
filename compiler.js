const recursive = require("recursive-readdir");
const fs = require("fs");

function getInfoFile(filename) {
    let finalFile = filename.split("/");
    let info = finalFile[finalFile.length - 1].split(".");

    return {
        name: info[0],
        type: info[info.length - 1]
    };
}

function pugFile(filename, info, renderFunc) {
    let data = fs.readFileSync(filename, 'utf8');

    compiled = renderFunc(data, info.name);
    return compiled;
}

function pugFiles(files, renderFunc, acceptTypes, outType, callbackContent) {
    files.forEach((filename) => {
        let out = getInfoFile(filename);
        if(acceptTypes.indexOf(out.type) < 0)
            return null;

        out.type = outType;
        callbackContent(
            pugFile(filename, out, renderFunc), out.name + "." + out.type
        );
    });
}

module.exports = function(includesArray, finalPath, acceptTypes, outType, renderFunc) {
    if (!fs.existsSync(finalPath)){
        fs.mkdirSync(finalPath);
    }

    if(!finalPath.endsWith("/"))
        finalPath += "/";

    includesArray.forEach((dir) => {
        recursive(dir, function(err, files) {
            pugFiles(files, renderFunc, acceptTypes, outType, (pugText, newFileName) => {
                if(pugText != null)
                    fs.writeFile(finalPath + newFileName, pugText, function(err) {
                        if(err) {
                            return console.error("error write to " + finalPath + newFileName);
                        }

                        console.log("save file " + finalPath + newFileName);
                    });
            });
        });
    });
};