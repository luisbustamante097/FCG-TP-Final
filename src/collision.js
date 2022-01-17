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

function mainShipCollisionHandler() {
    // Nada por lo pronto
}
function bulletCollisionHandler(enemy, collisionResults) {
    // Remuevo la nave y la saco de la lista de naves
    removeEntity(enemy)
    var index = enemySpaceshipsList.indexOf(enemy)
    if (index !== -1) { enemySpaceshipsList.splice(index, 1) }
    // Tambien la "tacho" en la matriz
    var i_enemy = 0, j_enemy = 0
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 12; j++) {
            if (enemySpaceshipsMatrix[i][j] == enemy){
                enemySpaceshipsMatrix[i][j] = null
                i_enemy = i
                j_enemy = j
                break
            }
        }
    }
    // Ademas debo actualizar la lista de primera linea
    if (i_enemy > 0){
        enemiesFirstLine[j_enemy] = enemySpaceshipsMatrix[i_enemy - 1][j_enemy]
    } else{
        enemiesFirstLine.splice(j_enemy, 1)
    }
    
    // Obtengo el bullet que mato a la nave, lo remuevo, y lo saco de su lista
    var bullet = collisionResults[0].object
    removeEntity(bullet) 
    var index = bulletsList.indexOf(bullet)
    if (index !== -1) { bulletsList.splice(index, 1) }
}