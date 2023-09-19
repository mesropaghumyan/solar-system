// Initialisation of the scene / camera / renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );
camera.position.z = 5;

// Initialisation of your objects / materials / light
var solarSystem = new THREE.Object3D();
scene.add(solarSystem);
var ball = new THREE.SphereGeometry(1, 32, 32);
var sunMaterial = new THREE.MeshBasicMaterial( { color: 0xff4500 } );
var sun = new THREE.Mesh(ball, sunMaterial);
sun.scale.set(0.4, 0.4, 0.4);
solarSystem.add(sun);

// This is executed for each frames
function render() {
    requestAnimationFrame( render );
    // Animation code goes here
    sun.position.x += 0.001;
    renderer.render( scene, camera );
}
render();