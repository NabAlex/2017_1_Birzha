class Tower {
    constructor(world, pointX, pointY, typeOfTower, units) {
        this.world = world;
        this.pointX = pointX; // TODO to normal
        this.pointY = pointY;

        let pxPoint = this.world.area.getPixelPoint(pointX, pointY);
        this.realX = pxPoint.x;
        this.realY = pxPoint.y;

        this.typeOfTower = typeOfTower;
        this.userColor = null;

        this.cache = null;

        this.units = units;

        this._parentNode = null;
        this._client_id = null;
    }

    changeUnits(units){
        this.units = units;
        this.cache.text.text = units;
        this.world.update();
    }

    refreshTower(towerType, newUnits, client_id) {
        this.world.map.removeChild(this.cache.circle);
        this.world.map.removeChild(this.cache.text);

        this.cache = null; // TODO maybe some remove?

        this.typeOfTower = towerType;
        this.units = newUnits;
        this._parentNode = null;
        this._client_id = client_id;
    }

    get parentNode() {
        return this._parentNode;
    }

    set parentNode(value) {
        this._parentNode = value;
    }

    get client_id() {
        return this._client_id;
    }

    set client_id(value) {
        this._client_id = value;
    }

    get point() {
        return {
            x: this.pointX,
            y: this.pointY
        }
    }

    decUnits(value) {
        this.units -= value;
    }

    setPerforming(flag) {
        if(this.cache === null)
            return;
        let style = this.getStyle();
        if(flag)
            Tower.setShapeTower(this.cache.circle.graphics, style.color, true);
        else {
            Tower.setShapeTower(this.cache.circle.graphics, style.color, style.fill);
        }

    }

    getStyle() {
        let color = null;
        let fill = null;

        switch(this.typeOfTower) {
            case towerType.DEFAULT:
                color = this.userColor;
                fill = false;
                break;
            case towerType.BONUS:
                color = "#cccccc";
                fill = true;
                break;
            case towerType.ENEMY:
                color = this.userColor;
                fill = false;
                break;
            case towerType.MAIN:
                color = "#000";
                fill = false;
                break;
            default:
                console.log("wtf!!");
                return;
        }

        return {
            color: color,
            fill: fill
        };
    }

    draw() {
        let style = this.getStyle();
        this.drawStandartImpl(style.color, style.fill);
    }

    setRealCoordinates(x, y){
        let pxPoint = this.world.area.getPixelPoint(x, y);
        this.realX = pxPoint.x;
        this.realY = pxPoint.y;
    }

    setCell(pointX, pointY) {
        this.pointX = pointX;
        this.pointY = pointY;
    }

    setTextCoordinates(x, y) {
        if(this.cache == null)
            return;

        this.cache.text.x = x;
        this.cache.text.y = y;

        if(this.units)
            this.cache.text.text = this.units;
    }

    setTowerCoordinates(x, y) {
        if(this.cache === null)
            return;

        this.cache.circle.x = x;
        this.cache.circle.y = y;
    }

    destruct() {
        if(this.cache) {
            this.world.map.removeChild(this.cache.circle);
            this.world.map.removeChild(this.cache.text);
            this.world.area.markSelectedCell(this.pointX, this.pointY, false);
            this.world.removeTowerFromMap({x: this.pointX, y: this.pointY});
        }
    }

    static setShapeTower(graphics, color, fill) {
        if (fill)
            graphics.clear().beginFill(color).drawCircle(0, 0, conf.radiusTower);
        else
            graphics.clear().setStrokeStyle(3).beginStroke(color).drawCircle(0, 0, conf.radiusTower)

    }

    drawStandartImpl(color, fill) {
        if(this.cache === null) {
            this.cache = {};

            let shape = new createjs.Shape();
            Tower.setShapeTower(shape.graphics, color, fill, this.typeOfTower===towerType.MAIN);

            this.cache.circle = shape;

            this.cache.text = new createjs.Text(this.units, "20px Arial", "#ff7700");
            this.cache.text.textBaseline = "middle";
            this.cache.text.textAlign = "center";

            this.setTextCoordinates(this.realX, this.realY);
            this.setTowerCoordinates(this.realX, this.realY);

            this.world.appendOnMap(this.cache.circle);
            this.world.appendOnMap(this.cache.text);
        }

        this.setTextCoordinates(this.realX, this.realY);
        this.setTowerCoordinates(this.realX, this.realY);
        this.world.update();
    }

    setUserColor(color){
        this.userColor = color;
    }
}

export default Tower;
