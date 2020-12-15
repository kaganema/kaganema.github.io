var renderer = new THREE.WebGLRenderer();
//renderer.domElement.width = 500;
//renderer.domElement.height = 500;

var camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

//renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setSize(renderer.domElement.width, renderer.domElement.height);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var box = new THREE.BoxBufferGeometry(2, 2, 2);

camera.position.z = 5;

var man = new THREE.LoadingManager();
var tx = new THREE.TextureLoader(man);
var colour = 0xffffff;

var item = [];

var side = [
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/apple2.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/cherries.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/p3ar.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/orange.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/starwberry.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/grapes1.png')})
];

man.onLoad = () => {
    let cube = new THREE.Mesh(box, side);
    scene.add(cube);
    item.push(cube);
    
};
//man.onLoad = function() {
//    'use strict';
//    let cube = new THREE.Mesh(box, side);
//    scene.add(cube);
//    item.push(cube);
//};

function resize(ren) {
    const cren = ren.domElement;
    const pixelRatio = window.devicePixelRatio;
    const resize = cren.width !== cren.clientWidth || cren.height !== cren.clientHeight;
    if(resize){
        ren.setSize(cren.clientWidth, cren.clientHeight, false);
        //ren.setPixelRatio(window.devicePixelRatio);
    }
    return resize;
}

function animate() {
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        //camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
        camera.updateProjectionMatrix();
    }
    item.forEach(function(cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
