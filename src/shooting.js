//* Velocidad de disparo
const MAINSHIP_BULLET_SPEED = 3
const ENEMY_BULLET_SPEED = 3

//* Probabilidad de disparo
const ENEMY_SHOOTING_PROBABILITY = 0.04

function mainShipBulletsBehaviour() {
    if (mainShipBulletsList.length !== 0) {
        for (let i = 0; i < mainShipBulletsList.length; i++) {
            bullet = mainShipBulletsList[i]
            //---Movimiento
            bullet.position.z -= MAINSHIP_BULLET_SPEED
            //---Destruccion por default
            if ( Math.abs(mainShip.position.z - bullet.position.z) > FAR/2 ) {
                removeEntity(bullet)
                mainShipBulletsList.splice(i,1)
                i--
            }
        }
    }
} 

function enemyBulletsBehaviour() {
    const MAX_ENEMY_BULLET_Z_POSITION = 200
    if (enemyBulletsList.length !== 0) {
        for (let i = 0; i < enemyBulletsList.length; i++) {
            bullet = enemyBulletsList[i]
            //---Movimiento
            bullet.position.z += ENEMY_BULLET_SPEED
            //---Destruccion por default
            if (bullet.position.z > MAX_ENEMY_BULLET_Z_POSITION ) {
                removeEntity(bullet)
                enemyBulletsList.splice(i,1)
                i--
            }
        }
    }
}

function enemyShooting() {
    if (enemySpaceshipsList.length != 0){
        // Cada frame las naves tienen una probababilidad de disparo del 4%
        if (Math.random() < ENEMY_SHOOTING_PROBABILITY) {
            // Ahora vamos a elegir una nave al azar de la primera linea
            var randomIndex = getRandomInt(0, enemyFirstLine.length)
            enemy = enemyFirstLine[randomIndex]
            createEnemyBullet(enemy)
        }
    }
}
    