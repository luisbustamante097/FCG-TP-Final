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
    
    var enemyMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 })
    
    var enemy = await createAnEnemy( enemyMaterial )
    
    for (let i = 0; i < inCols; i++) {
        createEnemiesInRow(enemy)
        zIncr += xStep
        xIncr = 0
    }
    
    function createEnemiesInRow(enemy) {
        for (let i = 0; i < inRow; i++) {
            // console.log(enemy)
            clonedEnemy = new THREE.Mesh ( enemy.geometry, enemyMaterial.clone() )
            clonedEnemy.position.copy(new THREE.Vector3(initialX + xIncr, initialY, initialZ + zIncr))
            clonedEnemy.scale.set(100,100,100)
            enemySpaceshipsList.push(clonedEnemy)
            scene.add( clonedEnemy )
            // createAnEnemy(new THREE.Vector3(initialX + xIncr, initialY, initialZ + zIncr), enemyMaterial)
            xIncr += zStep   
        }
    }
    console.log(enemySpaceshipsList)
}

async function createAnEnemy(enemyMaterial) {
    var enemy
    var size = 100
    const loader = new THREE.OBJLoader()
    function load(object) {
        // El children[0] del object es el mesh que necesitamos
        var enemyMesh = object.children[0]
        enemyGeometry = enemyMesh.geometry
        
        enemy = new THREE.Mesh ( enemyGeometry, enemyMaterial )
        
        // Inicializo tamaño y posicion
        // enemy.position.copy(position)
        // enemy.scale.set(size,size,size)
        
        // Lo agrego a la lista de enemigos
        // enemySpaceshipsList.push(enemy)
        
        // scene.add( enemy )
    }
    
    
    async function fun (){ 
        return new Promise((resolve) => {
        loader.load(
            'models/enemy_spaceship/spaceship.obj',
            ( object ) => resolve(load(object)), onProgress, onError
        );
        });
    }
    await fun();
    console.log(enemy.geometry)
    return enemy
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
