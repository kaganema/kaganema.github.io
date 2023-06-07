const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
camera.position.set(1, 18, 0);
controls.update();

// Control variables
var lightPosition;
var orbitSpeed = 0.1;

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
        console.log(backdrop.color);
    }else{
        scene.remove(backdrop);
    }
});

setting.add(tools, 'tone').onChange(function() {
    backdrop.intensity = tools.tone;
});

// Keep the controls hidden upon loading.
setting.close();

// Add animating objects into an array for a unified transformation.
var spinners = [];

// Scene importer, based off of THREE.js ObjectLoader documentation
const loader = new THREE.ObjectLoader();

loader.load('room.json', function(model) {
    model.traverse(function(elem) {
        // Box 19 == Leg
        // Box == Open walls / Columns
        // Box 9 == Garden porch
        // Box 5 == Shelf top
        // Box 6 doesn't need explicit calling
        // Box 14 == Cupboard 'edge'
        // Box 23 == Pillars
        if (elem instanceof THREE.DirectionalLight || elem instanceof THREE.PointLight) {
            elem.castShadow = true;
        }
        if (elem.name == 'Floor') {
            elem.receiveShadow = true;
        }
        if (elem.name == 'Box' || elem.name.includes('Wall')) {
            elem.castShadow = true;
            elem.receiveShadow = true;
        }
        if (elem.name.includes('sofa')) {
            elem.castShadow = true;
        }
        if (elem.name.includes('Lamp_001')) {
            elem.castShadow = true;
        }
        if (elem.name == 'Table') {
            elem.traverse(function(child) {
                if(child.name.includes('TableTop'))
                    child.receiveShadow = true;
                child.castShadow = true;
            });
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
    //model.castShadow = true;
    //model.receiveShadow = true;
    scene.add(model);
}, function(xhr) {
    // Replace with DOM element: add element, call xhr object, remove element after 100%
    console.log((xhr.loaded / xhr.total * 100) + '% complete');
}, function(err) {
    console.error('Scene did not load');
});

console.log(spinners);

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
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    spinners.forEach(function(obj) {
        obj.rotateX(0.01);
    });
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
