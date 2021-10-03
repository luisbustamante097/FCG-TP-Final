//? Aca vamos a poner los metodos de creacion de objetos

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
} // CREAR SOLO CAJA*/ 

function createMainShip() {
    //-------CODIGO COPIADO DE LA PAGINA OFICIAL DE THREE.JS    
    // instantiate a loader
    const loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
        // resource URL
        'models/Feisar_Ship.obj',
        // called when resource is loaded
        function ( object ) {
            // El children[0] del object es el mesh que necesitamos
            mainShip = object.children[0]
            
            // Inicializo tamaño y posicion
            mainShip.position.set(0,10,250)
            mainShip.scale.set(0.2,0.2,0.2)
            
            scene.add( mainShip );
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
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