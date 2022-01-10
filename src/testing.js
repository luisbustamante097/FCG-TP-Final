function initTesting (){
    //#################################//
    //------------- GRID -------------//
    var gridHelper = new THREE.GridHelper( 1000, 20 ); // Cells of 50px
    scene.add( gridHelper );
    const MAP_WIDE = 400
    // Grids laterales:
    var grid1 = new THREE.GridHelper( 1000, 20 )
    grid1.position.set(-MAP_WIDE,500,0)
    grid1.rotation.z = Math.PI/2
    scene.add( grid1 )
    var grid2 = new THREE.GridHelper( 1000, 20 )
    grid2.position.set(MAP_WIDE,500,0)
    grid2.rotation.z = Math.PI/2
    scene.add( grid2 )

    //####################################//
    //------------- CONTROLS -------------//
    // controls = new THREE.OrbitControls( camera, renderer.domElement )
    // controls.update();

    //################################//
    //------------- AXES -------------//
    const axesHelper = new THREE.AxesHelper(100)
    scene.add( axesHelper )

    //#################################//
    //------------- STATS -------------//
    // displays current and past frames per second attained by scene
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );
    
    //####################################//
    //------------- ENTITIES -------------//
    //--- Wireframe Cube (lo usabamos para chequear que el juego estaba ejecutandose correctamente)
    var geometry = new THREE.BoxGeometry( 50, 50, 50)
    var material = new THREE.MeshBasicMaterial( { wireframe: true })
    wireframeCube = new THREE.Mesh ( geometry, material )
    wireframeCube.position.set(0,30,-500)
    scene.add( wireframeCube )
    
    //--- Muro Collisionable
	var wallGeometry = new THREE.BoxGeometry( 100, 100, 20, 1, 1, 1 );
	var wallMaterial = new THREE.MeshBasicMaterial( { wireframe: true })
	
	var wall = new THREE.Mesh(wallGeometry, wallMaterial);
	wall.position.set(-200, 50, 0);
	wall.rotation.y = 3.14159 / 2;
	scene.add(wall);
	collidableMeshesList_mainShip.push(wall); // <-- Lo agrego a la lista de cosas que colisionan
}

function animateTesting() {
    //--- WIREFRAME QUE GIRA
    wireframeCube.rotation.x -= 0.01;
    wireframeCube.rotation.y -= 0.01;

    //----Update de los controles Orbit //TODO: sacar cuando terminemos
    // controls.update();
    //----Update de los stats //TODO: sacar cuando terminemos
    stats.update();
}


//TODO: Sacar cuando terminemos
//!--------------------------------------------------------------------------
//!---------------------------CODIGO AUXILIAR--------------------------------
//!--------------------------------------------------------------------------

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
