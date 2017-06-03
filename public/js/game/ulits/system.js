function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function getPushContainer() {
    return document.getElementById("push-container");
}

function runFastSpinner() {
    getPushContainer().innerHTML = `<div class="cyclic-loader temp-spinner"></div>`
}

function clearFastSpinner() {
    getPushContainer().innerHTML = ``;
}

function getPaddings(from, to, radius) {
    let x = to.x, y = to.y;
    let l = Math.sqrt((x - from.x)**2 + (y - from.y)**2);

    const byLine = (lamda) => {
        return {x: (from.x + lamda * x) / (1 + lamda), y: (from.y + lamda * y) / (1 + lamda)};
    };

    radius = radius || conf.radiusTower + conf.betweenTowersPadding;
    let lamda = (l - radius) / radius;

    return {
        from:byLine(1 / lamda),
        to:byLine(lamda),
        md: {x:x, y:y}
    };
}

export { randomInteger, getPushContainer, runFastSpinner, clearFastSpinner, getPaddings };