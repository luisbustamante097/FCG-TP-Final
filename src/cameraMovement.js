// La camara no este atada a la nave solo bindeando su posicion
// La mecanica es que haya cierto delay entre que el objeto se mueve y que la camara llegue hasta el
// La forma en que se implemento es que la nave vaya guardando en un stack sus pasos,
//  pero por cada paso que da, divide la distancia del movimiento en "steps"
//  y son esos pasos del stack que seguira la camara
//  es decir que por cada paso que hace la nave, la camara hace "steps"*pasos.
// Pero una vez que la camara esta a menos de closeRadius, borrara el stack
//  y empezara a acercarse hacía la nave con velocidad stepsForStop
// Por último cuando ya esté a veryCloseRadius de la nave, se limpia el stack y se bindeara su posicion


const steps = 3
const stepsForStop = 2
const stepsForMoving = 2

const closeRadius = 100
const veryCloseRadius = 5

function saveMovementsFromMainship(moveDistance) {
    // Pusheo "steps" pasos por cada paso que dio la nave
    for (let i = 0; i < steps; i++) {
        cameraMovementsStack.push(moveDistance/steps)
    }
}

function cameraMovement(moving) {
    console.log(cameraMovementsStack.length)
    if (moving) {
        for (let i = 0; i < stepsForMoving; i++) {
            var steppedMovement = cameraMovementsStack.pop()
            camera.position.x += steppedMovement
        }   
    } else{
        if (cameraIsInto(closeRadius)){
            cameraMovementsStack = []
            if (cameraIsInto(veryCloseRadius)) {
                camera.position.x = mainShip.position.x
            }else{
                var posDiff = camera.position.x - mainShip.position.x
                var iter = 0
                // console.log(posDiff)
                
                while (++iter < Math.abs(posDiff)) {
                    if (posDiff < 0){
                        cameraMovementsStack.push(stepsForStop)
                    }else{
                        cameraMovementsStack.push(-stepsForStop)
                    }
                }
            }
        }
        if(cameraMovementsStack.length != 0){
            for (let i = 0; i < stepsForStop; i++) {
                if(cameraMovementsStack.length == 0) break;
                var steppedMovement = cameraMovementsStack.pop()
                camera.position.x += steppedMovement
            }
        }
    }
}

function cameraIsInto(radious) {
    return (Math.abs(camera.position.x - mainShip.position.x) < radious)
}

//TODO: Sacar si no es necesario
function simpleCameraMoving() {camera.position.x = mainShip.position.x}