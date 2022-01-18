"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var stats_module_1 = require("three/examples/jsm/libs/stats.module");
var CSGMesh_1 = require("./CSGMesh");
var scene = new THREE.Scene();
var light1 = new THREE.SpotLight();
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 4;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);
var light2 = new THREE.SpotLight();
light2.position.set(-2.5, 5, 5);
light2.angle = Math.PI / 4;
light2.penumbra = 0.5;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0.5;
camera.position.y = 2;
camera.position.z = 2.5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
var material = new THREE.MeshPhysicalMaterial({});
material.thickness = 3.0;
material.roughness = 0.9;
material.clearcoat = 0.1;
material.clearcoatRoughness = 0;
material.transmission = 0.99;
material.ior = 1.25;
material.envMapIntensity = 25;
var texture = new THREE.TextureLoader().load('img/grid.png');
material.map = texture;
var pmremGenerator = new THREE.PMREMGenerator(renderer);
var envTexture = new THREE.CubeTextureLoader().load([
    'img/px_25.jpg',
    'img/nx_25.jpg',
    'img/py_25.jpg',
    'img/ny_25.jpg',
    'img/pz_25.jpg',
    'img/nz_25.jpg',
], function () {
    material.envMap = pmremGenerator.fromCubemap(envTexture).texture;
    pmremGenerator.dispose();
});
{
    //create a cube and sphere and intersect them
    var cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    var sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1.45, 8, 8), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
    var cylinderMesh1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    var cylinderMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    var cylinderMesh3 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    cubeMesh.position.set(-5, 0, -6);
    scene.add(cubeMesh);
    sphereMesh.position.set(-2, 0, -6);
    scene.add(sphereMesh);
    var cubeCSG = CSGMesh_1.CSG.fromMesh(cubeMesh);
    var sphereCSG = CSGMesh_1.CSG.fromMesh(sphereMesh);
    var cubeSphereIntersectCSG = cubeCSG.intersect(sphereCSG);
    var cubeSphereIntersectMesh = CSGMesh_1.CSG.toMesh(cubeSphereIntersectCSG, new THREE.Matrix4());
    cubeSphereIntersectMesh.material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
    });
    cubeSphereIntersectMesh.position.set(-2.5, 0, -3);
    scene.add(cubeSphereIntersectMesh);
    //create 3 cylinders at different rotations and union them
    cylinderMesh1.position.set(1, 0, -6);
    scene.add(cylinderMesh1);
    cylinderMesh2.position.set(3, 0, -6);
    cylinderMesh2.geometry.rotateX(Math.PI / 2);
    scene.add(cylinderMesh2);
    cylinderMesh3.position.set(5, 0, -6);
    cylinderMesh3.geometry.rotateZ(Math.PI / 2);
    scene.add(cylinderMesh3);
    var cylinderCSG1 = CSGMesh_1.CSG.fromMesh(cylinderMesh1);
    var cylinderCSG2 = CSGMesh_1.CSG.fromMesh(cylinderMesh2);
    var cylinderCSG3 = CSGMesh_1.CSG.fromMesh(cylinderMesh3);
    var cylindersUnionCSG = cylinderCSG1.union(cylinderCSG2.union(cylinderCSG3));
    var cylindersUnionMesh = CSGMesh_1.CSG.toMesh(cylindersUnionCSG, new THREE.Matrix4());
    cylindersUnionMesh.material = new THREE.MeshPhongMaterial({
        color: 0xffa500,
    });
    cylindersUnionMesh.position.set(2.5, 0, -3);
    scene.add(cylindersUnionMesh);
    //subtract the cylindersUnionCSG from the cubeSphereIntersectCSG
    var finalCSG = cubeSphereIntersectCSG.subtract(cylindersUnionCSG);
    var finalMesh = CSGMesh_1.CSG.toMesh(finalCSG, new THREE.Matrix4());
    finalMesh.material = material;
    scene.add(finalMesh);
}
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
var stats = (0, stats_module_1.default)();
document.body.appendChild(stats.dom);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
}
function render() {
    renderer.render(scene, camera);
}
animate();
