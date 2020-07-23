import * as THREE from 'three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../node_modules/three/examples/jsm/libs/dat.gui.module'
import { Option, ShapePicker, ModePicker } from './option.js'
import { GlobalState } from './globalState.js'
import { PlaneGeometry, MeshLambertMaterial, Color, Mesh } from 'three';

var option = new Option()
var shaperPick = new ShapePicker()
var modePick = new ModePicker()
var globalState = new GlobalState()

//global GUI var. (for updating)
var gui;
var positionFolder;
var rotationFolder;
var scaleFolder;

var mouse = {
    x: 0,
    y: 0
};

//0: point light (bright light, on if lighting option is enabled, move with mouse if lightsource is enabled), 1: ambient light (very dim, always on)
var lights = []
lights[0] = new THREE.PointLight(0xffffff);
lights[1] = new THREE.AmbientLight(0x111111);
//set default lighting position
lights[0].position.set(0, 0, 15);

var sphereSize = 0.2;
var pointLightHelper = new THREE.PointLightHelper( lights[0], sphereSize );

//Create main scene
var scene = new THREE.Scene();
//Create camera (migrate)
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
THREE.Cache.enabled = true;
camera.position.z = 5;
scene.add(lights[1]);
scene.add(pointLightHelper);

//initialize renderer and bind it to the canvas
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var shapeContainer = document.getElementById('moveGUI')
var optionContainer = document.getElementById('optionGUI')
var modeContainer = document.getElementById('modeGUI')

//orbit control plugin (only for testing)
// var orbit = new OrbitControls( camera, renderer.domElement );
// orbit.enableZoom = true;

window.onload = function($) {
    var shape_picker = new GUI({name: "Change Shape", autoPlace: false})
    shape_picker.add(shaperPick, "toCube").name("Cube").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toCylinder").name("Cylinder").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toCone").name("Cone").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toSphere").name("Sphere").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toIcosahedron").name("Icosahedron").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toTorus").name("Torus").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toTeapot").name("Teapot").onFinishChange(updateShape)
    shapeContainer.appendChild(shape_picker.domElement)

    var mode_picker = new GUI({name: "Change Render Mode", autoPlace: false})
    mode_picker.add(modePick, "toSolid").name("Solid").onFinishChange(updateMode)
    mode_picker.add(modePick, "toLine").name("Wireframe").onFinishChange(updateMode)
    mode_picker.add(modePick, "toPoint").name("Point").onFinishChange(updateMode)
    modeContainer.appendChild(mode_picker.domElement)

    gui = new GUI({name: 'Options', autoPlace: false});

    var cameraFolder = gui.addFolder("Camera")

    var perspectiveFolder = cameraFolder.addFolder("Perspective")
    perspectiveFolder.add(option, "perspectiveFovy", -180, 180).step(1).name("fovy").onChange(updateCamera)
    perspectiveFolder.add(option, "perspectiveAspectX", 0.001, 1).step(0.001).name("Aspect X").onChange(updateCamera)
    perspectiveFolder.add(option, "perspectiveAspectY", 0.001, 1).step(0.001).name("Aspect Y").onChange(updateCamera)
    perspectiveFolder.add(option, "perspectiveZNear", 0, 10).step(0.01).name("Z Near").onChange(updateCamera)
    perspectiveFolder.add(option, "perspectiveZFar", 0, 10000).step(1).name("Z Far").onChange(updateCamera)

    var lookAtEyeFolder = cameraFolder.addFolder("Look At (Eyes)")
    lookAtEyeFolder.add(option, "lookAtEyeX", -10, 10).step(0.1).name("X").onChange(updateCamera)
    lookAtEyeFolder.add(option, "lookAtEyeY", -10, 10).step(0.1).name("Y").onChange(updateCamera)
    lookAtEyeFolder.add(option, "lookAtEyeZ", -10, 10).step(0.1).name("Z").onChange(updateCamera)

    var lookAtCenterFolder = cameraFolder.addFolder("Look At (Center)")
    lookAtCenterFolder.add(option, "lookAtCenterX", -10, 10).step(0.1).name("X").onChange(updateCamera)
    lookAtCenterFolder.add(option, "lookAtCenterY", -10, 10).step(0.1).name("Y").onChange(updateCamera)
    lookAtCenterFolder.add(option, "lookAtCenterZ", -10, 10).step(0.1).name("Z").onChange(updateCamera)

    var lookAtUpFolder = cameraFolder.addFolder("Look At (Up)")
    lookAtUpFolder.add(option, "lookAtUpX", -1, 1).step(0.01).name("X").onChange(updateCamera)
    lookAtUpFolder.add(option, "lookAtUpY", -1, 1).step(0.01).name("Y").onChange(updateCamera)
    lookAtUpFolder.add(option, "lookAtUpZ", -1, 1).step(0.01).name("Z").onChange(updateCamera)

    var lightingFolder = gui.addFolder("Lighting")
    lightingFolder.add(option, "lighting").name("Enable").onChange(updateLighting)
    lightingFolder.add(option, "lightsource").name("Light Source").onChange(updateLighting)
    lightingFolder.add(option, "shadow").name("Enable Shadow").onChange(updateLighting)

    var transformFolder = gui.addFolder("Transform")

    positionFolder = transformFolder.addFolder("Position")
    positionFolder.add(option, "enablePositionDragging").name("Enable Mouse")
    positionFolder.add(option, "positionX", -5, 5).step(0.1).name("X").onChange(updateMesh)
    positionFolder.add(option, "positionY", -5, 5).step(0.1).name("Y").onChange(updateMesh)
    positionFolder.add(option, "positionZ", -5, 5).step(0.1).name("Z").onChange(updateMesh)

    rotationFolder = transformFolder.addFolder("Rotate")
    rotationFolder.add(option, "enableRotationDragging").name("Enable Mouse")
    rotationFolder.add(option, "rotationX", -180, 180).name("X").onChange(updateMesh)
    rotationFolder.add(option, "rotationY", -180, 180).name("Y").onChange(updateMesh)
    rotationFolder.add(option, "rotationZ", -180, 180).name("Z").onChange(updateMesh)

    scaleFolder = transformFolder.addFolder("Scale")
    scaleFolder.add(option, "enableScaleDragging").name("Enable Mouse")
    scaleFolder.add(option, "scaleX", 0.1, 3).step(0.1).name("X").onChange(updateMesh)
    scaleFolder.add(option, "scaleY", 0.1, 3).step(0.1).name("Y").onChange(updateMesh)
    scaleFolder.add(option, "scaleZ", 0.1, 3).step(0.1).name("Z").onChange(updateMesh)
    
    var textureFolder = gui.addFolder("Texture")
    textureFolder.addColor(option, "textureColor").name("Color").onFinishChange(updateTexture)
    textureFolder.add(option, "useTexture").name("Enable File").onChange(updateTexture)
    textureFolder.add(option, "dummyBrowser").name("Browse...").onChange(changeFilePath)
    optionContainer.appendChild(gui.domElement)

    var animationFolder = gui.addFolder("Animation")
    animationFolder.add(option, "isAnimateRotating").name("Auto Rotate")
    animationFolder.add(option, "isAnimateBouncing").name("Bouncy")
};

window.onmousemove = function(event) {

    //COPY AND PASTE CODE, PROCEED WITH CAUTION
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (option.lightsource) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        //mouseMesh.position.copy(pos);

        lights[0].position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 2));
    }

    if (!globalState.onDrag) return
    if (option.enablePositionDragging && globalState.onDrag) {
        option.positionX = mouse.x * 5;
        option.positionY = mouse.y * 5;
        for (var j in positionFolder.__controllers) {
            positionFolder.__controllers[j].updateDisplay()
        }
    }
    if (option.enableRotationDragging && globalState.onDrag) {
        option.rotationX += mouse.y * 5;
        if (option.rotationX < -180) option.rotationX += 360
        else if (option.rotationX > 180) option.rotationX -= 360
        option.rotationY += mouse.x * 5;
        if (option.rotationY < -180) option.rotationY += 360
        else if (option.rotationY > 180) option.rotationY -= 360
        for (var j in rotationFolder.__controllers) {
            rotationFolder.__controllers[j].updateDisplay()
        }
    }
    if (option.enableScaleDragging && globalState.onDrag) {
        option.scaleX = Math.abs(mouse.x * 5);
        option.scaleY = Math.abs(mouse.y * 5);
        for (var j in scaleFolder.__controllers) {
            scaleFolder.__controllers[j].updateDisplay()
        }
    }
    
    updateMesh()
}

window.onmousedown = function(event) {
    globalState.onDrag = true
}

window.onmouseup = function(event) {
    globalState.onDrag = false
}

scene.add(globalState.activeMesh)
//Default plane
let plane = new PlaneGeometry(20, 20, 20, 20);
let mat = new MeshLambertMaterial({color: 0x666666})
let planeMesh = new Mesh(plane, mat)
planeMesh.rotation.x = -Math.PI / 2
planeMesh.position.y = -3
planeMesh.receiveShadow = true;
scene.add(planeMesh)
updateLighting()

function render() {
    if (option.isAnimateRotating) {
        option.rotationX += 2
        if (option.rotationX < -180) option.rotationX += 360
        else if (option.rotationX > 180) option.rotationX -= 360
        option.rotationY += 2
        if (option.rotationY < -180) option.rotationY += 360
        else if (option.rotationY > 180) option.rotationY -= 360
        option.rotationZ += 2
        if (option.rotationZ < -180) option.rotationZ += 360
        else if (option.rotationZ > 180) option.rotationZ -= 360
        updateMesh();
        for (var j in rotationFolder.__controllers) {
            rotationFolder.__controllers[j].updateDisplay()
        }
    }
    if (option.isAnimateBouncing) {
        globalState.speed -= globalState.accelaretion
        option.positionY += globalState.speed
        if (option.positionY < -2) globalState.speed = -globalState.speed
        updateMesh()
        for (var j in positionFolder.__controllers) {
            positionFolder.__controllers[j].updateDisplay()
        }
    }
    renderer.render(scene, camera)    
    requestAnimationFrame(render)
}


//update point light
function updateLighting() {
    if (option.lighting) {
        scene.add(lights[0])
    }
    else {
        scene.remove(lights[0])
    }

    if (option.lightsource) {
        lights[0].position.set(15, 15, 15);
    }

    if (option.shadow) {
        lights[0].castShadow = true
    }
    else {
        lights[0].castShadow = false
    }
}

//update shape when selected shape change
function updateShape() {
    globalState.updateShape(shaperPick.shape, modePick.renderMode)
    if (globalState.prevMesh !== undefined) {
        scene.remove(globalState.prevMesh)
        scene.add(globalState.activeMesh)
        //to sync new model's texture with the current texture setting
        updateTexture()
        //to sync new model's transform with the current transform setting
        updateMesh()
    }
}

//update mesh when transform parameter change
function updateMesh() {
    globalState.activeMesh.rotation.x = option.rotationX / 180 * Math.PI
    globalState.activeMesh.rotation.y = option.rotationY / 180 * Math.PI
    globalState.activeMesh.rotation.z = option.rotationZ / 180 * Math.PI
    globalState.activeMesh.scale.x = option.scaleX
    globalState.activeMesh.scale.y = option.scaleY
    globalState.activeMesh.scale.z = option.scaleZ
    globalState.activeMesh.position.x = option.positionX
    globalState.activeMesh.position.y = option.positionY
    globalState.activeMesh.position.z = option.positionZ
}

function updateCamera() {
    camera.far = option.perspectiveZFar
    camera.near = option.perspectiveZNear
    camera.fov = option.perspectiveFovy
    camera.aspect = option.perspectiveAspectX / option.perspectiveAspectY
    camera.position.set(option.lookAtEyeX, option.lookAtEyeY, option.lookAtEyeZ)
    camera.lookAt(option.lookAtCenterX, option.lookAtCenterY, option.lookAtCenterZ)
    camera.up.set(option.lookAtUpX, option.lookAtUpY, option.lookAtUpZ)
    camera.updateProjectionMatrix();
}

function updateTexture() {
    //console.log(option.textureData)
    if (option.useTexture) {
        if (option.textureData === undefined) {
            alert('You haven\'t picked a texture source file yet')
            return;
        }
        globalState.activeTexture = new THREE.TextureLoader().load(option.textureData)
    }
    else {
        globalState.activeTexture = undefined
        globalState.activeShape.color = option.textureColor
    }
    globalState.updateTexture()
    //please work.....
    scene.remove(globalState.prevMesh)
    scene.add(globalState.activeMesh)
    updateMesh()
}

//update rendering mode
function updateMode() {
    globalState.updateRenderMode(modePick.renderMode)
    if (globalState.prevMesh !== undefined) {
        scene.remove(globalState.prevMesh)
        scene.add(globalState.activeMesh)
        updateMesh()
    }
}

function changeFilePath() {
    option.fileSelect(() => {
        updateTexture()
    })
}

requestAnimationFrame(render)


