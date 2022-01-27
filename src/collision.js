function checkIfCollides(object, handler, collidableMeshesListOfObject) {
    var originPoint = object.position.clone()
    var position = object.geometry.attributes.position
    var localVertex = new THREE.Vector3()
    
    for (var vertexIndex = 0; vertexIndex < position.count; vertexIndex ++){	
        localVertex.fromBufferAttribute( position, vertexIndex )
        var globalVertex = localVertex.applyMatrix4( object.matrix )
        var directionVector = globalVertex.sub( object.position )
        
        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() )
        var collisionResults = ray.intersectObjects( collidableMeshesListOfObject )
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            handler(object, collisionResults)
            break;
        }
    }	
}

function mainShipCollisionHandler(object, collisionResults) {
    console.log("I'm bleading")
    var bullet = collisionResults[0].object
    removeEntity(bullet) 
    var index = enemyBulletsList.indexOf(bullet)
    if (index !== -1) { enemyBulletsList.splice(index, 1) }
    
}
function bulletCollisionHandler(enemy, collisionResults) {
    // Remuevo la nave y la saco de la lista de naves
    removeEntity(enemy)
    var index = enemySpaceshipsList.indexOf(enemy)
    if (index !== -1) { enemySpaceshipsList.splice(index, 1) }
    // Tambien la "tacho" en la matriz
    for (let i = 0; i < SHIPS_IN_COLS; i++) {
        for (let j = 0; j < SHIPS_IN_ROW; j++) {
            if (enemySpaceshipsMatrix[i][j] == enemy){
                enemySpaceshipsMatrix[i][j] = null
                break
            }
        }
    }
    // Ademas debo actualizar la lista de primera linea si es que el enemigo pertenecia a ella
    if (enemyFirstLine.includes(enemy)){
        var index = enemyFirstLine.indexOf(enemy)
        enemyFirstLine.splice(index, 1)
    }
    
    // Obtengo el bullet que mato a la nave, lo remuevo, y lo saco de su lista
    var bullet = collisionResults[0].object
    removeEntity(bullet) 
    var index = mainShipBulletsList.indexOf(bullet)
    if (index !== -1) { mainShipBulletsList.splice(index, 1) }
}

function shieldCollisionHandler(object, collisionResults) {
    console.log("SHIELD FIRED")
    var bullet = collisionResults[0].object
    removeEntity(bullet) 
    // var index = enemyBulletsList.indexOf(bullet)
    // if (index !== -1) { enemyBulletsList.splice(index, 1) }
    var index = mainShipBulletsList.indexOf(bullet)
    if (index !== -1) { mainShipBulletsList.splice(index, 1) }
    object.material.color.setHex(0x00FF00)
}