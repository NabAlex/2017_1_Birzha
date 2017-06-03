window.WAS_CREATED_TOWER = 0;
window.LAST_TOWER = 1;

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
        this.dAlpha = 0.01;

        this._status = WAS_CREATED_TOWER;
    }

    set status(value) {
        this._status = value;
    }

    get status() {
        return this._status;
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
                color = "bonus";
                fill = true;
                break;
            case towerType.ENEMY:
                color = this.userColor;
                fill = false;
                break;
            case towerType.ENEMY_MAIN:
                color =this.userColor;
                fill = false;
                break;
            case towerType.MY_MAIN:
                color =this.userColor;
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
        if(this.cache === null)
            return;

        this.cache.text.x = x;
        this.cache.text.y = y+3;

        if(this.units)
            this.cache.text.text = this.units;
    }

    setTowerCoordinates(x, y) {
        if(this.cache === null)
            return;

        this.cache.circle.x = x;
        this.cache.circle.y = y;
        this.cache.circle.regX = conf.radiusTower;
        this.cache.circle.regY = conf.radiusTower;

    }

    destruct() {
        if(this.cache) {
            this.world.map.removeChild(this.cache.circle);
            this.world.map.removeChild(this.cache.text);
        }
        this.world.area.markSelectedCell(this.pointX, this.pointY, false);
        this.world.removeTowerFromMap({x: this.pointX, y: this.pointY});
    }

    animate(alpha){
        if(alpha){
            this.cache.circle.alpha = alpha;
            return;
        }
        if(this.cache.circle.alpha>=1 && this.dAlpha>0)
            this.dAlpha *= -1;
        if(this.cache.circle.alpha<=0.7 && this.dAlpha<0)
            this.dAlpha *= -1;

        this.cache.circle.scaleX -= (this.dAlpha)/5;
        this.cache.circle.scaleY -= (this.dAlpha)/5;
        this.cache.circle.alpha += this.dAlpha;
    }

    drawStandartImpl(color, fill) {
        if(this.cache === null) {
            this.cache = {};

            let style = this.getStyle();
            let shape = new createjs.Bitmap(resources.getResult(style.color+"Tower"));
            shape.scaleX = 1;
            shape.scaleY = 1;

            this.cache.circle = shape;

            this.cache.text = new createjs.Text(this.units, "20px Kumar One", "#fcfcfc");
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
