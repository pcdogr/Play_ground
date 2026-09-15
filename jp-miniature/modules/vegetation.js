// vegetation.js - Bushes, hedges, and lawn areas
import * as THREE from 'three';

function bushMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x44aa44,
        roughness: 0.75,
        metalness: 0.0,
    });
}
function darkBushMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x338833,
        roughness: 0.8,
        metalness: 0.0,
    });
}
function lawnMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x66bb55,
        roughness: 0.9,
        metalness: 0.0,
    });
}

// Create a manicured spherical bush
function createBush(scene, position, radius = 0.4) {
    const bushGroup = new THREE.Group();
    bushGroup.position.copy(position);

    // Main body - slightly irregular sphere
    const mainGeo = new THREE.SphereGeometry(radius, 10, 8);
    const main = new THREE.Mesh(mainGeo, bushMat());
    main.position.y = radius * 0.8;
    main.castShadow = true;
    main.receiveShadow = true;
    bushGroup.add(main);

    // Sub-bumps for organic look
    for (let i = 0; i < 5; i++) {
        const bumpR = radius * (0.3 + Math.random() * 0.3);
        const bumpGeo = new THREE.SphereGeometry(bumpR, 6, 6);
        const bumpMat = Math.random() > 0.5 ? bushMat() : darkBushMat();
        const bump = new THREE.Mesh(bumpGeo, bumpMat);
        const angle = (i / 5) * Math.PI * 2;
        bump.position.set(
            Math.cos(angle) * radius * 0.5,
            radius * 0.6 + Math.random() * radius * 0.4,
            Math.sin(angle) * radius * 0.5
        );
        bump.castShadow = true;
        bushGroup.add(bump);
    }

    scene.add(bushGroup);
    return bushGroup;
}

// Create a hedge row (elongated bush)
function createHedge(scene, position, length = 2.0) {
    const hedgeGroup = new THREE.Group();
    hedgeGroup.position.copy(position);

    const segments = Math.floor(length / 0.5);
    for (let i = 0; i < segments; i++) {
        const segGeo = new THREE.SphereGeometry(0.35, 8, 6);
        const segMat = i % 2 === 0 ? bushMat() : darkBushMat();
        const seg = new THREE.Mesh(segGeo, segMat);
        seg.position.set(i * 0.5 - length / 2 + 0.25, 0.3, 0);
        seg.scale.y = 0.8;
        seg.castShadow = true;
        hedgeGroup.add(seg);
    }

    scene.add(hedgeGroup);
    return hedgeGroup;
}

export function createVegetation(scene) {
    const vegGroup = new THREE.Group();

    // ===== Lawn areas =====
    // Edge lawn strips around the base perimeter
    const lawnPositions = [
        { x: 0, z: 18, w: 40, d: 2 },   // North edge
        { x: 0, z: -18, w: 40, d: 2 },  // South edge
        { x: 18, z: 0, w: 2, d: 36 },   // East edge
        { x: -18, z: 0, w: 2, d: 36 },  // West edge
    ];

    for (const lp of lawnPositions) {
        const lawnGeo = new THREE.BoxGeometry(lp.w, 0.08, lp.d);
        const lawn = new THREE.Mesh(lawnGeo, lawnMat());
        lawn.position.set(lp.x, 0.04, lp.z);
        lawn.receiveShadow = true;
        vegGroup.add(lawn);
    }

    // ===== Bushes along road edges =====
    // Near the store
    createBush(vegGroup, new THREE.Vector3(11, 0, -1), 0.35);
    createBush(vegGroup, new THREE.Vector3(12, 0, 2), 0.3);

    // Near the station
    createBush(vegGroup, new THREE.Vector3(3, 0, 6), 0.4);
    createBush(vegGroup, new THREE.Vector3(8, 0, 6), 0.35);

    // Along street edges
    createBush(vegGroup, new THREE.Vector3(-15, 0, -10), 0.3);
    createBush(vegGroup, new THREE.Vector3(-15, 0, -2), 0.35);
    createBush(vegGroup, new THREE.Vector3(-15, 0, 6), 0.3);

    // Decorative bushes
    createBush(vegGroup, new THREE.Vector3(5, 0, -10), 0.4);
    createBush(vegGroup, new THREE.Vector3(-8, 0, -10), 0.3);

    // ===== Hedge rows =====
    // Along sidewalk near store
    createHedge(vegGroup, new THREE.Vector3(10, 0, 2), 2.0);

    // Near station area
    createHedge(vegGroup, new THREE.Vector3(0, 0, 5), 3.0);

    // Along the north edge
    createHedge(vegGroup, new THREE.Vector3(-5, 0, 16), 4.0);

    // ===== Ground cover patches =====
    // Small grass patches between pavement
    for (let i = 0; i < 8; i++) {
        const gx = -16 + Math.random() * 32;
        const gz = -16 + Math.random() * 32;
        const gSize = 0.3 + Math.random() * 0.5;
        const gGeo = new THREE.CylinderGeometry(gSize, gSize, 0.03, 8);
        const g = new THREE.Mesh(gGeo, lawnMat());
        g.position.set(gx, 0.03, gz);
        g.receiveShadow = true;
        vegGroup.add(g);
    }

    scene.add(vegGroup);
    return vegGroup;
}
