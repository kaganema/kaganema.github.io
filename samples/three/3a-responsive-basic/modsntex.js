const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

//renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const box = new THREE.BoxBufferGeometry();
const orbit = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.z = 8.8;
camera.position.y = 16.7;
camera.position.x = 7.5;
//orbit.target.set(7.6,16.7,8.8);
orbit.update();
orbit.autoRotate = true;

let count = 5;

const man = new THREE.LoadingManager();
const tx = new THREE.TextureLoader(man);

// Add a load of different meshes.
let cubes = [];

let colour = 'rgb('+(Math.floor(Math.random() * 255))+','+(Math.floor(Math.random() * 255))+','+(Math.floor(Math.random() * 255))+')';

// Materials to go on each side.
let side = [
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/apple2.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/cherries.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/p3ar.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/orange.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/starwberry.png')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/grapes1.png')})
];

models = (shapes) => {
    let xdist = 2;
    let ydist = 2;
    let zdist = 3;
    let offset = -5;
    for(let i=1; i<=count; i++) {
        for(let j=1; j<=count; j++) {
            for(let s=1; s<=count; s++){
    let cube = new THREE.Mesh(box, side);
    scene.add(cube);
    shapes.push(cube);
            // I want this to go from row by row.
    cube.position.x = (xdist * s) + offset;
                cube.position.z = (zdist * j) + offset;
    cube.position.y = (ydist * i);
        }
        }
    }
}

// Assign random colours (and maybe textures) to a collection of cubes (cubes[]).
// Try creating a function that will create a cube mesh with a location.
// Pass the result to animate().
man.onLoad = models(cubes);


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
        camera.updateProjectionMatrix();
    }
    cubes.forEach((cube) => {
        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;
        cube.rotation.x += 0.2;
        cube.rotation.y += 0.2;
    });
    orbit.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
