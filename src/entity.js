//? Aca vamos a poner los metodos de creacion de objetos

// Este codigo es para crear una caja normal como mainship
/* function createMainShip() {
    // Geometry: Box
    var geometry = new THREE.BoxGeometry( 20, 20, 20)
    // Material: Standard
    var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
    // Mesh: geometry + material
    mainShip = new THREE.Mesh ( geometry, material )
    mainShip.position.set(0,10,250)
    // Lo agrego a la escena
    scene.add( mainShip )
} */ 

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

function createEnemies(position) {
    var geometry = new THREE.BoxGeometry( 20, 5, 10)
    var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
    enemy = new THREE.Mesh ( geometry, material )
    enemy.position.clone(position)
    scene.add( enemy )
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