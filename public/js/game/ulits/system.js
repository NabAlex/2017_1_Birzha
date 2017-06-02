function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function getPushContainer() {
    return document.getElementById("push-container");
}

export { randomInteger, getPushContainer };