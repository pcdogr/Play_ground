// street.js - Asphalt roads, crosswalk, gutters
import * as THREE from 'three';

function makeAsphaltMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.9,
        metalness: 0.0,
    });
}

function makeWhiteLineMat() {
    return new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.7,
        metalness: 0.0,
    });
}

function makeYellowLineMat() {
    return new THREE.MeshStandardMaterial({
        color: 0xccaa22,
        roughness: 0.7,
        metalness: 0.0,
    });
}

export function createStreets(scene) {
    const streetGroup = new THREE.Group();
    const asphalt = makeAsphaltMat();
    const whiteLine = makeWhiteLineMat();
    const yellowLine = makeYellowLineMat();

    // ===== Main north-south road =====
    // Center at X=-13, width 6m, from Z=-20 to Z=20
    const roadNSGeo = new THREE.BoxGeometry(6, 0.06, 40);
    const roadNS = new THREE.Mesh(roadNSGeo, asphalt);
    roadNS.position.set(-13, 0.06, 0);
    roadNS.receiveShadow = true;
    streetGroup.add(roadNS);

    // Center yellow line - north-south
    for (let z = -20; z < 20; z += 1.5) {
        const segGeo = new THREE.BoxGeometry(0.12, 0.01, 0.8);
        const seg = new THREE.Mesh(segGeo, yellowLine);
        seg.position.set(-13, 0.095, z);
        streetGroup.add(seg);
    }

    // ===== Branch road (east-west) =====
    // Center at Z=-5, width 5m, from X=-16 to X=20
    const roadEWGeo = new THREE.BoxGeometry(36, 0.06, 5);
    const roadEW = new THREE.Mesh(roadEWGeo, asphalt);
    roadEW.position.set(2, 0.06, -5);
    roadEW.receiveShadow = true;
    streetGroup.add(roadEW);

    // Center yellow line - east-west
    for (let x = -16; x < 20; x += 1.5) {
        const segGeo = new THREE.BoxGeometry(0.8, 0.01, 0.12);
        const seg = new THREE.Mesh(segGeo, yellowLine);
        seg.position.set(x, 0.095, -5);
        streetGroup.add(seg);
    }

    // ===== Crosswalk at intersection corner =====
    // Zebra crossing on north-south road at intersection
    const crosswalkZ = -5;
    for (let i = 0; i < 8; i++) {
        const stripeGeo = new THREE.BoxGeometry(0.5, 0.01, 3);
        const stripe = new THREE.Mesh(stripeGeo, whiteLine);
        stripe.position.set(-13 + (i - 3.5) * 0.65, 0.095, crosswalkZ);
        streetGroup.add(stripe);
    }

    // Crosswalk on east-west road at intersection
    for (let i = 0; i < 7; i++) {
        const stripeGeo = new THREE.BoxGeometry(3, 0.01, 0.5);
        const stripe = new THREE.Mesh(stripeGeo, whiteLine);
        stripe.position.set(-13, 0.095, -5 + (i - 3) * 0.65);
        streetGroup.add(stripe);
    }

    // ===== Sidewalks =====
    const sidewalkMat = new THREE.MeshStandardMaterial({
        color: 0xc8b99a,
        roughness: 0.8,
        metalness: 0.0,
    });

    // Sidewalk along NS road - east side (toward store)
    const swEastGeo = new THREE.BoxGeometry(2, 0.08, 25);
    const swEast = new THREE.Mesh(swEastGeo, sidewalkMat);
    swEast.position.set(-8.8, 0.07, 0);
    swEast.receiveShadow = true;
    swEast.castShadow = true;
    streetGroup.add(swEast);

    // Sidewalk along NS road - west side
    const swWestGeo = new THREE.BoxGeometry(2, 0.08, 25);
    const swWest = new THREE.Mesh(swWestGeo, sidewalkMat);
    swWest.position.set(-17.2, 0.07, 0);
    swWest.receiveShadow = true;
    swWest.castShadow = true;
    streetGroup.add(swWest);

    // Sidewalk along EW road - north side
    const swNorthGeo = new THREE.BoxGeometry(20, 0.08, 2);
    const swNorth = new THREE.Mesh(swNorthGeo, sidewalkMat);
    swNorth.position.set(10, 0.07, -2.5);
    swNorth.receiveShadow = true;
    swNorth.castShadow = true;
    streetGroup.add(swNorth);

    // ===== Drainage gutters along road edges =====
    const gutterMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.9,
        metalness: 0.0,
    });

    // Gutter along NS road edges
    for (let side of [-1, 1]) {
        const gutterGeo = new THREE.BoxGeometry(0.3, 0.04, 40);
        const gutter = new THREE.Mesh(gutterGeo, gutterMat);
        gutter.position.set(-13 + side * 3.2, 0.05, 0);
        streetGroup.add(gutter);
    }

    // Gutter along EW road edges
    for (let side of [-1, 1]) {
        const gutterGeo = new THREE.BoxGeometry(36, 0.04, 0.3);
        const gutter = new THREE.Mesh(gutterGeo, gutterMat);
        gutter.position.set(2, 0.05, -5 + side * 2.7);
        streetGroup.add(gutter);
    }

    // ===== Road edge curbs =====
    const curbMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.7,
        metalness: 0.0,
    });

    // Curbs along NS road
    for (let side of [-1, 1]) {
        const curbGeo = new THREE.BoxGeometry(0.15, 0.1, 40);
        const curb = new THREE.Mesh(curbGeo, curbMat);
        curb.position.set(-13 + side * 3.05, 0.08, 0);
        curb.castShadow = true;
        streetGroup.add(curb);
    }

    scene.add(streetGroup);
    return streetGroup;
}
