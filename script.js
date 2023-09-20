import oc from 'three-orbit-controls'

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
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('./images/sun.jpg');
const mercuryTexture = textureLoader.load('./images/mercury.jpg');

// Initialisation of the scene / camera / renderer
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Allowing to calculate the new orbital position of celestial object.
let tic = 0;

const OrbitControls = oc(THREE);
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Initialisation of your objects / materials / light
let solarSystem = new THREE.Object3D();
scene.add(solarSystem);

let sun = new CelestialObject(
    new THREE.SphereGeometry(1, 128, 128),
    new THREE.MeshBasicMaterial( { map: sunTexture } ),
    {x: 0, y: 0, z: 0, speed: 0, distance:0}
);
solarSystem.add(sun.body);

let mercury = new CelestialObject(
    new THREE.SphereGeometry(0.4, 128, 128),
    new THREE.MeshBasicMaterial( { map: mercuryTexture } ),
    {x: 1, y: 1, z: 1, speed: 0.01, distance: 2},
    sun
);
solarSystem.add(mercury.body);

// This is executed for each frames
function render() {
    requestAnimationFrame( render );

    // Animation code goes here
    mercury.move(tic)
    tic += 1;

    renderer.render( scene, camera );
}
render();