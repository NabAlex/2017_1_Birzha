'use strict';

class World {
    constructor(elementDOM, area) {
        this.canvas = document.createElement("canvas");

        this.canvas.id = "canvas-game";
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 1;
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.style.background = "transparent";
        this.canvas.style.left = "0px";

        this.canvas.height = area.canvas.height;
        this.canvas.width = area.canvas.width;
        this.canvas.style.top = area.canvas.style.top;
        this.canvas.style.left = area.canvas.style.left;
        this.offset = {
            x: 0,
            y: 0
        };

        elementDOM.appendChild(this.canvas);

        this.stage = new createjs.Stage(this.canvas.id);
        this.map = new createjs.Container();
        this.stage.addChild(this.map);

        createjs.Touch.enable(this.map);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.clientHeight = document.documentElement.clientHeight;
        this.clientWidth = document.documentElement.clientWidth;
        this.area = area;

        this.arrayMap = [];
        for(let i = 0; i < this.area.rectSize; i++) {
            this.arrayMap.push(new Array(this.area.rectSize));
        }
        this.zoom = this.area.zoom;
        this.elemDOM = elementDOM;

        this.toTopArray = [];
    }

    addContainerToTop(container) {
        if(!container)
            return;



        this.toTopArray.push(container);
    }

    drawTopContainers() {
        let getMaxIndex = this.stage.getNumChildren();
        for(let container of this.toTopArray) {
            this.stage.setChildIndex(container, 0);
            getMaxIndex++;
        }
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
        this.drawTopContainers();
        this.stage.update();
    }

    setCallBack(event, func) {
        this.map.on(event, func)
    }

    appendOnMap(child) {
        this.map.addChild(child); // TODO normal coor
    }

    /** Fabric draw **/
    newShape(position, radius, color, visible) {
        let circle = new createjs.Shape();
        circle.visibility = visible || true;

        let pos = position || {x: 0, y: 0};

        circle.graphics.beginFill(color).drawCircle(pos.x, pos.y, radius);
        this.map.addChild(circle);
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
        let image = new createjs.Bitmap(file);

        this.map.addChild(image);
        return image;
    }

    setOffset(x,y){
        this.offset.x = x;
        this.offset.y = y;
        this.map.setTransform(x,y);
        this.area.setOffset(x,y);
    }

    getRelativeCoord(x, y){
        return {x: x - this.offset.x, y: y - this.offset.y}
    }

    setOffsetForCenter(x,y){
        this.setOffset(-(x - (this.clientWidth / 2 | 0)), -(y - (this.clientHeight / 2 | 0)));
        this.area.setOffset(-(x - (this.clientWidth / 2 | 0)), -(y - (this.clientHeight / 2 | 0)));

        let cellPoint = this.area.getCellPosition(x,y);
        this.area.setVisibles(cellPoint.x, cellPoint.y);
    }

    setZoom(zoom){
        this.map.scaleX = this.map.scaleY = zoom;
        this.area.world.scaleX = this.area.world.scaleY = zoom;
        this.stage.update();
        this.area.stage.update();
        this.zoom = zoom;
        this.area.zoom = zoom;
    }

    addTowerToMap(point, tower) {
        this.arrayMap[point.x][point.y] = tower;
    }

    getTowerFromMap(point){
        return this.arrayMap[point.x][point.y];
    }

    removeTowerFromMap(point){
        delete this.arrayMap[point.x][point.y];
        this.arrayMap[point.x][point.y] = null;
        this.area.markSelectedCell(point.x, point.y, false);
    }

    clear(){
        while(this.toTopArray.pop());

        this.map.removeAllChildren();
        this.area.setSize();
        this.area.reconfigure();
        this.update();
        this.arrayMap = [];
    }

    reconfigure(){
        this.area.reconfigure();
        this.arrayMap = [];
        for(let i = 0; i < this.area.worldSizeH; i++) {
            this.arrayMap.push(new Array(this.area.worldSizeW));
        }
        this.update();
    }
}

export default World;