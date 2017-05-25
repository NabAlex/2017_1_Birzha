import GameObject from '../game_object';
import GraphTree from '../../graph/graph_tree';

import Tower from '../models/tower';

/*
example info: {"nickname":"Nick2696","id":5784,"units":0,"beginX":50,"beginY":95,"readyForGameStart":true}
 */

class Enemy extends GameObject {
    constructor(connection, world, info) {
        super(world, info.id, info.nickname);

        let point = {x: info.beginX, y: info.beginY};

        this.color = info.color;

        this.connection = connection;

        this.enemyGraph = new GraphTree(world, this.color);
        let tower = this.generateEnemyTower(point, info.units);

        this.world.addTowerToMap(point, tower);

        this.drawObject();
    }

    drawObject() {
        this.enemyGraph.showNodes();
        this.world.update();
    }

    animation(dx, dy) {}

    generateEnemyTower(point, units) {
        let tower = new Tower(this.world, point.x, point.y, towerType.ENEMY,
            units);
        tower.client_id = this.pid;
        tower.setUserColor(this.color);

        tower.draw();

        tower.parentNode = this.enemyGraph.addNewNode(tower);

        return tower;
    }

    addNewTower(newNodeInfo) {
        let point = {
            x : newNodeInfo.x,
            y : newNodeInfo.y
        };
        let unitsCount = newNodeInfo.value;
        if(this.world.getTowerFromMap(point)){
            let to = this.world.getTowerFromMap(point);
            to.destruct();
        }

        let tower = this.generateEnemyTower(point, unitsCount);

        this.world.addTowerToMap(point, tower);
        this.drawObject();
    }

    setPerforming(flag) {
        this.enemyGraph.shapes.forEach((val, item)=>{
            item.setPerforming(flag);
        });
    }

    createLink(from, to){
        this.enemyGraph.addNewLink(from.parentNode, to.parentNode);
        this.drawObject();
    }

    removeNode(point){
        this.enemyGraph.removeNode(point);
        this.drawObject();
    }

    removeLink(point1, point2){
        this.enemyGraph.removeLink(point1, point2);
        this.drawObject();
    }

    removeAll(){
        this.enemyGraph.destruct();
    }
}

export default Enemy;