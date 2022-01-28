// Variables globales estandares
var container, scene, camera, renderer, controls, stats
var cameraOrtho, sceneOrtho
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

//* Lista de Shields
var shields = []

//* Vida de los shields
var shieldsLife = {}

//* Sprites de Corazones (mostrando la vida de la mainShip)
var hearts = []

//* Vida de la nave
var mainShipLife = 3

//* Wait stack de movimientos de la camara
var cameraMovementsStack = []

//* Flag para terminar el juego
var endOfGame = false

//* Constantes y variables importantes
// Máximo ancho del mapa
const MAP_WIDE_X = 300
// Cantidad de naves
const SHIPS_IN_ROW = 12, SHIPS_IN_COLS = 5
// Velocidad de la mainShip
const MAINSHIP_SPEED = 250

//* Constantes para los shields
const SHIELDS_MAX_LIFE = 100
const SHIELD_LIFE_DECREASE = 10

//*** Ejecución de función principal
main();

// Se realiza de esta manera para que se termine de ejecutar todo el init() antes de que se empieze a animar.
// De lo contrario se van a tener errores en animate(), pues los Mesh no se terminarían de cargar todavía,
// debido a que se deben importar desde un archivo.
async function main(){
    await init()
    animate()
}

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
    
    // Creamos un segundo par de camara y escena para los Sprites que van en la pantalla
    cameraOrtho = new THREE.OrthographicCamera( - SCREEN_WIDTH / 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, - SCREEN_HEIGHT / 2, 1, 10 );
    sceneOrtho = new THREE.Scene();
    cameraOrtho.position.z = 10;
    
    
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
    
    //###################################################//
    //------------- ENTITIES INITIALIZATION -------------//
    //? Estas dos son las únicas funciones que trabajan con el modelo de promesas de async
    // La razón es que si no se terminaran de cargar los modelos, se terminan dando errores de cosas indefinidas
    //----Creo la mainShip
    await createMainShip()
    //----Creo las naves enemigas
    await createEnemies()
    
    // Guardo tambien las naves en formato de matriz (necesario para el movimiento)
    enemySpaceshipsMatrix = listToMatrix(enemySpaceshipsList, SHIPS_IN_ROW)
    // Además necesito la lista de las naves en primera linea (necesario para los disparos)
    enemyFirstLine = [...enemySpaceshipsMatrix[0]]
    
    //----Pinto las naves (solo estetico)
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
    
    //--- Asigno la salud a cada Shield
    shields.forEach(shield => {
        shieldsLife[shield.uuid] = SHIELDS_MAX_LIFE
    })
    
    //--- Creo los corazones (en forma de sprite) para mostrar la vida del jugador en pantalla
    var heartTexture = new THREE.TextureLoader().load( 'images/heart.png' );
    createHeart(heartTexture, SCREEN_WIDTH/2 - 50 , -SCREEN_HEIGHT/2 + 50)
    createHeart(heartTexture, SCREEN_WIDTH/2 - 85 , -SCREEN_HEIGHT/2 + 50)
    createHeart(heartTexture, SCREEN_WIDTH/2 - 120, -SCREEN_HEIGHT/2 + 50)
}

//Funcion para animar (60 FPS)
function animate() {
    requestAnimationFrame( animate )
	render()
    
    // Acá se termino el juego
    if (endOfGame){
        // Esta condición es solo para dejar pasar una ejecución más del render,
        // de lo contrario no se muestra los carteles de finalización (no se porque)
        if (mainShipLife == 0){
            mainShipLife = -1
        } else{
            // Acá se detiene todo el juego, no debería proseguir desde acá
            return
        }
    }
    
    // Esto se va a ejecutar mientras que no termine el juego
    if (!endOfGame) {
        update()
    }    
}

function render() {	
    //let renderer clean next time
    renderer.autoClear = true
    renderer.render( scene, camera )
    //don't let renderer erase canvas
    renderer.autoClear = false
    //clears the depth buffer so the objects in scene2 will always be on top
    renderer.clearDepth()
    renderer.render( sceneOrtho, cameraOrtho )
}

function update() {
    
    //#######################################//
    //---------- MAINSHIP MOVEMENT ----------//
    var isMoving = mainShipMovement()
    
    //#########################################//
    //------------ CAMERA MOVEMENT ------------//
    cameraMovement(isMoving)
    
    //########################################//
    //--------- ENEMY SHIPS MOVEMENT ---------//
    moveEnemies()
    
    
    //###########################################//
    //-------- MAINSHIP BULLET BEHAVIOUR --------//
    //--- Movimiento y destruccion de los bullets de la mainShip
    mainShipBulletsBehaviour()
    
    //####$######################################//
    //--------- ENEMY BULLETS BEHAVIOUR ---------//
    //--- Movimiento y destruccion de los bullets enemigos
    enemyBulletsBehaviour()
    
    
    //########################################//
    //--------- ENEMY SHIPS SHOOTING ---------//       
    enemyShooting()
    
    //#######################################//
    //---------- MAINSHIP SHOOTING ----------// 
    if ( keyboard.down("space") ){
        createMainShipBullet()
    }
    
    
    //##########################################//
    //--------------- COLLISIONS ---------------//
    //--- Collisiones de la main ship
    checkIfCollides(mainShip, mainShipCollisionHandler, enemyBulletsList)

    //--- Chequeo si las bullets de la mainShip colisionan en los enemigos
    enemySpaceshipsList.forEach(enemy => {
        checkIfCollides(enemy, bulletCollisionHandler, mainShipBulletsList)
    });
    
    //--- Chequeo si alguna de las bullets golpea en los shields
    shieldsCollisionDetect() 
    
    
    
    //#######################################//
    //------------ END OF GAME? ------------//
    if (mainShipLife == 0){
        endOfGameAction("Perdiste :(")
    }
    if (enemySpaceshipsList.length == 0){
        endOfGameAction("Ganaste! :D")
    }
    
    function endOfGameAction (text){
        var endText = new SpriteText(text, 45)
        var endText2 = new SpriteText('Presiona F5 para reiniciar', 30);
        endText.position.set(0,50,0)
        sceneOrtho.add(endText);
        sceneOrtho.add(endText2);
        
        endOfGame = true
    }
    
    
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
