var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var box = new THREE.BoxBufferGeometry();

camera.position.z = 5;

var man = new THREE.LoadingManager();
var tx = new THREE.TextureLoader(man);

var item = [];

var side = [
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Seamless marble texture (15).jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Sky_Clouds_Photo_Texture_A_P4120953.jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable marble floor tile texture (22).jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable marble floor tile texture green.jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable classic water texture.jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Sky_Clouds_Photo_Texture_A_P4201523.jpg')})
];

man.onLoad = () => {
    let cube = new THREE.Mesh(box, side);
    scene.add(cube);
    item.push(cube);
}

function animate() {
    item.forEach(function(cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
