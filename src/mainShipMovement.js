function mainShipMovement(moving) {
    var moveDistance = MAINSHIP_SPEED * movementClock.getDelta()
    
	if ( pressedLeft() && isMainShipInsideLeftBorder() ){
	    mainShip.position.x -= moveDistance
        saveMovementsFromMainship(-moveDistance)
        moving = true
    }
	if ( pressedRight() && isMainShipInsideRightBorder() && !moving ){
        mainShip.position.x += moveDistance
        saveMovementsFromMainship(+moveDistance)
        moving = true
    }
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