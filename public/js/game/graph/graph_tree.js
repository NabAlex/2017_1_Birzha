import Tree from './tree';
import { tickerInstance } from '../ulits/ticker';
import { getPaddings } from '../ulits/system';

class GraphTree {
    constructor(map, color) {
        this.world = map;

        this.tree = new Tree;
        this.currentVertex = null;

        this.shapes = new Map();
        this.graphLine = null;
        this.lineColor = color;

        this.tempLineArray = [];
    }

    get getTree() {
        return this.tree;
    }

    get getCurrentVertex() {
        return this.currentVertex;
    }

    addNewVertexToCurrent(data) {
        this.currentVertex = this.tree.addNode(data, this.currentVertex);
        return this.currentVertex;
    }

    addNewVertexByNode(data, node) {
        return this.tree.addNode(data, node)
    }

    setCurrentVertex(current) {
        this.currentVertex = current;
        return this.currentVertex;
    }

    goFromCurrentVertex(node){
        node.nextNode.push(this.currentVertex);
        return node;
    }

    addNewLink(from, to){
        this.tree.addLink(from, to);
    }

    addNewNode(data){
        return this.tree.addNode(data, null);
    }

    removeNode(point){
        let removedTower = this.world.getTowerFromMap(point);
        this.tree.removeNode(removedTower.parentNode);
        for (let shape of this.shapes.keys()) {
            if(shape.pointX === point.x && shape.pointY === point.y){
                this.shapes.delete(shape);
                break;
            }
        }
        removedTower.destruct();
    }

    removeLink(point1, point2){
        let removedTower1 = this.world.getTowerFromMap(point1);
        let removedTower2 = this.world.getTowerFromMap(point2);
        this.tree.removeLink(removedTower1.parentNode, removedTower2.parentNode);
    }

    destruct() {
        this.clearStackAnimatedNodes();
        this.world.stage.removeChild(this.graphLine);
        this.graphLine.graphics.clear();
        console.log(this.shapes);
        this.shapes.forEach((value, key) => {
            key.destruct();
        });
    }

    setNode(tower) {
        let coordinatesX = tower.pointX, coordinatesY = tower.pointY;

        if(!this.shapes.has(tower)) {
            this.shapes.set(tower, 1 /* default */);
        }
        tower.setRealCoordinates(coordinatesX, coordinatesY);
        tower.draw();
    }

    clearStackAnimatedNodes() {
        while(true) {
            let tempLine = this.tempLineArray.pop();
            if(!tempLine)
                break;

            this.world.map.removeChild(tempLine);
        }
    }

    showNodes() {
        /* removes all animate nodes */
        this.clearStackAnimatedNodes();

        let marker = new Set();

        this.graphLine = this.graphLine || this.world.newLine(this.lineColor);
        this.graphLine.graphics.clear();
        this.graphLine.graphics.setStrokeStyle(mainConfiguration.lightWidth)
            .beginStroke(this.lineColor);

        this.go = (function (current, parent, marker) {
            if(current === null){
                return;
            }
            marker.add(current);
            this.setNode(current.data);

            /* make after setNode */
            this.graphLine.graphics.setStrokeStyle(mainConfiguration.lightWidth);

            current.nextNode.forEach((item) => {
                if(!marker.has(item)) {
                    let needAnimate = (item.data.status === WAS_CREATED_TOWER);
                    if(needAnimate)
                        item.data.status = LAST_TOWER;

                    this.drawWireBetweenTowers(current.data.point, item.data.point, needAnimate);
                    this.go(item, current, marker);
                } else if(item != parent) {
                    this.drawWireBetweenTowers(current.data.point, item.data.point, false);
                }
            });
        });
        this.go.bind(this)(this.tree.rootNode, null, marker);

        this.graphLine.graphics.endStroke();
    }

    drawWireBetweenTowers(from, to, animate) {
        let toCoor = this.world.area.getPixelPoint(to.x, to.y),
            fromCoor = this.world.area.getPixelPoint(from.x, from.y);

        let res = getPaddings(fromCoor, toCoor);
        let fromPoint = res.from;
        let toPoint = res.to;

        if(!animate) {
            this.graphLine.graphics.moveTo(fromPoint.x, fromPoint.y);
            this.graphLine.graphics.lineTo(toPoint.x, toPoint.y);
            this.graphLine.graphics.moveTo(res.md.x, res.md.y);
        }
        else {
            let line = new createjs.Shape();
            line.graphics.beginStroke(this.lineColor)
                .setStrokeStyle(mainConfiguration.lightWidth)
                .moveTo(fromPoint.x, fromPoint.y);

            let cmd = line.graphics.lineTo(fromPoint.x, fromPoint.y).command;

            createjs.Tween.get(cmd).to({x: toPoint.x, y: toPoint.y}, mainConfiguration.animateLightTime);
            let id = tickerInstance.addRunWithTime(mainConfiguration.animateLightTime,
                () => { this.world.stage.update(); },
                () => { tickerInstance.removeCallback(id); });

            this.world.map.addChild(line);
            this.tempLineArray.push(line);
        }
    }
}

export default GraphTree;