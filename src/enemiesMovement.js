//* Variables y constantes para el movimiento de las naves
const ENEMIES_INITIAL_SPEED = 30
const ENEMIES_STEP_DOWN = 4
const ENEMIES_SPEED_INCREASE = 6
var currentSpeed = ENEMIES_INITIAL_SPEED
var speedSign = 1

// Clock para movimiento de las naves enemigas
var enemiesClock = new THREE.Clock()
enemiesClock.start()

function moveEnemies(){
    var delta = enemiesClock.getDelta()
    var rightShip = lastShipOnRightSide()
    var leftShip = lastShipOnLeftSide()
    
    enemySpaceshipsList.forEach(enemy => {
        enemy.position.x += speedSign * currentSpeed * delta
    });
    
    if (rightShip.position.x > MAP_WIDE_X || leftShip.position.x < -MAP_WIDE_X) {
        // Cuando llego al borde, cambio de sentido
        speedSign *= -1
        enemySpaceshipsList.forEach(enemy => {
            // Hay una pequeña posibilidad de que al cambiar de sentido se trabe la nave
            // Por lo cual, muevo a todas las naves un paso en el sentido contrario para evitar el cuelgue
            enemy.position.x += speedSign * currentSpeed * delta
            
            // Cada que llego al borde tengo que bajar un poco en el eje z
            enemy.position.z += ENEMIES_STEP_DOWN
        });
        
        // También debe incrementar la velocidad de a poco
        currentSpeed += ENEMIES_SPEED_INCREASE
    }
}
    
function lastShipOnRightSide(){
    for (let j = SHIPS_IN_ROW-1; j >= 0; j--) {
        for (let i = SHIPS_IN_COLS-1; i >= 0; i--) {
            if (enemySpaceshipsMatrix[i][j] != null)
                return enemySpaceshipsMatrix[i][j]
        }
    }
    return null
}
function lastShipOnLeftSide(){
    for (let j = 0; j < SHIPS_IN_ROW; j++) {
        for (let i = SHIPS_IN_COLS-1; i >= 0; i--) {
            if (enemySpaceshipsMatrix[i][j] != null)
                return enemySpaceshipsMatrix[i][j]
        }
    }
    return null
}