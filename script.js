import oc from 'three-orbit-controls';

class CelestialObject{
    material;
    geometry;
    body;
    orbitalPara;
    orbitalCenter;

    constructor( geometry, material, orbitalPara, orbitalCenter = null ){
        this.geometry = geometry;
        this.material = material;
        this.body = new THREE.Mesh(this.geometry, this.material);
        this.body.scale.set(1,1,1);
        this.orbitalPara = orbitalPara;
        this.orbitalCenter = orbitalCenter;
    }

    // Polar coordinates
    move(tic) {
        this.body.position.x = (
            this.orbitalCenter.body.position.x +
            Math.cos(tic * this.orbitalPara.speed) *
            this.orbitalPara.distance
        );

        this.body.position.y = (
            this.orbitalCenter.body.position.y +
            Math.sin(tic * this.orbitalPara.speed) *
            this.orbitalPara.distance
        );
    }
}

class orbitalPara{
    x;
    y;
    z;
    speed;
    distance;

    constructor(x, y, z, speed, distance ){
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.distance = distance;
    }
}

function initRenderer() {
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    return renderer;
}

// Texture management
const cubeTextureLoader = new THREE.CubeTextureLoader();
const basicTextureLoader = new THREE.TextureLoader();
const sunTexture = basicTextureLoader.load('./images/sun.jpeg');
const mercuryTexture = basicTextureLoader.load('./images/mercury.jpg');
const venusTexture = basicTextureLoader.load('./images/venus.jpg');
const earthTexture = basicTextureLoader.load('./images/earth.jpg');
const marsTexture = basicTextureLoader.load('./images/mars.jpg');
const jupiterTexture = basicTextureLoader.load('./images/jupiter.jpg');
const saturnTexture = basicTextureLoader.load('./images/saturn.jpg');
const uranusTexture = basicTextureLoader.load('./images/uranus.jpg');
const neptuneTexture = basicTextureLoader.load('./images/neptune.jpg');
const plutoTexture = basicTextureLoader.load('./images/pluto.jpg');
const moonTexture = basicTextureLoader.load('./images/moon.jpeg');

// Initialisation of the scene / camera / renderer
const renderer = initRenderer();
const ambiantLight = new THREE.AmbientLight(0x333333);
const scene = new THREE.Scene();
scene.background = cubeTextureLoader.load([
    './images/stars.jpg',
    './images/stars.jpg',
    './images/stars.jpg',
    './images/stars.jpg',
    './images/stars.jpg',
    './images/stars.jpg'
]);
scene.add(ambiantLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Orbit controller
const OrbitControls = oc(THREE);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Allowing to calculate the new orbital position of celestial object.
let tic = 0;

// Initialisation of your objects / materials / light
let solarSystem = new THREE.Object3D();
scene.add(solarSystem);

let sun = new CelestialObject(
    new THREE.SphereGeometry(1.5, 128, 128),
    new THREE.MeshBasicMaterial( { map: sunTexture } ),
    {x: 0, y: 0, z: 0, speed: 0, distance:0}
);
solarSystem.add(sun.body);

let mercury = new CelestialObject(
    new THREE.SphereGeometry(0.2, 128, 128),
    new THREE.MeshStandardMaterial( { map: mercuryTexture } ),
    {x: 1, y: 1, z: 1, speed: 0.04, distance: 3},
    sun
);
solarSystem.add(mercury.body);

let venus = new CelestialObject(
    new THREE.SphereGeometry(0.4, 128, 128),
    new THREE.MeshStandardMaterial( { map: venusTexture } ),
    {x: 2, y: 2, z: 2, speed: 0.015, distance: 6},
    sun
);
solarSystem.add(venus.body);

let earth = new CelestialObject(
    new THREE.SphereGeometry(0.5, 128, 128),
    new THREE.MeshStandardMaterial( { map: earthTexture } ),
    {x: 3, y: 3, z: 3, speed: 0.01, distance: 9},
    sun
);
solarSystem.add(earth.body);



let mars = new CelestialObject(
    new THREE.SphereGeometry(0.3, 128, 128),
    new THREE.MeshStandardMaterial( { map: marsTexture } ),
    {x: 4, y: 4, z: 4, speed: 0.008, distance: 12},
    sun
);
solarSystem.add(mars.body);

let jupiter = new CelestialObject(
    new THREE.SphereGeometry(0.9, 128, 128),
    new THREE.MeshStandardMaterial( { map: jupiterTexture } ),
    {x: 5, y: 5, z: 5, speed: 0.002, distance: 15},
    sun
);
solarSystem.add(jupiter.body);

let saturn = new CelestialObject(
    new THREE.SphereGeometry(0.8, 128, 128),
    new THREE.MeshStandardMaterial( { map: saturnTexture } ),
    {x: 6, y: 6, z: 6, speed: 0.0009, distance: 18},
    sun
);
solarSystem.add(saturn.body);

let uranus = new CelestialObject(
    new THREE.SphereGeometry(0.7, 128, 128),
    new THREE.MeshStandardMaterial( { map: uranusTexture } ),
    {x: 7, y: 7, z: 7, speed: 0.0004, distance: 21},
    sun
);
solarSystem.add(uranus.body);

let neptune = new CelestialObject(
    new THREE.SphereGeometry(0.7, 128, 128),
    new THREE.MeshStandardMaterial( { map: neptuneTexture } ),
    {x: 8, y: 8, z: 8, speed: 0.0001, distance: 24},
    sun
);
solarSystem.add(neptune.body);

let pluto = new CelestialObject(
    new THREE.SphereGeometry(0.7, 128, 128),
    new THREE.MeshStandardMaterial( { map: plutoTexture } ),
    {x: 9, y: 9, z: 9, speed: 0.00007, distance: 27},
    sun
);
solarSystem.add(pluto.body);

// This is executed for each frames
function render() {
    requestAnimationFrame( render );

    // Animation code goes here
    mercury.move(tic)
    venus.move(tic)
    earth.move(tic)
    mars.move(tic)
    jupiter.move(tic)
    saturn.move(tic)
    uranus.move(tic)
    neptune.move(tic)
    pluto.move(tic)
    tic += 1;

    //Self-rotation
    sun.body.rotateY(0.004);
    mercury.body.rotateY(0.004);
    venus.body.rotateY(0.002);
    earth.body.rotateY(0.02);
    mars.body.rotateY(0.018);
    jupiter.body.rotateY(0.04);
    saturn.body.rotateY(0.038);
    uranus.body.rotateY(0.03);
    neptune.body.rotateY(0.032);
    pluto.body.rotateY(0.008);

    //Around-sun-rotation
    mercury.body.rotateY(0.04);
    venus.body.rotateY(0.015);
    earth.body.rotateY(0.01);
    mars.body.rotateY(0.008);
    jupiter.body.rotateY(0.002);
    saturn.body.rotateY(0.0009);
    uranus.body.rotateY(0.0004);
    neptune.body.rotateY(0.0001);
    pluto.body.rotateY(0.00007);

    renderer.render( scene, camera );
}
render();