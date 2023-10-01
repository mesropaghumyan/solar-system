// Imports
import oc from 'three-orbit-controls';

// Textures
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
const saturnRingTexture = basicTextureLoader.load('./images/saturn_ring.png');
const uranusRingTexture = basicTextureLoader.load('./images/uranus_ring.png');

class CelestialObject extends THREE.Object3D {
    material;
    geometry;
    body;
    orbitalPara;
    orbitalCenter;

    constructor( geometry, material, orbitalPara, orbitalCenter = null ){
        super();

        this.geometry = geometry;
        this.material = material;
        this.body = new THREE.Mesh(this.geometry, this.material);
        this.body.scale.set(1,1,1);
        this.orbitalPara = orbitalPara;
        this.orbitalCenter = orbitalCenter;
        this.add(this.body);
    }

    // Polar coordinates
    move(tic) {
        this.body.position.x = (
            this.orbitalCenter.body.position.x +
            Math.cos(tic * this.orbitalPara.speed) *
            this.orbitalPara.distance + this.orbitalPara.eli
        );

        this.body.position.y = (
            this.orbitalCenter.body.position.y +
            Math.sin(tic * this.orbitalPara.speed) *
            this.orbitalPara.distance - this.orbitalPara.eli
        );
    }
}

function initRenderer() {

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    return renderer;
}

function initScene() {
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
    pointLight.castShadow = true;
    scene.add(pointLight);

    return scene;
}

function initCamera() {
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    return camera;
}

function initOrbitalControl(camera, renderer) {
    const OrbitControls = oc(THREE);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    return orbit;
}

function createPlanet(solarSystem, size, texture, orbitalPara, ringTexture, orbitalCenter) {
    let planet = new CelestialObject(
        new THREE.SphereGeometry(size, 128, 128),
        new THREE.MeshStandardMaterial( { map: texture } ),
        {
            eli: orbitalPara.eli,
            speed: orbitalPara.speed,
            distance: orbitalPara.distance
        },
        orbitalCenter
    );

    if(ringTexture) {
        const ringInnerRadius = 0.9;
        const ringOuterRadius = 1.5;
        const ringThetaSegments = 50;
        const RingGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringThetaSegments);
        const RingMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide });
        const RingMesh = new THREE.Mesh(RingGeometry, RingMaterial);
        RingMesh.rotation.x = Math.PI / 2;
        planet.body.add(RingMesh);
    }

    planet.body.castShadow = true;
    planet.body.receiveShadow = true;

    solarSystem.add(planet);

    return planet;
}

// Initialisation of the scene / camera / renderer
const renderer = initRenderer();
const scene = initScene();
const camera = initCamera();
const orbit = initOrbitalControl(camera, renderer);

// Allowing to calculate the new orbital position of celestial object.
let tic = 0;

// Initialisation objects / materials / light
let solarSystem = new THREE.Object3D();
scene.add(solarSystem);

let sun = new CelestialObject(
    new THREE.SphereGeometry(1.5, 128, 128),
    new THREE.MeshBasicMaterial( { map: sunTexture } ),
    {x: 0, y: 0, z: 0, speed: 0, distance:0}
);
solarSystem.add(sun.body);

let mercury = createPlanet(solarSystem, 0.2, mercuryTexture, { eli: 0.205, speed: 0.04, distance: 3}, null, sun);
let venus = createPlanet(solarSystem, 0.4, venusTexture, { eli: 0.006,speed: -0.015, distance: 6}, null, sun);
let earth = createPlanet(solarSystem, 0.5, earthTexture, {eli: 0.016,speed: 0.01, distance: 9}, null, sun);
let moon = createPlanet(solarSystem, 0.1, moonTexture, { eli: 0.0549,speed: 0.05, distance: 1}, null, earth);
let mars = createPlanet(solarSystem, 0.3, marsTexture,  {eli: 0.093,speed: 0.008, distance: 12}, null, sun);
let jupiter = createPlanet(solarSystem, 0.9, jupiterTexture, { eli: 0.048,speed: 0.002, distance: 15}, null, sun);
let saturn = createPlanet(solarSystem, 0.8, saturnTexture, { eli: 0.054,speed: 0.0009, distance: 18}, saturnRingTexture, sun);
let uranus = createPlanet(solarSystem, 0.7, uranusTexture, { eli: 0.047,speed: -0.0004, distance: 21}, uranusRingTexture, sun);
let neptune = createPlanet(solarSystem, 0.3, neptuneTexture, { eli: 0.008,speed: 0.0001, distance: 24}, null, sun);
let pluto = createPlanet(solarSystem, 0.1, plutoTexture, { eli: 0.002,speed: 0.00007, distance: 27}, null, sun);

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
    moon.move(tic)
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

    const planetes = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];
    planetes.forEach(planete1 => {
        planetes.forEach(planete2 => {
            if (planete1 !== planete2) {
                const distance = planete1.body.position.distanceTo(planete2.body.position);

                if (distance < planete1.rayon + planete2.rayon) {
                    planete2.body.material.color.set(0x555555);
                } else {
                    planete2.body.material.color.set(0xFFFFFF);
                }
            }
        });
    });

    renderer.render(scene, camera);
}
render();