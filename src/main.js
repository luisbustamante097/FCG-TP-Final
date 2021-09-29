// Variables globales estandares
var container, scene, camera, renderer, controls, stats
// Keyboard controller
// var keyboard = new THREEx.KeyboardState()    //TODO: sacar libreria si no era necesaria
var keyboard = new KeyboardState()
// Clock for tracking time
var clock = new THREE.Clock()

//* Atributos para la camara
const SCREEN_WIDTH  = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 70   // FOV
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1, FAR = 5000   //TODO: Cambiar FAR si es necesario

//* Nave principal y wireframe flotante
var mainShip, wireframeCube

//* Lista de Colliders de main ship
var collidableMeshListOfMainShip =[]

//* Lista de Bullets
var bulletsList = []


init();
animate();

function init(){
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

    // Seteo la posición de la camara
	camera.position.set(0,100,400);
    // Rotates the object to face a point in world space.
	// camera.lookAt(scene.position);	
    
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
    
    //#################################//
    //------------- FLOOR -------------//

	// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
	var floorTexture = new THREE.TextureLoader().load( 'images/checkerboard.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 20, 20 );
	// DoubleSide: render floorTexture on both sides of mesh
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    // Roto el tablero adecuadamente
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
    
    //####################################//
	//------------- CONTROLS -------------//
    //TODO: Sacar cuando ya no se necesite
	controls = new THREE.OrbitControls( camera, renderer.domElement )
    controls.update();
    
    //################################//
    //------------- AXES -------------//
    //TODO: Sacar cuando ya no se necesite
    const axesHelper = new THREE.AxesHelper(100)
    scene.add( axesHelper )
    
    //#################################//
    //------------- STATS -------------//
    //TODO: Sacar cuando ya no se necesite
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
    
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
    //------------- GEOMETRY -------------//
        
    //----Creo main ship
    createMainShip()
    
    //----Creo Wireframe Cube   //TODO: Sacar cuando no se necesite
    var geometry = new THREE.BoxGeometry( 50, 50, 50)
    var material = new THREE.MeshBasicMaterial( { wireframe: true })
    wireframeCube = new THREE.Mesh ( geometry, material )
    wireframeCube.position.set(0,30,0)
    scene.add( wireframeCube )
    
    
    
    //!######################################################################
    //!-----------------------------TESTING----------------------------------
    //!######################################################################
    
    //---------------------Creo dos Muros que collisionan
	
	var wallGeometry = new THREE.BoxGeometry( 100, 100, 20, 1, 1, 1 );
	var wallMaterial = new THREE.MeshStandardMaterial( {color: 0x8888ff} );
	
	var wall = new THREE.Mesh(wallGeometry, wallMaterial);
	wall.position.set(100, 50, -100);
	scene.add(wall);
	collidableMeshListOfMainShip.push(wall);  // <-- Lo agrego a la lista de cosas que colisionan
	
	var wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
	wall2.position.set(-50, 50, 200);
	wall2.rotation.y = 3.14159 / 2;
	scene.add(wall2);
	collidableMeshListOfMainShip.push(wall2); // <-- Lo agrego a la lista de cosas que colisionan

    //!######################################################################
    //!-----------------------------TESTING----------------------------------
    //!######################################################################
}

//Funcion para animar (60 FPS)
function animate() 
{
    requestAnimationFrame( animate )
	render()	
	update()
    
}

function update() {
    
    //##########################################################
    //------------------------ KEYBOARD ------------------------
    //##########################################################
    
    //---------------Movimiento del objeto
    var speed = 150
	var moveDistance = speed * clock.getDelta()

	if ( keyboard.pressed("A") || keyboard.pressed("left") )
	    mainShip.position.x -= moveDistance
		
	if ( keyboard.pressed("D") || keyboard.pressed("right") )
        mainShip.position.x += moveDistance
        
	if ( keyboard.pressed("W") || keyboard.pressed("up") )      //TODO: Quitar
	    mainShip.position.z -= moveDistance
		
	if ( keyboard.pressed("S") || keyboard.pressed("down") )    //TODO: Quitar
        mainShip.position.z += moveDistance
    
    //---------------Disparar bullets
    if ( keyboard.down("space") ){
        bulletsList.push(createMainShipBullet())
    }
        
    //---------------Tests
        
    if ( keyboard.down("R") )
    mainShip.material.color = new THREE.Color(0x0000ff)
        
        
    //##########################################################
    //------------------------ KEYBOARD ------------------------
    //##########################################################
    
    //----BoxText //TODO: sacar cuando terminemos
    clearText()
    
    //##############################################
    //-------Movimiento y destruccion de los bullets
    if (bulletsList.length !== 0) {
        for (let i = 0; i < bulletsList.length; i++) {
            bullet = bulletsList[i]
            //---Movimiento
            bullet.position.z -= 1
            //---Destruccion por default
            if ( Math.abs(mainShip.position.z - bullet.position.z) > FAR/20 ) {
                removeEntity(bullet)
                bulletsList.splice(i,1)
                i--
            }
        }
    }
    
    

    //!######################################################################
    //!-----------------------------TESTING----------------------------------
    //!######################################################################
    
    //------CUBOS QUE GIRAN
    mainShip.rotation.y += 0.02;
    // cube.rotation.x += 0.02;
    wireframeCube.rotation.x -= 0.01;
    wireframeCube.rotation.y -= 0.01;
    
    
    
    
    //CODIGO PARA QUE EL CUBO SEPA QUE HACER AL COLLISIONAR
    function test() {
        appendText(" Hit ");
    }
    checkIfCollides(mainShip, test, collidableMeshListOfMainShip)
    
    
    //!######################################################################
    //!-----------------------------TESTING----------------------------------
    //!######################################################################
    
    
    //----Update del Keyboard
    keyboard.update();
    
    //----Update de los controles Orbit //TODO: sacar cuando terminemos
    controls.update();
    //----Update de los stats //TODO: sacar cuando terminemos
    stats.update();
}

function render() 
{	
	renderer.render( scene, camera );
}

function checkIfCollides(object, test, collidableMeshListOfObject) {
    var originPoint = object.position.clone()
    var position = object.geometry.attributes.position
    var localVertex = new THREE.Vector3()
    
    for (var vertexIndex = 0; vertexIndex < position.count; vertexIndex++)
    {	
        localVertex.fromBufferAttribute( position, vertexIndex )
        var globalVertex = localVertex.applyMatrix4( object.matrix )
        var directionVector = globalVertex.sub( object.position )
        
        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() )
        var collisionResults = ray.intersectObjects( collidableMeshListOfObject )
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            test()
        }
    }	
}



//TODO: Sacar cuando terminemos
function clearText()
{   document.getElementById('message').innerHTML = '..........';   }

function appendText(txt)
{   document.getElementById('message').innerHTML += txt;   }
