//? En este archivo vamos a poner los metodos de creacion de objetos

const onProgress = ( xhr ) => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
const onError = ( error ) => console.log( 'An error happened' );

async function createMainShip() {
    // Template para carga de OBJ + MTL
    const manager = new THREE.LoadingManager();
    const MTLLoader = new THREE.MTLLoader( manager )
    
    function materialsLoader(materials){
        materials.preload()
        
        const OBJLoader = new THREE.OBJLoader( manager )
        OBJLoader.setMaterials( materials )
        OBJLoader.load( 
            'models/lowpoly_spaceship/mainship.obj',
            ( object ) => {
                object.traverse( ( child ) => { if ( child.isMesh ) mainShip = child } )
                
                // Seteo la posicion de la mainship
                mainShip.scale.set(200,200,200)
                mainShip.position.set(0,10,0)
                mainShip.rotation.y = Math.PI
                
                scene.add( mainShip )
            }
        );
    }
    
    async function geometryAsyncLoader (){
        return new Promise((resolve) => {
            MTLLoader.load(
                'models/lowpoly_spaceship/mainship.mtl',
                ( materials ) => resolve( materialsLoader(materials) ), onProgress, onError);
        });
    }
    
    await geometryAsyncLoader()
    // ---- Idea de la solucion: https://discourse.threejs.org/t/how-to-deal-with-async-loader/15861/5
    // Hago un lio con await/async solo para que en este punto exacto el mainShip este correctamente cargado
    //  si no lo hiciera asi, el enemyGeometry quedaría en undefined, puesto que la carga se tarda un poco
    
}

async function createEnemies() {    
    var initialX = -220, initialY = 10, initialZ = -400
    var xIncr = 0, zIncr = 0
    var xStep = 40, zStep = 40
    var inRow = SHIPS_IN_ROW, inCols = SHIPS_IN_COLS
    
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
    // Hago un lio con await/async solo para que en este punto exacto el enemyGeometry este correctamente cargado
    //  si no lo hiciera asi, el enemyGeometry quedaría en undefined, puesto que la carga se tarda un poco
    return enemyGeometry
}

function removeEntity(mesh) {
    const object = scene.getObjectByProperty( 'uuid', mesh.uuid );
    object.geometry.dispose();
    object.material.dispose();
    scene.remove( object );
}

//#########################################
//---------------- BULLETS ----------------

function createBullet(bulletColor) {
    var geometry = new THREE.BoxGeometry( 5, 5, 5)
    var material = new THREE.MeshStandardMaterial( { color: bulletColor })
    var bullet = new THREE.Mesh ( geometry, material )
    return bullet
}

function createMainShipBullet() {
    var bullet = createBullet(0xFFFFFF)
    // Guardo la posición de la nave, y se la seteo al bullet
    var originPoint = mainShip.position.clone()
    bullet.position.copy(originPoint)
    scene.add( bullet )
    // Lo agrego a la lista de cosas que colisionan de los enemies
    mainShipBulletsList.push(bullet)
}

function createEnemyBullet(enemy) {
    var bullet = createBullet(0xFF2222)
    // Guardo la posición de la nave, y se la seteo al bullet
    var originPoint = enemy.position.clone()
    bullet.position.copy(originPoint)
    bullet.position.y -= 5  // La bajo para que pegue con las alas de la mainShip
    scene.add( bullet )
    // Lo agrego a la lista de cosas que colisionan de los enemies
    enemyBulletsList.push(bullet)
}

//#########################################
//---------------- SHIELDS ----------------
function createShield(position) {
    var geometry = new THREE.BoxGeometry( 70, 30, 30)
    var material = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, transparent: true })
    var shield = new THREE.Mesh ( geometry, material )
    
    shield.position.copy(position)
    scene.add(shield)
    shields.push(shield)
}

//########################################
//---------------- HEARTS ----------------
function createHeart(heartTexture, x, y){
    var heartMaterial = new THREE.SpriteMaterial( { map: heartTexture});
    var sprite = new THREE.Sprite( heartMaterial );
    sprite.position.set( x, y, 0 );
    sprite.scale.set( 30, 30, 1 ); // imageWidth, imageHeight
    sceneOrtho.add( sprite );
    hearts.push(sprite)
}