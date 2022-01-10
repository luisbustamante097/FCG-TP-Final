// Variables globales estandares
var container, scene, camera, renderer, controls, stats
// Keyboard controller (from KeyboardState.js)
var keyboard = new KeyboardState()

// Clock for smooth movement
var movementClock = new THREE.Clock()


//* Atributos para la camara
const SCREEN_WIDTH  = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 80   // FOV
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1, FAR = 1000   //TODO: Cambiar FAR si es necesario

//* Nave principal y wireframe flotante
var mainShip, wireframeCube

//* Lista de Colliders de main ship
var collidableMeshesList_mainShip =[]

//* Lista de Bullets
var bulletsList = []

//* Lista de naves enemigas
var enemySpaceshipsList = []

//* Flag para evitar que se empieze usar el mainShip antes de que este su modelo cargado
var waitToStart = 10

//* Wait stack de movimientos de la camara
var cameraMovementsStack = []

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
    createEnemies()
    
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

	if ( keyboard.pressed("A") || keyboard.pressed("left") ){
	    mainShip.position.x -= moveDistance
        saveMovementsFromMainship(-moveDistance)
        moving = true
    }
	if ( keyboard.pressed("D") || keyboard.pressed("right") ){
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
    cameraMovement(moving)
    
    //##########################################//
    //------------ BULLET BEHAVIOUR ------------//
    //--- Movimiento y destruccion de los bullets
    const BULLET_SPEED = 3
    if (bulletsList.length !== 0) {
        for (let i = 0; i < bulletsList.length; i++) {
            bullet = bulletsList[i]
            //---Movimiento
            bullet.position.z -= BULLET_SPEED
            //---Destruccion por default
            if ( Math.abs(mainShip.position.z - bullet.position.z) > FAR/2 ) {
                removeEntity(bullet)
                bulletsList.splice(i,1)
                i--
            }
        }
    }
    
    //##########################################//
    //--------------- COLLISIONS ---------------//
    //--- Collisiones de la main ship
    checkIfCollides(mainShip, mainShipCollisionHandler, collidableMeshesList_mainShip)

    //--- Chequeo si las bullets de la mainShip colisionan en los enemigos
    enemySpaceshipsList.forEach(enemy => {
        checkIfCollides(enemy, bulletCollisionHandler, bulletsList)
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

