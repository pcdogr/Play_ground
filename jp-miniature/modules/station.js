// station.js - Japanese rural train station platform with shelter
import * as THREE from 'three';

function woodMat(c = 0x8B6B4A) {
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0.0 });
}
function ironMat(c = 0x555555) {
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.8 });
}

export function createStation(scene) {
    const station = new THREE.Group();
    station.position.set(5, 0, 8);

    // ===== Platform =====
    const platGeo = new THREE.BoxGeometry(12, 0.35, 3);
    const platMat = new THREE.MeshStandardMaterial({
        color: 0xccbbaa,
        roughness: 0.85,
        metalness: 0.0,
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.y = 0.175;
    platform.receiveShadow = true;
    platform.castShadow = true;
    station.add(platform);

    // Platform edge tactile paving (yellow strip)
    const tactileGeo = new THREE.BoxGeometry(12, 0.02, 0.2);
    const tactileMat = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.7,
    });
    const tactile = new THREE.Mesh(tactileGeo, tactileMat);
    tactile.position.set(0, 0.36, -1.4);
    station.add(tactile);

    // ===== Waiting shelter (候车亭) =====
    const shelterX = 0;
    const shelterZ = 0;

    // Floor of shelter
    const shelterFloorGeo = new THREE.BoxGeometry(5, 0.08, 2.5);
    const shelterFloor = new THREE.Mesh(shelterFloorGeo, woodMat(0x9a7b5a));
    shelterFloor.position.set(shelterX, 0.38, shelterZ);
    shelterFloor.receiveShadow = true;
    station.add(shelterFloor);

    // Four support pillars - traditional Japanese style (slightly tapered)
    const pillarPositions = [
        [-2.2, 0, -1.0], [2.2, 0, -1.0],
        [-2.2, 0, 1.0], [2.2, 0, 1.0]
    ];
    for (const [px, py, pz] of pillarPositions) {
        // Main pillar
        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.1, 3, 8);
        const pillar = new THREE.Mesh(pillarGeo, woodMat(0x6b4226));
        pillar.position.set(px, 1.85, pz);
        pillar.castShadow = true;
        station.add(pillar);

        // Pillar cap
        const capGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.15, 8);
        const cap = new THREE.Mesh(capGeo, ironMat());
        cap.position.set(px, 3.35, pz);
        station.add(cap);
    }

    // ===== Roof (Japanese gabled style) =====
    // Main roof plane
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-2.8, 0);
    roofShape.lineTo(0, 0.6);
    roofShape.lineTo(2.8, 0);
    roofShape.lineTo(-2.8, 0);

    const roofExtrudeSettings = { depth: 3.2, bevelEnabled: false };
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings);
    const roofMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.5,
        metalness: 0.4,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(shelterX, 3.4, shelterZ - 1.6);
    roof.rotation.y = 0;
    roof.castShadow = true;
    station.add(roof);

    // Roof ridge line
    const ridgeGeo = new THREE.BoxGeometry(0.06, 0.06, 3.2);
    const ridge = new THREE.Mesh(ridgeGeo, ironMat(0x333333));
    ridge.position.set(shelterX, 4.02, shelterZ);
    station.add(ridge);

    // ===== Bench (2 seats) =====
    for (let b = 0; b < 2; b++) {
        const benchGroup = new THREE.Group();
        benchGroup.position.set(-1.5 + b * 3, 0.42, 0);

        // Seat planks
        for (let p = 0; p < 3; p++) {
            const plankGeo = new THREE.BoxGeometry(1.4, 0.05, 0.2);
            const plank = new THREE.Mesh(plankGeo, woodMat(0x7a5a3a));
            plank.position.set(0, 0.5 + p * 0, 0);
            plank.castShadow = true;
            benchGroup.add(plank);
        }

        // Back rest planks
        for (let p = 0; p < 2; p++) {
            const bplankGeo = new THREE.BoxGeometry(1.4, 0.05, 0.15);
            const bplank = new THREE.Mesh(bplankGeo, woodMat(0x7a5a3a));
            bplank.position.set(0, 0.85 + p * 0.25, -0.15);
            bplank.rotation.x = -0.15;
            bplank.castShadow = true;
            benchGroup.add(bplank);
        }

        // Legs
        for (let lx of [-0.6, 0.6]) {
            for (let lz of [-0.2, 0.2]) {
                const legGeo = new THREE.BoxGeometry(0.06, 0.5, 0.06);
                const leg = new THREE.Mesh(legGeo, ironMat());
                leg.position.set(lx, 0.25, lz);
                leg.castShadow = true;
                benchGroup.add(leg);
            }
        }

        station.add(benchGroup);
    }

    // ===== Station sign =====
    // Sign post
    const signPostGeo = new THREE.CylinderGeometry(0.04, 0.05, 2.2, 8);
    const signPost = new THREE.Mesh(signPostGeo, ironMat());
    signPost.position.set(-3.5, 1.1, -0.5);
    signPost.castShadow = true;
    station.add(signPost);

    // Sign board
    const signBoardGeo = new THREE.BoxGeometry(1.2, 0.6, 0.08);
    const signBoardMat = new THREE.MeshStandardMaterial({
        color: 0xf5f0e0,
        roughness: 0.6,
    });
    const signBoard = new THREE.Mesh(signBoardGeo, signBoardMat);
    signBoard.position.set(-3.5, 2.2, -0.5);
    signBoard.castShadow = true;
    station.add(signBoard);

    // Blue stripe on sign
    const stripeGeo = new THREE.BoxGeometry(1.0, 0.1, 0.01);
    const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshStandardMaterial({
        color: 0x2244aa,
        roughness: 0.5,
    }));
    stripe.position.set(-3.5, 2.2, -0.45);
    station.add(stripe);

    // Small text marks (abstract kanji)
    for (let i = 0; i < 3; i++) {
        const markGeo = new THREE.BoxGeometry(0.08, 0.15, 0.01);
        const mark = new THREE.Mesh(markGeo, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.5,
        }));
        mark.position.set(-3.8 + i * 0.3, 1.95, -0.45);
        station.add(mark);
    }

    // ===== Platform edge light markers =====
    for (let i = 0; i < 6; i++) {
        const markerGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.4, 6);
        const marker = new THREE.Mesh(markerGeo, ironMat());
        marker.position.set(-4.5 + i * 1.8, 0.55, -1.5);
        marker.castShadow = true;
        station.add(marker);

        // Small light on top
        const lightGeo = new THREE.SphereGeometry(0.025, 6, 6);
        const lightMat = new THREE.MeshStandardMaterial({
            color: 0x44aaff,
            emissive: 0x4488ff,
            emissiveIntensity: 0.4,
        });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(-4.5 + i * 1.8, 0.78, -1.5);
        station.add(light);
    }

    scene.add(station);
    return station;
}
