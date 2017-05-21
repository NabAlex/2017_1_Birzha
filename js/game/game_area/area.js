'use strict';

class Area {
    constructor(elementDOM) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas-area";
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 0;
        this.canvas.style.left = "0px";
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

        this.fullSize = {
            x: this.rectSize * this.worldSizeW,
            y: this.rectSize * this.worldSizeH
        };

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

    initArea() {
        let rectSize = this.rectSize;
        let borderSize = this.borderSize;
        let xCount = document.documentElement.clientWidth / this.rectSize | 0;
        let yCount = document.documentElement.clientHeight / this.rectSize | 0;

        this.cells = [];

        for (let i = 0; i < this.worldSizeH; i++) {
            let t = [];
            for (let j = 0; j < this.worldSizeW; j++) {
                let cell = new createjs.Shape();
                cell.graphics
                    .setStrokeStyle(this.borderSize).beginStroke("#fffbf7")
                    .drawRect(j * rectSize + borderSize/2, i * rectSize + borderSize/2, rectSize, rectSize)
                    .endStroke()
                    .beginFill("#dbffd0")
                    .drawRect(j * rectSize + borderSize, i * rectSize + borderSize, rectSize - borderSize, rectSize - borderSize)
                    .endFill();
                if(j < xCount + 5 && i < yCount + 5){
                    cell.visible = true;
                } else {
                    cell.visible = false;
                }
                t.push(cell);
                this.world.addChildAt(cell);
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
        let rectSize = this.rectSize;
        let borderSize = this.borderSize;
        x *= rectSize;
        y *= rectSize;

        let cell = new createjs.Shape();
        if(status)
            cell.graphics.beginFill("#beffb1").drawRect(x + borderSize, y + borderSize, rectSize - borderSize, rectSize - borderSize).endFill();
        else
            cell.graphics.beginFill("#dbffd0").drawRect(x + borderSize, y + borderSize, rectSize - borderSize, rectSize - borderSize).endFill();

        this.world.addChild(cell);
        this.stage.update();
    }

    markCurrentCell(x, y, type) {
        let rectSize = this.rectSize;
        let borderSize = this.borderSize;
        x *= rectSize;
        y *= rectSize;

        let color = "#ffa895";
        switch (type){
            case 0:
                color = "#beffb1";
                break;
            case 1:
                color = "#ffa895";
                break;
        }
        if(this.currentCell){
            this.world.removeChild(this.currentCell);
        }
        this.currentCell = new createjs.Shape();
        this.currentCell.graphics.beginFill(color).drawRect(x + borderSize, y + borderSize, rectSize - borderSize, rectSize - borderSize).endFill();
        this.world.addChild(this.currentCell);
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
}

export default Area;