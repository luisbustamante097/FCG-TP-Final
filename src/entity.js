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
            mainShip.position.set(0,10,250)
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
    return bullet
}

function createEnemies() {    
    var initialX = -30, initialY = 10, initialZ = 0
    var xIncr = 0, zIncr = 0
    var inRow = 5, inCols = 5
    
    for (let i = 0; i < inCols; i++) {
        createEnemiesInRow()
        zIncr += 40
        xIncr = 0
    }
    
    function createEnemiesInRow() {
        for (let i = 0; i < inRow; i++) {
            var enemy = createAnEnemy(new THREE.Vector3(initialX + xIncr, initialY, initialZ + zIncr))
            enemySpaceshipsList.push(enemy)
            xIncr += 40   
        }
    }
}

function createAnEnemy(position) {
    var enemy
    var size = 100
    const loader = new THREE.OBJLoader()
    
    loader.load(
        'models/enemy_spaceship/spaceship.obj',
        function ( object ) {
            // El children[0] del object es el mesh que necesitamos
            var enemyMesh = object.children[0]
            enemyGeometry = enemyMesh.geometry
            var enemyMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 })
            enemy = new THREE.Mesh ( enemyGeometry, enemyMaterial )
            
            // Inicializo tamaño y posicion
            enemy.position.copy(position)
            enemy.scale.set(size,size,size)
            
            scene.add( enemy )
        }, onProgress, onError
    );
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
