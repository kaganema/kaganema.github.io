const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setSize(window.innerWidth, window.innerHeight);
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
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Seamless marble texture (15).jpg'), color: colour}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Sky_Clouds_Photo_Texture_A_P4120953.jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable marble floor tile texture (22).jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable marble floor tile texture green.jpg'), color: colour}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Tileable classic water texture.jpg')}),
    new THREE.MeshBasicMaterial({map: tx.load('surfaces/Sky_Clouds_Photo_Texture_A_P4201523.jpg'), color: colour})
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

/*man.onLoad = () => {
    let cube = new THREE.Mesh(box, side);
    scene.add(cube);
    item.push(cube);
}*/

function animate() {
    cubes.forEach((cube) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });
    orbit.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
