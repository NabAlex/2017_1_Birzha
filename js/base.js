'use strict';

class DrawerObject {
    constructor(map) {
        this.map = map;
    }

    drawObject() {
        console.log("Draw NoObject!");
    }

    animation(dx, dy) {
        console.log("Animate NoObject!");
    }
}

class EnemyObject extends DrawerObject {
    constructor(map, point, nameUser, color) {
        super(map);
        this.name = nameUser;

        let posCenter = map.basicCenter;
        this.positionX = point.x || posCenter.x;
        this.positionY = point.y || posCenter.y;

        this.userSize = 5; // CONST

        this.userCircle = null;
    }

    get myPosition() {
        return {x: this.positionX, y: this.positionY};
    }

    drawObject() {
        this.userCircle = this.map.newShape({x: posCenter.x, y: posCenter.y}, this.userSize, color || "DeepSkyBlue");
    }

    animation(dx, dy) {
        this.positionX += dx;
        this.positionY += dy;
    }
}

class UserObject extends EnemyObject {
    constructor(map, point, nameUser) {
        super(map, point, nameUser);

        map.setCallBack("stagemousemove", this.eventMove.bind(this));

        this.probablyLine = this.map.newLine("black");

        this.probablyCircle = this.map.newShape(null, this.userSize, "DeepSkyBlue", false);
        this.probablyCircle.on("click", this.eventPutNewVertex.bind(this));

        this.myGraph = new GraphTree(map);
        this.myGraph.addNewVertexToCurrent(this.myPosition);
    }

    eventMove(event) {
        this.visible = true;

        this.probablyCircle.x = event.stageX;
        this.probablyCircle.y = event.stageY;

        //
        this.probablyLine.graphics.clear();
        this.probablyLine.graphics.setStrokeStyle(1).beginStroke("#00ff00");
        this.probablyLine.graphics.moveTo(this.positionX, this.positionY);

        this.probablyLine.graphics.lineTo(event.stageX, event.stageY);
        this.probablyLine.graphics.endStroke();

        this.map.update(); // TODO tick
    }

    eventPutNewVertex(event) {
        let newX = parseInt(event.target.x), newY = parseInt(event.target.y);
        this.myGraph.addNewVertexToCurrent({x: newX, y: newY});

        this.positionX = newX;
        this.positionY = newY;
    }

    drawObject() {
        this.myGraph.showNodes();
    }

    set visible(flag) {
        this.probablyCircle.visibility = flag;
    }
}

class World {
    constructor(idCanvas, width,  height) {
        this.width = width;
        this.height = height;

        this.map = new createjs.Stage(idCanvas);
        createjs.Touch.enable(this.map);
    }

    get stage() {
        return this.map;
    }

    get basicCenter() {
        return {x: this.map.canvas.width / 2, y: this.map.canvas.height / 2};
    }

    get getWidth() {
        return this.width;
    }

    get getHeight() {
        return this.height;
    }

    update() {
        this.stage.update();
    }

    setCallBack(event, func) {
        this.map.on(event, func)
    }

    /** Fabric draw **/
    newShape(position, radius, color, visible) {
        let circle = new createjs.Shape();
        circle.visibility = visible || true;

        let pos = position || {x: 0, y: 0};
        circle.graphics.beginFill(color).drawCircle(pos.x, pos.y, radius);
        this.map.stage.addChild(circle);
        return circle;
    }

    newLine(color, visible) {
        let line = new createjs.Shape();
        line.graphics.setStrokeStyle(3);
        line.visibility = visible || true;

        this.map.addChild(line);
        return line;
    }

    newImage(file, visible) {
        /*var box = new createjs.Shape();
        box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100);
        box.graphics.drawCircle(0, 0, 100);
        box.cache(0, 0, 100, 100);

        let image = new createjs.Bitmap(file);
        image.filters = [
            new createjs.AlphaMapFilter(box.cacheCanvas)
        ];*/

        let image = new createjs.Bitmap(file);

        this.map.addChild(image);
        return image;
    }

}