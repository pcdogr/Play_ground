// scenes.js - Scene, Camera, Renderer, OrbitControls initialization
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Sky gradient background
    scene.background = new THREE.Color(0x87CEEB);

    // Atmospheric fog for miniature depth-of-field feel
    scene.fog = new THREE.FogExp2(0xd4eaf7, 0.008);

    // Camera - third person observation angle
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    camera.position.set(-22, 18, -22);
    camera.lookAt(0, 0, 0);

    // OrbitControls - free drag rotation, zoom, no UI
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0, 0);
    controls.enablePan = false;

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
}
