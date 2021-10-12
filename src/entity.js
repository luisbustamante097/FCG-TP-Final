//? Aca vamos a poner los metodos de creacion de objetos

function createMainShip() {
    //-------TEMPLATE COPIADO DE LA PAGINA DE THREE.JS   
    // Instantiate a loader
    const loader = new THREE.GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        'models/lowpoly_spaceship/scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {
            // Busco el mesh del gltf
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) mainShip = child;
            })
            
            // Inicializo tamaño y posicion
            mainShip.position.set(0,10,0)
            mainShip.scale.set(3,3,3)
            mainShip.rotation.y = Math.PI;
            
            scene.add( mainShip );
        }, onProgress, onError
    );
}

function createMainShipBullet() {
    var geometry = new THREE.BoxGeometry( 5, 5, 5)
    var material = new THREE.MeshStandardMaterial( { color: 0xffffff })
    var bullet = new THREE.Mesh ( geometry, material )
    // Guardo la posición de la nave, y se la seteo al bullet
    var originPoint = mainShip.position.clone()
    bullet.position.copy(originPoint)
    scene.add( bullet )
    // Lo agrego a la lista de cosas que colisionan de los enemies
    bulletsList.push(bullet)
    return bullet
}

async function createEnemies() {    
    var initialX = -200, initialY = 10, initialZ = -400
    var xIncr = 0, zIncr = 0
    var xStep = 40, zStep = 40
    var inRow = 12, inCols = 5
    
    // Creo el material que van a usar todos los enemies de color verde
    var enemyMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 })
    
    // Cargo el .obj de las naves asincronicamente (es decir esperando a que termine)
    var enemyGeometry = await loadEnemyGeometry()
    // Con esto me aseguro que la variable enemy va a tener al mesh correcto en este punto
    
    //--- Loops para crear los enemigos como una matriz
    for (let i = 0; i < inCols; i++) {
        createEnemiesInRow(enemyGeometry)
        zIncr += xStep
        xIncr = 0
    }
    
    function createEnemiesInRow() {
        for (let i = 0; i < inRow; i++) {
            createAnEnemy()
            xIncr += zStep   
        }
    }
    
    function createAnEnemy() {
        var size = 100
        // Creo un nuevo enemigo con la geometry cargada, y clonando el material
        clonedEnemy = new THREE.Mesh ( enemyGeometry, enemyMaterial.clone() )
        // Ajusto tamaño y posicion
        clonedEnemy.scale.set(size,size,size)
        clonedEnemy.position.copy(new THREE.Vector3(initialX + xIncr, initialY, initialZ + zIncr))
        // Lo agrego a la lista de enemigos
        enemySpaceshipsList.push(clonedEnemy)
        
        scene.add( clonedEnemy )
    }
    console.log(enemySpaceshipsList)
}

async function loadEnemyGeometry() {
    var enemyGeometry
    const loader = new THREE.OBJLoader();
    
    // Funcion normal para buscar el mesh del object cargado (solo me quedo con el geometry)
    function geometryLoader(object) {
        object.traverse( 
            ( child ) => { if ( child.isMesh ) enemyGeometry = child.geometry; }
        )
    }
    // Funcion para la carga de un .obj, mezclado con la sintaxis de un llamado asincronico (promise/resolve)
    async function geometryAsyncLoader (){
        return new Promise((resolve) => {
            loader.load(
                'models/enemy_spaceship/spaceship.obj',
                ( object ) => resolve( geometryLoader(object) ),
                onProgress, onError
            );
        });
    }
    
    await geometryAsyncLoader();
    // ---- Idea de la solucion: https://discourse.threejs.org/t/how-to-deal-with-async-loader/15861/5
    // Hago un lio solo para que en este punto exacto el enemyGeometry este correctamente cargado
    //  si no lo hiciera asi, el enemyGeometry quedaría en undefined, puesto que la carga se tarda un poco
    return enemyGeometry
}

function removeEntity(mesh) {
    const object = scene.getObjectByProperty( 'uuid', mesh.uuid );
    object.geometry.dispose();
    object.material.dispose();
    scene.remove( object );
}

const onProgress = function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}
const onError = function ( error ) {
    console.log( 'An error happened' );
}

function createTestingFloor() {
    // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
    var floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg')
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
    floorTexture.repeat.set(20, 20)
    // DoubleSide: render floorTexture on both sides of mesh
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide })
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1)
    var floor = new THREE.Mesh(floorGeometry, floorMaterial)

    // Roto el tablero adecuadamente
    floor.rotation.x = Math.PI / 2
    scene.add(floor)
}




//TODO: Sacar cuando terminemos
//!--------------------------------------------------------------------------
//!---------------------------CODIGO AUXILIAR--------------------------------
//!--------------------------------------------------------------------------

function createWithMTLAndOBJ() {
    const manager = new THREE.LoadingManager();
    new THREE.MTLLoader( manager )
        .setPath( 'models/example/' )
        .load( 'Handgun_obj.mtl', function ( materials ) {
            materials.preload();
            console.log(materials)
            new THREE.OBJLoader( manager )
                .setMaterials( materials )
                .setPath( 'models/example/' )
                .load( 'Handgun_obj.obj',
                    function ( object ) {
                        // // El children[0] del object es el mesh que necesitamos
                        // mainShip = object.children[0]
                        object.scale.set(20,20,20)
                        
                        scene.add( object );
                    }, onProgress, onError  
                );
        }, onProgress, onError);

}

// Este codigo es para crear una caja normal como mainship
function createBox() {
    // Geometry: Box
    var geometry = new THREE.BoxGeometry( 20, 20, 20)
    // Material: Standard
    var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
    // Mesh: geometry + material
    mainShip = new THREE.Mesh ( geometry, material )
    mainShip.position.set(0,10,250)
    // Lo agrego a la escena
    scene.add( mainShip )
} 

//!--------------------------------------------------------------------------
//!---------------------------CODIGO AUXILIAR--------------------------------
//!--------------------------------------------------------------------------
