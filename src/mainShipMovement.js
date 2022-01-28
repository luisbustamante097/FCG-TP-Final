function mainShipMovement() {
    var isMoving = false
    var moveDistance = MAINSHIP_SPEED * movementClock.getDelta()
    
	if ( pressedLeft() && isMainShipInsideLeftBorder() ){
	    mainShip.position.x -= moveDistance
        saveMovementsFromMainship(-moveDistance)
        isMoving = true
    }
	if ( pressedRight() && isMainShipInsideRightBorder() && !isMoving ){
        mainShip.position.x += moveDistance
        saveMovementsFromMainship(+moveDistance)
        isMoving = true
    }
    return isMoving
}

function isMainShipInsideRightBorder() {
    return mainShip.position.x < MAP_WIDE_X
}

function isMainShipInsideLeftBorder() {
    return mainShip.position.x > -MAP_WIDE_X
}

function pressedLeft() {
    return keyboard.pressed("A") || keyboard.pressed("left")
}
function pressedRight() {
    return keyboard.pressed("D") || keyboard.pressed("right")
}