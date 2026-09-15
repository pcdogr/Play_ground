// lighting.js - Cinematic lighting for sunny spring day
import * as THREE from 'three';

export function setupLighting(scene) {
    // Hemisphere light - sky/ground ambient
    const hemi = new THREE.HemisphereLight(0xfff4e6, 0x444444, 0.5);
    scene.add(hemi);

    // Ambient light
    const ambient = new THREE.AmbientLight(0xffeedd, 0.35);
    scene.add(ambient);

    // Main sun - warm daylight direction (morning angle)
    const sun = new THREE.DirectionalLight(0xfff8e7, 2.5);
    sun.position.set(15, 25, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 4096;
    sun.shadow.mapSize.height = 4096;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    // Fill light - softer from opposite side
    const fill = new THREE.DirectionalLight(0xc0d8ee, 0.8);
    fill.position.set(-20, 15, -15);
    scene.add(fill);

    // Rim/back light for edge definition
    const rim = new THREE.DirectionalLight(0xffeedd, 0.6);
    rim.position.set(0, 8, -25);
    scene.add(rim);

    // Subtle warm accent from above (spring feeling)
    const accent = new THREE.DirectionalLight(0xffe4c4, 0.3);
    accent.position.set(-10, 20, 5);
    scene.add(accent);

    return { sun, fill, rim, accent };
}
