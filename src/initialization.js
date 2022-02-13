//##################################//
//------------- LIGHTS -------------//
function enableLights(){
    //----Creo Luz de Ambiente
    var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.5)
    scene.add( ambientLight )
    
    //----Creo 3 Point lights para cada uno de los escudos
    var pointLight = new THREE.PointLight( 0xFFFFFF, 0.75 );
    pointLight.position.set( 0, 30, 0 );
    scene.add( pointLight );
    pointLight = new THREE.PointLight( 0xFFFFFF, 0.75 );
    pointLight.position.set( -SHIELD_POSITION_X, 30, 0 );
    scene.add( pointLight );
    pointLight = new THREE.PointLight( 0xFFFFFF, 0.75 );
    pointLight.position.set( SHIELD_POSITION_X, 30, 0 );
    scene.add( pointLight );
    
    //----Creo 1 Point light para iluminar las naves enemigas
    var pointLight = new THREE.PointLight( 0xFFFFFF, 1 );
    pointLight.position.set( 0,30,-400 );
    scene.add( pointLight );
}

//#################################//
//------------- STATS -------------//
function enableStats() {
    stats = new Stats()
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.bottom = '0px'
    stats.domElement.style.zIndex = 100
    document.body.appendChild(stats.domElement)
}

//#############################//
//----------- GRIDS -----------//
function enableGrids() {
    var grid1 = new THREE.GridHelper(1000, 50)
    grid1.position.set(-MAP_WIDE_X, 500, -250)
    grid1.rotation.z = Math.PI / 2
    scene.add(grid1)
    var grid2 = new THREE.GridHelper(1000, 50)
    grid2.position.set(MAP_WIDE_X, 500, -250)
    grid2.rotation.z = Math.PI / 2
    scene.add(grid2)
}

//##################################//
//------------- SKYBOX -------------//
function enableSkybox() {
    var skybox_loader = new THREE.CubeTextureLoader()
    var skybox_dir = 'images/stars/'
    var skybox_texture = skybox_loader.load([
        skybox_dir + 'px.png',
        skybox_dir + 'nx.png',
        skybox_dir + 'py.png',
        skybox_dir + 'ny.png',
        skybox_dir + 'pz.png',
        skybox_dir + 'nz.png',
    ])
    scene.background = skybox_texture
}

//##################################//
//----------- LEVEL BASE -----------//
function createLevelBase() {
    var geometry = new THREE.BoxGeometry( MAP_WIDE_X*2, 20, 850)
    var material = new THREE.MeshStandardMaterial( { color: 0x555555, transparent: true })
    var levelBase = new THREE.Mesh ( geometry, material )

    levelBase.position.set(0,-10,-400)
    levelBase.material.opacity = 0.2
    scene.add(levelBase)
}

//#################################//
//----------- PARTICLES -----------//
function createBackgroundParticles(){
    const PARTICLES_QUANTITY = 2500
    var vertices = []
    for ( let i = 0; i < PARTICLES_QUANTITY; i++ ) {
        const x = THREE.MathUtils.randFloatSpread( FAR*3 );
        const y = THREE.MathUtils.randFloat( -100, -FAR );
        const z = THREE.MathUtils.randFloat( 200, -FAR*1.5 );
        vertices.push( x, y, z );
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    var material = new THREE.PointsMaterial( { size: 5, color: 0xBBBBBB } );
    var particles = new THREE.Points( geometry, material );
    scene.add( particles );
}