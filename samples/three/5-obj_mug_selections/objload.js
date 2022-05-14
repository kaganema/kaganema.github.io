/*
Author: Emir Atik (kaganema)
Version: 1.2
*/
const renderer = new THREE.WebGLRenderer();
const labelElements = document.querySelector('#labels');
const camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;

const file_scene = new THREE.Scene();
//file_scene.background = new THREE.Color('skyblue');
//file_scene.background = new THREE.Color(0xcccccc);

camera.position.z = 1;
camera.position.y = 1;
camera.rotateX(1.0);

const pan = new THREE.OrbitControls(camera, renderer.domElement);
pan.target.set(0, 0, 0);
pan.minPolarAngle = -2;
pan.maxPolarAngle = Math.PI/2;
pan.update();
//pan.autoRotate = true;
file_scene.background = new THREE.Color(0xcccccc);

const man = new THREE.LoadingManager();
const tx = new THREE.TextureLoader(man);

//Table texture
const settingTexture = new THREE.MeshStandardMaterial({map: tx.load('assets/wood-furniture-texture-seamless-wooden-textures-for-designers-19.jpg')});

/*const table = () => {
    let surface = THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 2), settingTexture);
};*/
const table = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 10), settingTexture);
table.receiveShadow = true;
file_scene.add(table);
table.position.y = -1.17;

//Wall mesh
const wall = new THREE.Mesh(new THREE.PlaneGeometry(28, 16.5), new THREE.MeshStandardMaterial({color: 0xFAFBFB, map: tx.load('assets/blue-sqes.jpg')}));

wall.position.y = 3;

// Create three more walls to surround the room.
const opposite = wall.clone();

wall.rotateX(-Math.PI);
wall.position.z = 12.5;

opposite.rotateX(Math.PI);
opposite.rotateY(Math.PI);
opposite.position.z = -12.5;

const cl1 = wall.clone();
const cl2 = wall.clone();
cl1.position.x = -14;
cl1.position.z = -0.2;
cl1.rotateY(Math.PI/2);
cl2.position.x = 14;
cl2.position.z = 0.2;
cl2.rotateY(-Math.PI/2);

file_scene.add(cl1);
file_scene.add(cl2);

// Floor layout.
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), new THREE.MeshStandardMaterial({color: 0x666666}));
floor.position.y = -5;
floor.rotateX(-Math.PI/2);
floor.scale.x = 2;
floor.scale.y = 2;

file_scene.add(wall);
file_scene.add(opposite);
file_scene.add(floor);

//Create a massive column for the table
const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3, 1.2), settingTexture);
leg.scale.x = 2.5;
leg.scale.y = 1.4;
leg.scale.z = 2.5;
leg.position.y = -3.2;
file_scene.add(leg);

const setlight = new THREE.AmbientLight(0xfffccc, 1.2);
file_scene.add(setlight);
//directional light
//const drlight = new THREE.HemisphereLight(0x0099ff, 0x080820, 1);
//file_scene.add(drlight);
const drlight = new THREE.DirectionalLight(0x0099ff, 2.2);
drlight.castShadow = true;
file_scene.add(drlight);
file_scene.add(drlight.target);

//List of assets.
const content = [];
// Alternative

const mug_options = [{
    name: "Mug Small",
    detail: "Easy to use mug to sip for at your home. Perfect to fill with your average hot drink.",
    price: "£0.83"
}, {
    name: "Mug Medium",
    detail: "Perfect for filling a can of drink into your mug, share with friends by adding straws!",
    price: "£1.75"
}, {
    name: "Teacup",
    detail: "A light, quick sipping cup for drinking at home or lounge for in-between small breaks.",
    price: "£0.50"
}, {
    name: "Travel Mug",
    detail: "Take this mug with extra capacity for long journeys, added with a cap to keep the heat or coolness for longer periods.",
    price: "£1.80"
}];

//Shared OBJ File loader
const obj_loader = new THREE.OBJLoader();

// DOM elements
let elem ;
let hd ;
let dtx ;
let img ;


//MTL FILE load
const mtl_file = new THREE.MTLLoader();
mtl_file.load('assets/mug.mtl', (mtl) => {
    mtl.preload();
    //const obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(mtl);
    obj_loader.load('assets/mug.obj', (root) => {
        root.castShadow = true;
        root.receiveShadow = true;
        root.position.x = 2.3;
        root.position.z = 2;
        //content.push(root);
        //file_scene.add(root);
        //console.log(root);
        //content.push(root);
        elem = document.createElement('div');
        hd = document.createElement('h4');
        dtx = document.createElement('p');
        sp = document.createElement('span');
        img = document.createElement('img');
        //const title = document.createAttribute('#name');
        hd.setAttribute('id', 'title');
        dtx.setAttribute('class', 'detail');
        sp.setAttribute('class', 'price');
        img.setAttribute('class', 'samp');
        elem.appendChild(hd);
        elem.appendChild(dtx);
        elem.appendChild(sp);
        elem.appendChild(img);
        labelElements.appendChild(elem);
        hd.textContent = mug_options[1].name;
        //hd.innerHTML = mug_options[1].name;
        dtx.textContent = mug_options[1].detail;
        sp.textContent = "Price: " + mug_options[1].price;
        img.src = 'assets/heavy_mug_tilt.png';
        root.info = elem;
        file_scene.add(root);
        //console.log(root);
        content.push(root);
    });
})

mtl_file.load('assets/mug_home.mtl', (mtl) => {
    mtl.preload();
    const obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(mtl);
    obj_loader.load('assets/mug_home.obj', (root) => {
        root.castShadow = true;
        root.receiveShadow = true;
        //content.push(root);
        root.position.x = -2.7;
        root.position.y = -0.3;
        root.position.z = -2;
        elem = document.createElement('div');
        hd = document.createElement('h4');
        dtx = document.createElement('p');
        sp = document.createElement('span');
        img = document.createElement('img');
        //const title = document.createAttribute('#name');
        hd.setAttribute('id', 'title');
        dtx.setAttribute('class', 'detail');
        sp.setAttribute('class', 'price');
        img.setAttribute('class', 'samp');
        elem.appendChild(hd);
        elem.appendChild(dtx);
        elem.appendChild(sp);
        elem.appendChild(img);
        labelElements.appendChild(elem);
        hd.textContent = mug_options[0].name;
        //hd.innerHTML = mug_options[0].name;
        dtx.textContent = mug_options[0].detail;
        sp.textContent = "Price: " + mug_options[0].price;
        img.src = 'assets/home_mug.png';
        root.info = elem;
        file_scene.add(root);
        content.push(root);
    })
})

mtl_file.load('assets/cup_t.mtl', (mtl) => {
    mtl.preload();
    const obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(mtl);
    obj_loader.load('assets/cup_t.obj', (root) => {
        root.castShadow = true;
        root.receiveShadow = true;
        //content.push(root);
        root.position.x = -4;
        root.position.y = -0.48;
        root.position.z = 2;
        elem = document.createElement('div');
        hd = document.createElement('h4');
        dtx = document.createElement('p');
        sp = document.createElement('span');
        img = document.createElement('img');
        //const title = document.createAttribute('#name');
        hd.setAttribute('id', 'title');
        dtx.setAttribute('class', 'detail');
        sp.setAttribute('class', 'price');
        img.setAttribute('class', 'samp');
        elem.appendChild(hd);
        elem.appendChild(dtx);
        elem.appendChild(sp);
        elem.appendChild(img);
        labelElements.appendChild(elem);
        hd.textContent = mug_options[2].name;
        //hd.innerHTML = mug_options[1].name;
        dtx.textContent = mug_options[2].detail;
        sp.textContent = "Price: " + mug_options[2].price;
        img.src = 'assets/coffee-cup.png';
        root.info = elem;
        file_scene.add(root);
        content.push(root);
    })
})

mtl_file.load('assets/jug_i.mtl', (mtl) => {
    mtl.preload();
    const obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(mtl);
    obj_loader.load('assets/jug_i.obj', (root) => {
        root.castShadow = true;
        root.receiveShadow = true;
        //content.push(root);
        root.position.z = -2;
        root.position.x = 4.6;
        elem = document.createElement('div');
        hd = document.createElement('h4');
        dtx = document.createElement('p');
        sp = document.createElement('span');
        img = document.createElement('img');
        //const title = document.createAttribute('#name')
        hd.setAttribute('id', 'title');
        dtx.setAttribute('class', 'detail');
        sp.setAttribute('class', 'price');
        img.setAttribute('class', 'samp');
        elem.appendChild(hd);
        elem.appendChild(dtx);
        elem.appendChild(sp);
        elem.appendChild(img);
        labelElements.appendChild(elem);
        hd.textContent = mug_options[3].name;
        //hd.innerHTML = mug_options[1].name;
        dtx.textContent = mug_options[3].detail;
        sp.textContent = "Price: " + mug_options[3].price;
        img.src = 'assets/travelmug.png';
        root.info = elem;
        file_scene.add(root);
        content.push(root);
    })
})

console.log(content);

//Target mug
let selected = null;
//let selected = new THREE.Object3D | null;
let ray = new THREE.Raycaster();
//intersected objects
let intersects;

/*
This function determines the selected object by getting the 
closest to the raycast. Executed upon a click event.
*/
function picker(event) {
    ray.setFromCamera({
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    }, camera);
    //intersects = ray.intersectObjects(content.flat());
    intersects = ray.intersectObjects(content, true);
    if(intersects.length > 0) {
        selected = intersects[0].object.parent;
        //selected.info.style.display = 'block';
        content.forEach(o => {
            if(o == selected)
                o.info.style.display = 'block';
            else
                o.info.style.display = 'none';
        });
    } else {
        selected = null;
        content.forEach(o => {
            o.info.style.display = 'none';
        });
    }
    console.log(intersects);
    //Option: Try to align HTML elements to be just above the mugs. 
}

/*let vPoint = new THREE.Vector3();
function cardView(doc, mesh) {
    mesh.updateWorldMatrix(true, false);
    mesh.getWorldPosition(vPoint);
    vPoint.project(camera);
    const x = (vPoint.x * .5 + .5) * renderer.domElement.clientWidth;
    const y = (vPoint.y * -.5 + .5) * renderer.domElement.clientHeight;
    
    doc.style.transform = `translate(-50%, -30%) translate(${x}px, ${y}px)`;
}*/

//function cardView(ins) {}

// Obsolete: not in use
function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

//Resize the canvas to screen width, based on source code from https://threejs.org/manual/#en/responsive
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

//Optional: Vector to centre position the document elements.
//let midV = new THREE.Vector3();

function render() {
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    //Optional: Get the mesh centre of each model
    /*content.forEach(o => {
        cardView(o.info, o.object);
    });*/
    renderer.render(file_scene, camera);
}

pan.addEventListener('change', render);
window.addEventListener('resize', render);

document.addEventListener('click', picker, false);
document.addEventListener('touchend', picker, false);
//Set to hide objects when clicking out (for mobile use).
/*document.addEventListener('touchcancel', () => {
    content.forEach(o => o.info.style.display = 'none');
}, false);*/

render();
