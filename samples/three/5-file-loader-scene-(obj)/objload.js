const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;

const file_scene = new THREE.Scene();
//file_scene.background = new THREE.Color('skyblue');
file_scene.background = new THREE.Color(0xcccccc);

camera.position.z = 5;

const pan = new THREE.OrbitControls(camera, renderer.domElement);
pan.target.set(0, 0, 0);
pan.update();
//pan.autoRotate = true;

const man = new THREE.LoadingManager();
const tx = new THREE.TextureLoader(man);

//NOTE: Change to Standard material once the asset import is done.
const settingTexture = new THREE.MeshStandardMaterial({map: tx.load('assets/wood-furniture-texture-seamless-wooden-textures-for-designers-19.jpg')});

/*const table = () => {
    let surface = THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 2), settingTexture);
};*/
const table = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 10), settingTexture);
table.receiveShadow = true;
file_scene.add(table);
table.position.y = -1.17;

//NOTE: Change to Standard material once the asset import is done.
const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshStandardMaterial({color: 0x666666}));

const opposite = wall.clone();

wall.rotateX(-Math.PI);
wall.position.z = 6.5;

opposite.rotateX(Math.PI);
opposite.rotateY(Math.PI);
opposite.position.z = -6.5;

const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), new THREE.MeshStandardMaterial({color: 0x666666}));
floor.position.y = -5;
floor.rotateX(-Math.PI/2);

file_scene.add(wall);
file_scene.add(opposite);
file_scene.add(floor);

const setlight = new THREE.AmbientLight(0xfffccc, 1.2);
file_scene.add(setlight);
//directional light
//const drlight = new THREE.HemisphereLight(0x0099ff, 0x080820, 1);
//file_scene.add(drlight);
const drlight = new THREE.DirectionalLight(0x0099ff, 1);
drlight.castShadow = true;
file_scene.add(drlight);
file_scene.add(drlight.target);

//OBJ File loader practice
const obj_loader = new THREE.OBJLoader();
/*obj_loader.load('assets/mug.obj', (root) => {
    file_scene.add(root);
});*/

//MTL FILE load
const mtl_file = new THREE.MTLLoader();
mtl_file.load('assets/mug.mtl', (mtl) => {
    mtl.preload();
    //const obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(mtl);
    obj_loader.load('assets/mug.obj', (root) => {
        //const materials = {Material: new THREE.MeshPhongMaterial(mtl)};
        root.castShadow = true;
        root.receiveShadow = true;
        file_scene.add(root);
    });
})

//Optional: Create garden pots to load in project.


//Resize the canvas to screen width
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

/*const spotlight = (intensity, distance, angle = 0.0, penumbra = 0.0, decay = 0.0) => {
    return new THREE.SpotLight(0xFFFFFF, intensity, distance, angle, penumbra, decay);
};*/

//spotlight.position.y = 2;

function render() {
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    
    renderer.render(file_scene, camera);
}

pan.addEventListener('change', render);
window.addEventListener('resize', render);

//OLDER VERSIONS ONLY
/*window.addEventListener('mousedown', (e) => {
    e.preventDefault();
    window.focus();
  });
window.addEventListener('keydown', (e) => {
    e.preventDefault();
  });*/

render();