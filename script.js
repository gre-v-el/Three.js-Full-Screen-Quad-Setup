import * as THREE from 'https://threejs.org/build/three.module.js'

// three.js setups
var canvasHTML = document.getElementById('canvas');
var sceneThree = new THREE.Scene();
var rendererThree = new THREE.WebGLRenderer({ canvas: canvasHTML, antialias: true });
var cameraThree = new THREE.PerspectiveCamera(45, canvasHTML.clientWidth / canvasHTML.clientWidth, 1, 1000);
var clock = new THREE.Clock();
var loader = new THREE.FileLoader();

// fps view
var script = document.createElement('script');
var stats;
script.onload = function () {
	stats = new Stats();
	document.body.appendChild(stats.dom);
};
script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
document.head.appendChild(script);

// uniforms for ray marching renderer
var rmUniforms = {
	aspect: { value: cameraThree.aspect },
	time: { value: 0 }
};

var vertex = '';
var fragment = '';
loader.load('/shaders/fragment.glsl', function (data) { fragment = data; countLoads(); })
loader.load('/shaders/vertex.glsl', function (data) { vertex = data; countLoads(); })

var loadsLeft = 2;
function countLoads() {
	loadsLeft--;
	if (loadsLeft == 0) {
		// main display setup
		var quadDisplay = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2),
			new THREE.ShaderMaterial({
				vertexShader: vertex,
				fragmentShader: fragment,
				uniforms: rmUniforms,
				depthWrite: false,
				depthTest: false
			})
		);
		sceneThree.add(quadDisplay);
	}
}


function tick() {
	var dt = clock.getDelta();

	rmUniforms.time.value = clock.elapsedTime;

	render();
	if (stats != undefined) stats.update();
	requestAnimationFrame(tick);
}

function render() {

	if (canvasHTML.width !== canvasHTML.clientWidth || canvasHTML.height !== canvasHTML.clientHeight) {
		rendererThree.setSize(canvasHTML.clientWidth, canvasHTML.clientHeight, false);
		cameraThree.aspect = canvasHTML.clientWidth / canvasHTML.clientHeight;
		cameraThree.updateProjectionMatrix();
		rmUniforms.aspect.value = cameraThree.aspect;
	}
	rendererThree.render(sceneThree, cameraThree);
}

tick();