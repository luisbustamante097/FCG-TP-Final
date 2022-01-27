// Variables globales estandares
var container, scene, camera, renderer, controls, stats
// Keyboard controller (from KeyboardState.js)
var keyboard = new KeyboardState()

// Clock para movimiento de la nave principal
var movementClock = new THREE.Clock()

//* Atributos para la camara
const SCREEN_WIDTH  = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 80   // FOV
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1, FAR = 1000   //TODO: Cambiar FAR si es necesario

//* Nave principal y wireframe flotante
var mainShip, wireframeCube

//* Lista de Bullets
var mainShipBulletsList = []

//* Lista de Bullets enemigos
var enemyBulletsList = []

//* Lista de naves enemigas
var enemySpaceshipsList = []

//* Matriz de naves enemigas
var enemySpaceshipsMatrix

//* Lista de naves en primera linea
var enemyFirstLine

//* Arreglo de 3 shields
var shields = []

//* Flag para evitar que se empieze usar el mainShip antes de que este su modelo cargado
var waitToStart = 10 // Se va a esperar 10 frames para arrancar a animar

//* Wait stack de movimientos de la camara
var cameraMovementsStack = []

//* Constantes y variables importantes
// Máximo ancho del mapa
const MAP_WIDE_X = 300
// Cantidad de naves
const SHIPS_IN_ROW = 12, SHIPS_IN_COLS = 5


init();
animate();

async function init(){
    //####################################################################
    //---------------------------INICIALIZACION---------------------------
    //####################################################################
    
    //---------------------INICIALIZAR SCENE---------------------
    scene = new THREE.Scene()
    
    //---------------------INICIALIZAR CAMERA---------------------
	// Creamos la camara con los parametros adecuados
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// Agregamos camara a la escena
	scene.add(camera);

    // Seteo la posición de la camara mirando a la escena
	camera.lookAt(scene.position);	
    // La acomodo de acuerdo a como queremos el juego
	camera.position.set(0,200,70)
	camera.rotation.x -= 4*Math.PI/16
    
    //---------------------INICIALIZAR RENDERER---------------------
    renderer = new THREE.WebGLRenderer({ antialias: true})
    renderer.setClearColor("#222222")
    
    // Modificamos donde y como va a ir el renderer (burocracia)
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
    
    //####################################################################
    //---------------------------INICIALIZACION---------------------------
    //####################################################################
        
    //##################################//
    //------------- LIGHTS -------------//
    //----Creo Luz de Ambiente
    var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.5)
    scene.add( ambientLight )
    
    //----Creo Luz direccional
    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    pointLight.position.set( 25, 50, 25 );
    scene.add( pointLight );
    
    //###################################//
    //------------- TESTING -------------//
    //TODO: Comentar cuando ya no se necesite
    initTesting()
    
    //##################################//
    //------------- SKYBOX -------------//
    var skybox_loader = new THREE.CubeTextureLoader()
    var skybox_dir ='images/stars/'
    var skybox_texture = skybox_loader.load([
        skybox_dir + 'px.png',
        skybox_dir + 'nx.png',
        skybox_dir + 'py.png',
        skybox_dir + 'ny.png',
        skybox_dir + 'pz.png',
        skybox_dir + 'nz.png',
    ])
    scene.background = skybox_texture
    
    //####################################//
    //------------- ENTITIES -------------//
    //----Creo main ship
    createMainShip()
    //----Creo las naves enemigas
    await createEnemies()
    
    // Guardo tambien las naves en formato de matriz (necesario para el movimiento)
    enemySpaceshipsMatrix = listToMatrix(enemySpaceshipsList, SHIPS_IN_ROW)
    // Además necesito la lista de las naves en primera linea (necesario para los disparos)
    enemyFirstLine = [...enemySpaceshipsMatrix[0]]
    
    //----Pinto las naves
    enemyFirstLine.forEach(enemy => {
        enemy.material.color.setHex( 0xFF0000 )
    });
    enemySpaceshipsMatrix[3].forEach(enemy => {
        enemy.material.color.setHex( 0x0000FF )
    });
    enemySpaceshipsMatrix[4].forEach(enemy => {
        enemy.material.color.setHex( 0x0000FF )
    });
    
    //----Creo los shields
    createShield(new THREE.Vector3(0,0,-100))
    createShield(new THREE.Vector3(-180,0,-100))
    createShield(new THREE.Vector3(180,0,-100))
    
}

//Funcion para animar (60 FPS)
function animate() {
    requestAnimationFrame( animate )
	render()
    
    // Fix para no animar por 10 ciclos, mientras se terminan de cargar los modelos
    if (waitToStart != 0) waitToStart -= 1;
    else update();
    // TODO: Mejorar! Porque esta atado con alambres
}

function render() {	renderer.render( scene, camera ) }

function update() {
    
    //########################################//
    //--------------- KEYBOARD ---------------//
    const SPEED = 250
	var moveDistance = SPEED * movementClock.getDelta()
    var moving = false
    
    function pressedLeft() {
        return keyboard.pressed("A") || keyboard.pressed("left")
    }
    function pressedRight() {
        return keyboard.pressed("D") || keyboard.pressed("right")
    }
    
	if ( pressedLeft()  ){
	    mainShip.position.x -= moveDistance
        saveMovementsFromMainship(-moveDistance)
        moving = true
    }
	if ( pressedRight() && !moving  ){
        mainShip.position.x += moveDistance
        saveMovementsFromMainship(+moveDistance)
        moving = true
    }
	if ( keyboard.pressed("W") || keyboard.pressed("up") )      //TODO: Quitar
	    mainShip.position.z -= moveDistance
		
	if ( keyboard.pressed("S") || keyboard.pressed("down") )    //TODO: Quitar
        mainShip.position.z += moveDistance
    
    //---------------Disparar bullets
    if ( keyboard.down("space") ){
        createMainShipBullet()
    }
    
    //#########################################//
    //------------ CAMERA MOVEMENT ------------//
    // cameraMovement(moving)
    
    //########################################//
    //--------- ENEMY SHIPS MOVEMENT ---------//
    // moveEnemies()
    
    
    
    //###########################################//
    //-------- MAINSHIP BULLET BEHAVIOUR --------//
    //--- Movimiento y destruccion de los bullets de la mainShip
    // debugger
    mainShipBulletsBehaviour()
    
    //####$######################################//
    //--------- ENEMY BULLETS BEHAVIOUR ---------//
    //--- Movimiento y destruccion de los bullets enemigos
    enemyBulletsBehaviour()
    
     //########################################//
    //--------- ENEMY SHIPS SHOOTING ---------//       
    enemyShooting()
    
    //##########################################//
    //--------------- COLLISIONS ---------------//
    //--- Collisiones de la main ship
    checkIfCollides(mainShip, mainShipCollisionHandler, enemyBulletsList)

    //--- Chequeo si las bullets de la mainShip colisionan en los enemigos
    enemySpaceshipsList.forEach(enemy => {
        checkIfCollides(enemy, bulletCollisionHandler, mainShipBulletsList)
    });
    
    //--- Chequeo si alguna de las bullets golpea en los shields
    shields.forEach(shield => {
        checkEveryBullet(mainShipBulletsList)
        checkEveryBullet(enemyBulletsList)
        
        function checkEveryBullet(bulletsList) {
            for (let bullet of bulletsList){
                if ( hasCollisionWithShield(bullet) ){
                    shieldCollisionHandler(bullet, bulletsList)
                    break;
                }
            }
            
        }
        function shieldCollisionHandler(bullet, bulletsList) {
            console.log("SHIELD FIRED")
            // Removemos la bullet
            removeEntity(bullet) 
            var index = bulletsList.indexOf(bullet)
            if (index !== -1) { bulletsList.splice(index, 1) }
            
            // Aplicamos efecto sobre shield
            
        }
        
        function hasCollisionWithShield(bullet){
            return Math.abs(bullet.position.z - shield.position.z) <= shield.geometry.parameters.height/2 &&
            Math.abs(bullet.position.x - shield.position.x) <= shield.geometry.parameters.width/2
        }
        
    });
    

    

    
    //#######################################//
    //--------------- UPDATES ---------------//
    //--- Update del Keyboard
    keyboard.update();
    
    //###################################//
    //------------- TESTING -------------//
    //TODO: Comentar cuando ya no se necesite
    animateTesting();
}



//#######################################//
//-------------- UTILITIES --------------//

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;
    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }
        matrix[k].push(list[i]);
    }
    return matrix;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
