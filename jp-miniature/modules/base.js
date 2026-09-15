// base.js - Square solid-color miniature base platform
import * as THREE from 'three';

export function createBase(scene) {
    const baseGroup = new THREE.Group();

    // Main base platform - clean rectangular platform
    // 40x40 top surface, slightly raised edge
    const baseGeo = new THREE.BoxGeometry(40, 0.6, 40);
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0xd2c4a0,
        roughness: 0.7,
        metalness: 0.0,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.3;
    base.receiveShadow = true;
    base.castShadow = true;
    baseGroup.add(base);

    // Raised edge / lip around the perimeter - miniature model feel
    const edgeGeo = new THREE.BoxGeometry(40.6, 0.3, 40.6);
    const edgeMat = new THREE.MeshStandardMaterial({
        color: 0xbfb48a,
        roughness: 0.6,
        metalness: 0.0,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.y = -0.6;
    edge.receiveShadow = true;
    edge.castShadow = true;
    baseGroup.add(edge);

    // Inner surface - subtle sand-like texture base
    const surfaceGeo = new THREE.BoxGeometry(39.6, 0.05, 39.6);
    const surfaceMat = new THREE.MeshStandardMaterial({
        color: 0xe8dcc4,
        roughness: 0.85,
        metalness: 0.0,
    });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.position.y = 0.025;
    surface.receiveShadow = true;
    baseGroup.add(surface);

    scene.add(baseGroup);
    return baseGroup;
}
