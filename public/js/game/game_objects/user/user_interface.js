const STATE_BEGIN = 0,
      STATE_FLY = 1,
      STATE_CHOOSE_NODE = 2,
      STATE_DO_STEP = 3,
      STATE_CHECK_STEP = 4,
      STATE_CHOOSE_UNITS = 5;

class UserScroll {
    constructor(world) {
        this.world = world;

        this.point = {x: 0, y: 0};

        this._text = new createjs.Text(this.units, "25px Arial", "#ff7700");
        this._text.textBaseline = "middle";
        this._text.textAlign = "center";
        this.world.map.addChild(this._text);

        this.hide();
    }

    setPosition(x, y) {
        this.point.x = x + conf.paddingHintX;
        this.point.y = y - conf.paddingHintY;
    }

    show(units) {
        this.hidden = false;
        this._text.visible = true;
        this.drawPercent(units);
    }

    hide() {
        this.hidden = true;
        this._text.visible = false;
        this.world.update();
    }

    drawPercent(units) {
        if(this.hidden)
            return;

        this._text.text = units;
        this._text.x = this.point.x;
        this._text.y = this.point.y;
        this.world.update();
    }

    destruct() {
        this.world.stage.removeChild(this._text);
    }
}

class UserInterface {

    constructor(world, packCallback, startPos) {
        this.world = world; // get area
        this.mouseMoveListener = function(event){
            this.eventManager(event);
        }.bind(this);
        this.mouseUpListener = function(event){
            this.eventManager(event);
        }.bind(this);
        this.mouseDownListener = function(event){
            this.eventManager(event);
        }.bind(this);
        this.mouseClickListener = function(event){
            this.eventManager(event);
        }.bind(this);
        this.world.canvas.addEventListener("mousemove", this.mouseMoveListener);
        this.world.canvas.addEventListener("mouseup", this.mouseUpListener);
        this.world.canvas.addEventListener("mousedown", this.mouseDownListener);
        this.world.canvas.addEventListener("click", this.mouseClickListener);

        this.probablyLine = this.world.newLine("black");
        this.probablyCircle = this.world.newShape(null, conf.userSize, "DeepSkyBlue", false);


        this.packCallback = packCallback;
        this.startPos = startPos;

        this.world.update();
        this.world.area.world.stage.update();

        this.last_mv = {x: 0, y: 0};

        this.pointerLockStatus = false;
        this.pointerLockChangeListener = function (event) {
            this.pointerLockStatus = !!document.pointerLockElement;
        }.bind(this);
        document.addEventListener("pointerlockchange", this.pointerLockChangeListener);

        this.currentPos = this.startPos;
        this.color = this.packCallback["getMyColor"]();

        this.makeState(STATE_BEGIN, null);
        this.scrollBar = new UserScroll(this.world);
    }

    makeState(typeState, data) {
        this.currentMode = {
            typeState: typeState,
            data: data
        };
    }

    eventMove(event) {
        let pxPoint = this.world.area.getPixelPoint(this.currentPos.x, this.currentPos.y);
        this.last_mv = this.last_mv || {x: 0, y: 0};

        let mv = {
            x: this.last_mv.x - event.movementX,
            y: this.last_mv.y - event.movementY
        };
        if (pxPoint.x - mv.x < 0 || pxPoint.x - mv.x > this.world.area.fullSize.x - 1)
            return;
        if (pxPoint.y - mv.y < 0 || pxPoint.y - mv.y > this.world.area.fullSize.y - 1)
            return;

        let cellPos = this.world.area.getCellPosition(pxPoint.x - mv.x, pxPoint.y - mv.y);

        this.probablyCircle.x = pxPoint.x - mv.x;
        this.probablyCircle.y = pxPoint.y - mv.y;

        this.probablyLine.graphics.clear();
        this.world.moveToFront(this.probablyCircle);
        this.world.moveToFront(this.probablyLine);
        if (this.currentMode.typeState === STATE_DO_STEP) {
            if (!this.checkCellForVertex(cellPos)) {
                this.world.area.markCurrentCell(cellPos.x, cellPos.y, 1);
            } else
                this.world.area.markCurrentCell(cellPos.x, cellPos.y, 0);

            this.probablyLine.graphics.setStrokeStyle(1).beginStroke(this.color);
            this.probablyLine.graphics.moveTo(pxPoint.x, pxPoint.y);
            this.probablyLine.graphics.lineTo(this.probablyCircle.x, this.probablyCircle.y);
            this.probablyLine.graphics.endStroke();
        } else if (this.currentMode === STATE_CHOOSE_NODE) {
            if (this.world.arrayMap[cellPos.x][cellPos.y]) {
                if (this.world.arrayMap[cellPos.x][cellPos.y].client_id !== this.packCallback['getClientId']()) {
                    this.world.area.markCurrentCell(cellPos.x, cellPos.y, 1);
                } else
                this.world.area.markCurrentCell(cellPos.x, cellPos.y, 0);
            } else
                this.world.area.markCurrentCell(cellPos.x, cellPos.y, 1);
        }
        this.last_mv.x = mv.x;
        this.last_mv.y = mv.y;

        this.world.setOffsetForCenter(this.probablyCircle.x, this.probablyCircle.y);
        this.world.update(); // TODO tick
    }

    checkCellForVertex(cellPos) {
        let dx = cellPos.x - this.currentPos.x,
            dy = cellPos.y - this.currentPos.y;

        let mabsx = Math.abs(dx),
            mabsy = Math.abs(dy);

        if(mabsx > 2 ||
           mabsy > 2 ||
           mabsx * mabsy === 2 * 2) {
            this.makeState(STATE_DO_STEP);
            return false;
        }

        if ((mabsx == 2 && mabsy == 0) ||
            (mabsx == 0 && mabsy == 2)) {
            console.log(this.currentPos.x + (dx / 2 | 0));
            let overNode = this.packCallback["getTowerByPoint"]({
                x: this.currentPos.x + (dx / 2 | 0),
                y: this.currentPos.y + (dy / 2 | 0)
            });

            if(overNode)
                return false;
        }

        return true;
    }

    putNewVertex(newPoint, units) {
        console.log("choose units: " + units);
        if(units < 1 || units > this.currentMode.data.currentTower.units - 1)
            return;

        if(!this.packCallback["getPerforming"]())
            return;

        let newX = newPoint.x, newY = newPoint.y;
        let newPos = this.world.area.getCellPosition(newX, newY);
        if (!this.checkCellForVertex(newPos)) {
            return;
        }

        if (this.currentPos.x === newPos.x && this.currentPos.y === newPos.y) {
            return;
        }

        this.packCallback["addTower"](newPos, units);
        this.world.area.markSelectedCell(newPos.x, newPos.y, true);

        this.world.update();

        this.last_mv.x = 0;
        this.last_mv.y = 0;
        this.currentPos = newPos;
    }

    chooseNewVertex() {
        let newX = this.probablyCircle.x, newY = this.probablyCircle.y;
        let newPos = this.world.area.getCellPosition(newX, newY);
        if (this.world.arrayMap[newPos.x][newPos.y]) {
            if (this.world.arrayMap[newPos.x][newPos.y].client_id !== this.packCallback['getClientId']()) {
                return;
            }
        } else
            return;
        this.currentPos = newPos;
        this.probablyCircle.x = newX;
        this.probablyCircle.y = newY;
        this.packCallback['setCurrentNode'](newPos);

        this.world.area.markSelectedCell(newPos.x, newPos.y, true);

        this.world.update();

        this.last_mv.x = 0;
        this.last_mv.y = 0;
    }

    getCurrentMousePosition() {
        let pxPoint = this.world.area.getPixelPoint(this.currentPos.x, this.currentPos.y);
        return {
            x: pxPoint.x - this.last_mv.x,
            y: pxPoint.y - this.last_mv.y
        };
    }

    eventManager(event){
        if(event.type === 'click' && event.which === 1 && this.pointerLockStatus === false){
            this.makeState(STATE_CHOOSE_NODE, null);
            this.world.canvas.requestPointerLock();
            return;
        }

        if(!this.pointerLockStatus)
            return;


        if(event.type === 'click' &&
            event.which === 1 &&
            this.packCallback["getPerforming"]()) {

            if (this.currentMode.typeState === STATE_CHOOSE_NODE) {
                this.makeState(STATE_DO_STEP, null);
                this.chooseNewVertex(event);
                return;
            }
        }

        if (event.type === 'click' &&
            event.which === 3 &&
            this.currentMode.typeState === STATE_DO_STEP) {

            this.makeState(STATE_CHOOSE_NODE, null);
            this.probablyLine.graphics.clear();

        }


        if(event.type === 'mousemove') {
            this.eventMove(event); // PASS STATE_CHOOSE_NODE AND STATE_DO_STEP, STATE_CHOOSE_UNITS

            if(this.currentMode.typeState === STATE_CHOOSE_UNITS) {
                let realPoint = this.getCurrentMousePosition();
                this.scrollBar.setPosition(realPoint.x, realPoint.y);
                let lastY = this.currentMode.data.wasRealPosition.y;
                let nowY = this.getCurrentMousePosition().y;
                let percent = Math.max(Math.min(lastY - nowY + 50, 100), 0);
                let units = this.currentMode.data.currentTower.units;
                let newUnits = parseInt(units * percent / 100);

                this.currentMode.data.finalUnits = newUnits;
                this.scrollBar.drawPercent(newUnits);
            }
        } else if(event.type === 'mousedown' &&
                  event.which === 1 &&
                  this.currentMode.typeState === STATE_DO_STEP) {

            let newX = this.probablyCircle.x, newY = this.probablyCircle.y;
            let newPos = this.world.area.getCellPosition(newX, newY);
            if(!this.checkCellForVertex(newPos))
                return;

            this.world.area.markSelectedCell(newPos.x, newPos.y);

            let realPoint = this.getCurrentMousePosition();
            this.scrollBar.setPosition(realPoint.x, realPoint.y);
            this.scrollBar.show();

            let tower = this.packCallback['getTower']();
            this.makeState(STATE_CHOOSE_UNITS, {
                currentTower: tower,
                wasRealPosition: realPoint,
                finalUnits: parseInt(tower.units / 2)
            });

        } else if(event.type === 'mouseup' &&
                  event.which === 1 &&
                  this.currentMode.typeState === STATE_CHOOSE_UNITS) {
            console.log("one");
            this.putNewVertex(this.currentMode.data.wasRealPosition, this.currentMode.data.finalUnits);

            this.scrollBar.hide();

            this.makeState(STATE_CHOOSE_NODE, null);
            // TODO draw scroll
        }
    }

    closeManager(event) {
        if (this.currentMode === 'chooseunits') {
            console.log("up");
        }
    }

    destruct(){
        this.world.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.world.canvas.removeEventListener('mouseup', this.mouseUpListener);
        this.world.canvas.removeEventListener('mousedown', this.mouseDownListener);
        this.world.canvas.removeEventListener("pointerlockchange", this.pointerLockChangeListener);
        this.world.canvas.removeEventListener("click", this.mouseClickListener);
        this.mouseMoveListener = null;
        this.mouseDownListener = null;
        this.mouseUpListener = null;
        this.mouseClickListener = null;
        this.pointerLockChangeListener = null;
        this.eventManager = null;
    }
}

export default UserInterface;