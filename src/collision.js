/**
* Descripción: Detecta collisiones en un objeto
* @param object el objeto a ser collisionado
* @param handler la función que será levantada si se detecta una colisión
* @param collidableMeshesListOfObject los únicos objetos que pueden collisionar en "object"
*/
function checkIfCollides(object, handler, collidableMeshesListOfObject) {
    var originPoint = object.position.clone()
    var position = object.geometry.attributes.position
    var localVertex = new THREE.Vector3()
    for (var vertexIndex = 0; vertexIndex < position.count; vertexIndex ++){	
        localVertex.fromBufferAttribute( position, vertexIndex )
        var globalVertex = localVertex.applyMatrix4( object.matrix )
        // directionVector es el vector que apunta desde la posición del object al vertice
        var directionVector = globalVertex.sub( object.position )
        // Entonces se crea un ray desde el centro del objeto en dirección al vertice
        // Hago que la distancia máxima hasta la que busca el rayo sea de 300
        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize(),0,300)
        var collisionResults = ray.intersectObjects( collidableMeshesListOfObject )
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            handler(object, collisionResults[0])
            break;
        }
    }	
}

function mainShipCollisionHandler(object, collisionedObject) {
    var bullet = collisionedObject.object
    removeEntity(bullet) 
    var index = enemyBulletsList.indexOf(bullet)
    if (index !== -1) { enemyBulletsList.splice(index, 1) }
    
    // Resto los corazones y la vida
    removedHeart = hearts.pop()
    mainShipLife -= 1
    removeEntityFromSceneOrtho(removedHeart)
    
    function removeEntityFromSceneOrtho(mesh) {
        const object = sceneOrtho.getObjectByProperty( 'uuid', mesh.uuid );
        // object.texture.dispose();
        object.material.dispose();
        sceneOrtho.remove( object );
    }
}
function bulletCollisionHandler(enemy, collisionedObject) {
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
    var bullet = collisionedObject.object
    removeEntity(bullet) 
    var index = mainShipBulletsList.indexOf(bullet)
    if (index !== -1) { mainShipBulletsList.splice(index, 1) }
}

// Funciones para colisiones en los escudos
function shieldsCollisionDetect() {
    shields.forEach(shield => {
        checkIfSomeBulletCollides(mainShipBulletsList)
        checkIfSomeBulletCollides(enemyBulletsList)

        function checkIfSomeBulletCollides(bulletsList) {
            var bulletFound = bulletsList.find(bullet => hasCollisionWithShield(bullet))
            if (bulletFound !== undefined) {
                shieldCollisionHandler(bulletFound, bulletsList)
            }
        }

        function hasCollisionWithShield(bullet) {
            return Math.abs(bullet.position.z - shield.position.z) <= shield.geometry.parameters.height / 2 &&
                Math.abs(bullet.position.x - shield.position.x) <= shield.geometry.parameters.width / 2
        }

        function shieldCollisionHandler(bullet, bulletsList) {
            // Removemos la bullet
            removeEntity(bullet)
            var index = bulletsList.indexOf(bullet)
            if (index !== -1) { bulletsList.splice(index, 1)} 

            // Aplicamos efecto sobre el shield
            shieldsLife[shield.uuid] -= SHIELD_LIFE_DECREASE
            // La opacidad se reduce en proporción a la vida sacada
            shield.material.opacity -= SHIELD_LIFE_DECREASE / SHIELDS_MAX_LIFE

            // Si la salud es menor a 0 eliminamos al shield
            var shieldLife = shieldsLife[shield.uuid]
            if (shieldLife <= 0) {
                removeEntity(shield)
                var index = shields.indexOf(shield)
                if (index !== -1) { shields.splice(index, 1)} 
                delete shieldsLife[shield.uuid]
            }
        }
    })
}