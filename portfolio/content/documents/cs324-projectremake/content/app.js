const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

let controls = new THREE.PointerLockControls(camera, document.body);

// Clock instance that falls back to Date version if necessary
var last = performance.now();
//var d = new THREE.Clock();

camera.position.set(0, 0, 0);

// Control variables
var lightPosition;
var orbitSpeed = 0.1;

var velocity = new THREE.Vector3();
//var direction = new THREE.Vector3();

// Raycasting elements.
var bounds = []
var ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( -1, 0, -1 ));
// Sun/Star model
var orbiter = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff }));
orbiter.position.set(57, 60, -89.6);
scene.add(orbiter);
orbiter.castShadow = true;
orbiter.receiveShadow = false;

// Live adjustable scene settings
var setting = new dat.GUI({name: 'Viewpanel'});
var tools = {
    //enable: true,
    sky: 0xfffaac,
    ambience: false,
    tone: 0.6,
    day: true
};

// Lighting variables
scene.background = new THREE.Color(tools.sky);
var backdrop = new THREE.AmbientLight(tools.sky, tools.tone);

// Enable scene settings

setting.addColor(tools, 'sky').onChange(function() { 
    scene.background.set(tools.sky);
    // ambient light
    backdrop.color.set(tools.sky);
});

// Toggle between night and day
setting.add(tools, 'day').onChange(function() {
    if(tools.day){
        scene.background.set(tools.sky);
        backdrop.color.set (tools.sky);
    }else{
        scene.background.set(0x000000);
        backdrop.color.set(0xfffccc);
    }
});

setting.add(tools, 'ambience').onChange(function() {
    if(tools.ambience){
        scene.add(backdrop);
    }else{
        scene.remove(backdrop);
    }
});

setting.add(tools, 'tone').onChange(function() {
    backdrop.intensity = tools.tone;
});

// Keep the controls hidden upon loading.
setting.close();

THREE.Cache.enabled = true;

// Add animating objects into an array for a unified transformation.
var spinners = [];

// Bounding box for camera.
//var camCube = new THREE.Box3().setFromObject(controls.getObject());

// Scene loading notification
var loadingView = document.getElementById('loading');

// Scene importer, based off of THREE.js ObjectLoader documentation
const loader = new THREE.ObjectLoader();

loader.load('room.json', function(model) {
    model.traverse(function(elem) {
        // Box 19 == Fences
        // Box == Open walls / Columns
        // Box 9 == Garden porch
        // Box 5 == Shelf top
        // Box 6 doesn't need explicit calling
        // Box 14 == Cupboard 'edge'
        // Box 23 == Pillar
        if(elem.name == 'Box 19' || elem.name == 'Box 9'){
            bounds.push(elem);
        }
        // Add collision on the lamp in case we align.
        if(elem.name == "Box 23" || elem.name == "Icosahedron 29"){
            bounds.push(elem);
        }
        if (elem instanceof THREE.DirectionalLight || elem instanceof THREE.PointLight) {
            elem.castShadow = true;
        }
        if (elem.name == 'Floor') {
            elem.receiveShadow = true;
        }
        if (elem.name == 'Box' || elem.name.includes('Wall')) {
            elem.castShadow = true;
            elem.receiveShadow = true;
            bounds.push(elem);
        }
        if (elem.name.includes('WindowDoor')){
            bounds.push(elem);
        }
        if (elem.name.includes('sofa')) {
            elem.castShadow = true;
            bounds.push(elem);
        }
        if (elem.name.includes('Lamp_001')) {
            elem.castShadow = true;
            bounds.push(elem);
        }
        if (elem.name == 'Table') {
            elem.traverse(function(child) {
                if(child.name.includes('TableTop'))
                    child.receiveShadow = true;
                child.castShadow = true;
            });
            bounds.push(elem);
        }
        /*if (elem.name.includes('tablecup.dae')) {
            elem.castShadow = true;
        }*/
        if (elem.name.includes('plate.dae')) {
            elem.castShadow = true;
        }
        if (elem.name.includes('Cup')) {
            elem.castShadow = true;
        }
        // Fragile items
        if (elem.name.includes('Glass') || elem.name == 'Trophy') {
            elem.castShadow = true;
        }
        if (elem.name.includes('TorusKnot') || elem.name == 'Icosahedron 2') {
            spinners.push(elem);
        }
    });
    model.position.y = 6.7;
    //model.castShadow = true;
    //model.receiveShadow = true;
    scene.add(model);
    loadingView.style.display = 'none';
}, function(xhr) {
    loadingView.style.display = 'inline'; //or block , minimal difference in the current setup.
    loadingView.textContent = Math.round(xhr.loaded / xhr.total * 100) + '% complete';
}, function(err) {
    console.error('Scene did not load');
});


// The intersected collision models.
let intersect;
// Raycaster for interactive icons.
// (Possible idea: Add the 'reclining' chairs Groups to the clickable icoms array)
let interact;

// Possible pause function?
//function stop(e) {}

renderer.domElement.addEventListener('click', function() {
    controls.lock();
});

// Pointer Lock controls activation
controls.addEventListener('lock', function() {
    setting.hide();
});

controls.addEventListener('unlock', function() {
    setting.show();
});

scene.add(controls.getObject());

// Raycasting function (for collision and pickup). BACKUP
/*function aim(event) {
    ray.setFromCamera({
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    }, camera);
}*/
//console.log(controls.getDirection(new THREE.Vector3()));


// Use with earlier versions, solution found in Three.js repository 
// (examples/jsm/PointerLockControls.js)
document.addEventListener('keydown', function(e) {
    switch(e.code){
        case 'ArrowUp':
            ray.set(controls.getObject().position, velocity);
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.z = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            velocity.crossVectors(controls.getObject().up, velocity)
            controls.getObject().position.addScaledVector(velocity, 0.4);}
            break;
        case 'ArrowDown':
            ray.set(controls.getObject().position, velocity.negate());
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.z = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            velocity.crossVectors(controls.getObject().up, velocity)
            controls.getObject().position.addScaledVector(velocity, -0.4);} 
            break;
        case 'ArrowLeft':
            ray.set(controls.getObject().position, velocity.negate());
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.x = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            controls.getObject().position.addScaledVector(velocity, -0.4);
            }
            break;
        case 'ArrowRight':
            ray.set(controls.getObject().position, velocity);
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.x = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            controls.getObject().position.addScaledVector(velocity, 0.4);}
            break;
    }
});

// For an updated version of the famework
/*document.addEventListener('keydown', function(e) {
    switch(e.code){
        case 'ArrowUp':
            controls.moveForward(-0.5);
            break;
        case 'ArrowDown':
            controls.moveForward(0.5);
            break;
        case 'ArrowLeft':
            controls.moveRight(-0.5);
            break;
        case 'ArrowRight':
            controls.moveRight(0.5);
            break;
    }
});*/

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


function render() {
    let t = performance.now();
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    spinners.forEach(function(obj) {
        obj.rotateX(0.01);
    });
    if(controls.isLocked === true){
        // We want to get the camera position to check the distance between controller and object.
        ray.ray.origin.copy(controls.getObject().position);
        intersect = ray.intersectObjects(bounds, true);
        let delta = (t - last) / 1000;
        velocity.x += velocity.x * 0.2 * delta;
        velocity.z += velocity.z * 0.2 * delta;
        
        // Scene collision
        // Added intersect array logic separate from distance to avoid conflict between collection and collision.
        // UPDATED: Added separate interaction collection with raycast array to separate the types.
        if (intersect.length > 0) {
            if (intersect[0].distance < 1) {
                velocity.subVectors(controls.getObject().position, intersect[0].point).normalize();
                controls.getObject().position.addScaledVector(velocity, 1);
            }
        }
    }
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    last = t;
}

render();