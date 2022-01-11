//* Variables y constantes para el movimiento de las naves
const ENEMIES_INITIAL_SPEED = 30
const ENEMIES_STEP_DOWN = 2
var currentSpeed = ENEMIES_INITIAL_SPEED

// Clock para movimiento de las naves enemigas
var enemiesClock = new THREE.Clock()
enemiesClock.start()

function moveEnemies(){
    var delta = enemiesClock.getDelta()
    var rightShip = lastShipOnRightSide()
    var leftShip = lastShipOnLeftSide()
    
    enemySpaceshipsList.forEach(enemy => {
        enemy.position.x += currentSpeed * delta
    });
    
    if (rightShip.position.x > MAP_WIDE_X || leftShip.position.x < -MAP_WIDE_X) {
        // Cuando llego al borde, cambio de sentido
        currentSpeed *= -1
        enemySpaceshipsList.forEach(enemy => {
            // Hay una pequeña posibilidad de que al cambiar de sentido se trabe la nave
            // Por lo cual, muevo a todas las naves un paso en el sentido contrario para evitar el cuelgue
            enemy.position.x += currentSpeed * delta
            
            // Cada que llego al borde tengo que bajar un poco en el eje z
            enemy.position.z += ENEMIES_STEP_DOWN
        });
        if (rightShip.position.x > MAP_WIDE_X) debugger; //! si entra acá hay error
    }
    
    
    
    if (rightShip == null || leftShip == null){
        debugger // Si llegó hasta acá es porque el jugador gano al matar todas las naves
    }
}
    
function lastShipOnRightSide(){
    for (let j = 11; j >= 0; j--) {
        for (let i = 4; i >= 0; i--) {
            if (enemySpaceshipsMatrix[i][j] != null)
                return enemySpaceshipsMatrix[i][j]
        }
    }
    return null
}
function lastShipOnLeftSide(){
    for (let j = 0; j < 12; j++) {
        for (let i = 4; i >= 0; i--) {
            if (enemySpaceshipsMatrix[i][j] != null)
                return enemySpaceshipsMatrix[i][j]
        }
    }
    return null
}