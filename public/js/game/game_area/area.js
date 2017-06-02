'use strict';

class Area {
    constructor(elementDOM) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas-area";
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 0;
        this.canvas.style.left = 0;
        this.offset = {
            x: 0,
            y: 0
        };
        this.rectSize = conf.rectSize;
        this.borderSize = conf.borderSize;
        this.worldSizeH = 20;
        this.worldSizeW = 20;

        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.width = document.documentElement.clientWidth;

        elementDOM.appendChild(this.canvas);

        this.stage = new createjs.Stage(this.canvas.id);
        this.world = new createjs.Container();
        this.stage.addChild(this.world);
        createjs.Touch.enable(this.world);
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.initArea();
        this.stage.update();
        this.zoom = 1;
    }

    addCell(container) {
        let cell = new createjs.Shape();
        cell.graphics
            .beginFill("#dbffd0")
            .drawRect(this.borderSize, this.borderSize,
                this.rectSize - this.borderSize,
                this.rectSize - this.borderSize)
            .endFill();

        cell.alpha = 0.1;

        container.addChild(cell);
    }

    addStar(container) {
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        let xCoor = getRandomInt(0, this.rectSize);
        let yCoor = getRandomInt(0, this.rectSize);

        let star = new createjs.Shape();
        star.graphics
             .setStrokeStyle(this.borderSize).beginFill("#ffffff")
             .drawCircle(xCoor, yCoor, mainConfiguration.starSize)
             .endFill();

        container.addChild(star);
    }

    initArea() {
        // debugger;
        let rectSize = this.rectSize;
        let borderSize = this.borderSize;
        let xCount = document.documentElement.clientWidth / this.rectSize | 0;
        let yCount = document.documentElement.clientHeight / this.rectSize | 0;
        this.fullSize = {
            x: this.rectSize * this.worldSizeW,
            y: this.rectSize * this.worldSizeH
        };

        this.cells = [];
        for (let i = 0; i < this.worldSizeH; i++) {
            let t = [];
            for (let j = 0; j < this.worldSizeW; j++) {
                let container = new createjs.Container();
                container.x = j * rectSize;
                container.y = i * rectSize;

                for(let i = 0; i < mainConfiguration.countStar; i++)
                    this.addStar(container);

                this.addCell(container);

                container.visible = j < xCount + 5 && i < yCount + 5;

                t.push(container);
                container.state = "free";
                this.world.addChildAt(container);
            }
            this.cells.push(t);
        }

        this.rowEnds = {
            start: 0,
            end: yCount + 5
        };
        this.columnEnds = {
            start: 0,
            end: xCount + 5
        };
    }

    getExactPosition(x, y) {
        let cx = x / this.rectSize | 0;
        let cy = y / this.rectSize | 0;
        cx *= this.rectSize;
        cy *= this.rectSize;
        cx += this.rectSize / 2 | 0;
        cy += this.rectSize / 2 | 0;
        cx += this.borderSize / 2;
        cy += this.borderSize / 2;
        return {x: cx, y: cy};
    }

    getCellPosition(x, y) {
        let cx = x / this.rectSize | 0;
        let cy = y / this.rectSize | 0;
        return {x: cx, y: cy};
    }

    getPixelPoint(x, y) {
        let px = x * this.rectSize + (this.rectSize + this.borderSize) / 2;
        let py = y * this.rectSize + (this.rectSize + this.borderSize) / 2;
        return {x: px, y: py}
    }

    markSelectedCell(x, y, status) {
        if(status) {
            this.cells[y][x].children[1].alpha = areaConf.cellStyles.selected.alpha;
            this.cells[y][x].state = "busy";
        }
        else {
            this.cells[y][x].children[1].alpha = areaConf.cellStyles.default.alpha;
            this.cells[y][x].state = "free";
        }
        this.stage.update();
    }

    markCurrentCell(x, y, type) {
        let typeStr = "default";
        switch (type){
            case 0:
                typeStr = "allowed";
                break;
            case 1:
                typeStr = "denied";
                break;
        }
        if(this.currentCell){
            if(this.cells[this.currentCell.y][this.currentCell.x].state === "busy")
                this.cells[this.currentCell.y][this.currentCell.x].children[1].alpha = areaConf.cellStyles.selected.alpha;
            else
                this.cells[this.currentCell.y][this.currentCell.x].children[1].alpha = areaConf.cellStyles.default.alpha;
        }
        this.cells[y][x].children[1].alpha = areaConf.cellStyles[typeStr].alpha;
        this.currentCell = {
            x: x,
            y: y
        };
        this.stage.update();
    }


    setVisibles(x,y){
        let xCount = (document.documentElement.clientWidth / this.rectSize / 2 | 0) + 5;
        let yCount = (document.documentElement.clientHeight / this.rectSize / 2 | 0) + 5;

        if(x - xCount>0)
            this.columnEnds.start = x - xCount;
        else
            this.columnEnds.start = 0;

        if(x + xCount<this.worldSizeW)
            this.columnEnds.end = x + xCount;
        else
            this.columnEnds.end = this.worldSizeW;

        if(y - yCount>0)
            this.rowEnds.start = y - yCount;
        else
            this.rowEnds.start = 0;

        if(y + yCount<this.worldSizeH)
            this.rowEnds.end = y + yCount;
        else
            this.rowEnds.end = this.worldSizeH;

        for(let i = 0; i<this.worldSizeH; i++){
            for(let j = 0; j<this.worldSizeW; j++){
                if(i<this.rowEnds.start || i>this.rowEnds.end+1)
                    this.cells[i][j].visible = false;
                else if (j < this.columnEnds.start || j > this.columnEnds.end+1) {
                    this.cells[i][j].visible = false;
                } else this.cells[i][j].visible = true;
            }
        }
    }

    setOffset(x,y){
        this.offset.x = x;
        this.offset.y = y;
        this.world.setTransform(x,y);
        this.stage.update();
    }

    getRelativeCoord(x, y){
        return {x: x - this.offset.x, y: y - this.offset.y}
    }

    update(){
        this.world.stage.update();
    }

    setSize(height, width){
        height = height || this.canvas.height / this.rectSize + 1;
        width = width || this.canvas.width / this.rectSize + 1;
        this.worldSizeH = height;
        this.worldSizeW = width;
    }

    reconfigure(){
        this.world.removeAllChildren();
        this.initArea();
    }
}

export default Area;