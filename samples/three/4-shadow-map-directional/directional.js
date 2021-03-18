const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75,  renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

const scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

scene.background = new THREE.Color('skyblue');

const grab = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

const man = new THREE.LoadingManager();
const tx = new THREE.TextureLoader(man);

const surface = new THREE.PlaneGeometry(20, 20); 
//const grass = new THREE.MeshBasicMaterial({color: 0xffffff});

// Set the lights for the scene
const caster = new THREE.DirectionalLight(0xffffff, 1);
caster.castShadow = true;

const box = new THREE.BoxBufferGeometry();
const sphere = new THREE.SphereBufferGeometry(1, 15, 11);
let mat = new THREE.MeshPhongMaterial({map: tx.load('sources/Seamless marble texture (15).jpg')});
const rock = new THREE.Mesh(box, mat);
const bould = new THREE.Mesh(sphere, mat);

tx.load('sources/(GRASS 4) seamless turf lawn green ground field texture.jpg', (tex) => {
    //const grass = new THREE.MeshMatcapMaterial({map: tex});
    const grass = new THREE.MeshStandardMaterial({map: tex});
    //const grass = new THREE.MeshStandardMaterial({map: tex, refractionScale: 0.03});
    const surface = new THREE.PlaneGeometry(20, 20); 
    const ground = new THREE.Mesh(surface, grass);

    ground.rotateX(-(Math.PI / 2));
    //We don't want to cast shadows underneath the base
    ground.receiveShadow = true;
    scene.add(ground);
})

grab.update();


function spawn(geo) {
    
    if(geo.geometry === sphere)
    geo.position.y = 1;
    else if(geo.geometry === box){
        geo.position.y = 0.5;
        //geo.position.x = Math.abs(Math.random() * 10);
        //geo.position.z = Math.abs(Math.random() * 10);
        geo.position.x = 3 + 1; // Add offset by 3 steps.
    }
    // Since the objects are going to be generating shadows and also apply them from casting by the light.
    geo.castShadow = true;
    geo.receiveShadow = true;
    scene.add(geo);
}

caster.position.set(0, 2.5, 0);
caster.target.position.set(0.3, 1.5, 0);
scene.add(caster);
scene.add(caster.target);


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
    grab.update();
    requestAnimationFrame(animate);
    /*dirx.addEventListener('click', (event) => {
        renderer.render(scene, camera);
    })*/

    renderer.render(scene, camera);
}

spawn(rock);
spawn(bould);
animate();