//?######################################################
//?------DOCUMENTACIÓN DEL MOVIMIENTO DE LA CAMARA-------
/*
* La camara no este atada a la nave solo bindeando su posicion
* La mecanica es que haya cierto delay entre que el objeto se mueve y que la camara llegue hasta el
* La forma en que se implemento es a traves de un stack de movimiento
* Y el comportamiento de este esta dividido en dos situaciones
* - Cuando la nave se esta moviendo:
*     Se stackean los movimientos que realizo la nave, dividido por la variable steps, para hacer el delay
*     Luego se popean y ejecutan los pasos stackeados, pero solo se hacen stepsForMoving pasos por ciclo de ejec
* - Cuando la nave no se esta moviendo:
*     Se limpia el stack
*     Se calcula la distancia desde la camara a la nave, y se stackea con una distancia paso de stepsForStop
*     Luego se popean y ejecutan los pasos stackeados, pero solo se hacen stepsForStop pasos por ciclo de ejec
* Si se llega a una distancia veryCloseRadius de la nave, se copia la pos.x de la nave
*/
//?------DOCUMENTACIÓN DEL MOVIMIENTO DE LA CAMARA-------
//?######################################################

const steps = 4
const stepsForStop = 2
const stepsForMoving = 3

const veryCloseRadius = 4.1

function saveMovementsFromMainship(moveDistance) {
    // Pusheo "steps" pasos por cada paso que dio la nave
    for (let i = 0; i < steps; i++) {
        cameraMovementsStack.push(moveDistance/steps)
    }
}

function cameraMovement(moving) {
    if (moving) {
        // Si se esta movimiendo, solo voy sacar lo que pushee durante el movimiento
        camera.position.x += displacementValueAfterMoving(stepsForMoving)
    } else{
        // Si no se está moviendo, limpio el stack
        cleanStack()
        // Trazo la ruta hacía la nave y la guardo en el stack
        traceToMainShip()
        
        if(cameraMovementsStack.length != 0){
            // Sigo sacando lo que sea que haya en el stack
            camera.position.x += displacementValueAfterMoving(stepsForStop)
            
            // Si estoy muy cerca directamente asigno a la camara la posición de la nave
            if (cameraIsInto(veryCloseRadius)) {
                camera.position.x = mainShip.position.x
                //TODO: Hacerlo más suave al movimiento
            }
        }
    }
    // console.log(cameraMovementsStack.length)
}

// Stackea la cantidad de pasos necesarios desde la camara hasta la nave
function traceToMainShip() {
    var difference = camera.position.x - mainShip.position.x
    var distance = Math.abs(difference)
    var direction = -Math.sign(difference)
    for (let i = 0; i < distance; i += stepsForStop) {
        cameraMovementsStack.push( direction*stepsForStop )
    }
    // console.log(distance)
}

// Sumo tantos pasos como sea el parametro (y sin que se acabe el stack)
function displacementValueAfterMoving(stepsLimit){
    var totalMovement = 0
    for (let i = 0; i < stepsLimit && (cameraMovementsStack.length != 0); i++) {
        totalMovement += cameraMovementsStack.pop()
    }
    return totalMovement
}

function cleanStack() { cameraMovementsStack = [] } 

function cameraIsInto(radious) {
    return (Math.abs(camera.position.x - mainShip.position.x) < radious)
}

//TODO: Sacar si no es necesario
function simpleCameraMoving() {camera.position.x = mainShip.position.x}