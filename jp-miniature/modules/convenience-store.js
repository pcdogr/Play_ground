// convenience-store.js - Japanese corner convenience store
import * as THREE from 'three';

function woodMat(color = 0x8B6B4A) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.0 });
}
function metalMat(color = 0x888888) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.85 });
}
function plasticMat(color = 0xcccccc) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.0 });
}

export function createConvenienceStore(scene) {
    const store = new THREE.Group();
    // Position: corner at (8, 0, -3), rotated 20 degrees
    store.position.set(8, 0, -3);
    store.rotation.y = -0.35; // ~20 degrees facing the corner

    // Dimensions
    const W = 10; // width (X)
    const D = 8;  // depth (Z)
    const H = 4.5; // height
    const wallT = 0.2; // wall thickness

    // === Materials ===
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0xf5f0e8,
        roughness: 0.75,
        metalness: 0.0,
    });
    const roofMat = new THREE.MeshStandardMaterial({
        color: 0x2255aa,
        roughness: 0.4,
        metalness: 0.15,
    });
    const trimMat = new THREE.MeshStandardMaterial({
        color: 0x1a4488,
        roughness: 0.3,
        metalness: 0.1,
    });
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
    });
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0xddddcc,
        roughness: 0.6,
        metalness: 0.05,
    });
    const emissiveSignMat = new THREE.MeshStandardMaterial({
        color: 0x00cc44,
        emissive: 0x00ff55,
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.1,
    });
    const emissiveWarmMat = new THREE.MeshStandardMaterial({
        color: 0xffeebb,
        emissive: 0xffddaa,
        emissiveIntensity: 1.2,
        roughness: 0.5,
    });

    // === Foundation/floor ===
    const floorGeo = new THREE.BoxGeometry(W + 0.4, 0.15, D + 0.4);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.075;
    floor.receiveShadow = true;
    store.add(floor);

    // === Back wall ===
    const backWallGeo = new THREE.BoxGeometry(W, H, wallT);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, H / 2, -D / 2 + wallT / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    store.add(backWall);

    // === Left wall ===
    const leftWallGeo = new THREE.BoxGeometry(wallT, H, D);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-W / 2 + wallT / 2, H / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    store.add(leftWall);

    // === Right wall ===
    const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
    rightWall.position.set(W / 2 - wallT / 2, H / 2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    store.add(rightWall);

    // === Front wall (glass facade) ===
    // Lower solid portion
    const frontLowerGeo = new THREE.BoxGeometry(W, 1.0, wallT);
    const frontLower = new THREE.Mesh(frontLowerGeo, wallMat);
    frontLower.position.set(0, 0.5, D / 2 - wallT / 2);
    frontLower.castShadow = true;
    store.add(frontLower);

    // Upper solid portion (above glass)
    const frontUpperGeo = new THREE.BoxGeometry(W, 0.8, wallT);
    const frontUpper = new THREE.Mesh(frontUpperGeo, wallMat);
    frontUpper.position.set(0, H - 0.4, D / 2 - wallT / 2);
    frontUpper.castShadow = true;
    store.add(frontUpper);

    // Side solid portions of front wall
    for (let side of [-1, 1]) {
        const sideSolidGeo = new THREE.BoxGeometry(1.2, H - 1.8, wallT);
        const sideSolid = new THREE.Mesh(sideSolidGeo, wallMat);
        sideSolid.position.set(side * (W / 2 - 0.6), (H - 1.8) / 2 + 1.0, D / 2 - wallT / 2);
        sideSolid.castShadow = true;
        store.add(sideSolid);
    }

    // Large glass windows on front
    const glassGeo = new THREE.PlaneGeometry(W - 2.4, H - 2.6);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, (H - 2.6) / 2 + 1.0, D / 2 - wallT - 0.05);
    store.add(glass);

    // Door frame
    const doorFrameGeo = new THREE.BoxGeometry(1.6, 2.4, 0.15);
    const doorFrame = new THREE.Mesh(doorFrameGeo, trimMat);
    doorFrame.position.set(W / 2 - 1.8, 1.2, D / 2 - wallT / 2);
    doorFrame.castShadow = true;
    store.add(doorFrame);

    // Door glass
    const doorGlassGeo = new THREE.PlaneGeometry(1.4, 2.0);
    const doorGlass = new THREE.Mesh(doorGlassGeo, glassMat);
    doorGlass.position.set(W / 2 - 1.8, 1.2, D / 2 - wallT - 0.1);
    store.add(doorGlass);

    // === Roof ===
    const roofGeo = new THREE.BoxGeometry(W + 1.2, 0.2, D + 1.2);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = H + 0.1;
    roof.castShadow = true;
    store.add(roof);

    // Roof overhang trim
    const overhangGeo = new THREE.BoxGeometry(W + 1.2, 0.15, D + 1.2);
    const overhang = new THREE.Mesh(overhangGeo, trimMat);
    overhang.position.y = H - 0.075;
    store.add(overhang);

    // === Neon sign / store signboard ===
    // Green sign above the glass - "ファミリーマート" style
    const signGeo = new THREE.BoxGeometry(4, 0.6, 0.15);
    const sign = new THREE.Mesh(signGeo, emissiveSignMat);
    sign.position.set(0, H - 0.5, D / 2 + 0.05);
    sign.castShadow = true;
    store.add(sign);

    // Sign text strips (simplified kanji-style marks)
    for (let i = 0; i < 5; i++) {
        const markGeo = new THREE.BoxGeometry(0.4, 0.35, 0.02);
        const mark = new THREE.Mesh(markGeo, plasticMat(0xffffff));
        mark.position.set(-1.5 + i * 0.75, H - 0.5, D / 2 + 0.15);
        store.add(mark);
    }

    // === Interior shelves ===
    const shelfMat = woodMat(0x7a6040);
    const shelfSideMat = metalMat(0x999999);

    // 4 rows of shelves inside
    for (let r = 0; r < 4; r++) {
        const shelfZ = -2.5 + r * 1.5;

        // Shelf frame - two vertical supports
        for (let side of [-1, 1]) {
            const supportGeo = new THREE.BoxGeometry(0.06, 3.2, 0.06);
            const support = new THREE.Mesh(supportGeo, shelfSideMat);
            support.position.set(side * 1.8, 1.6, shelfZ);
            support.castShadow = true;
            store.add(support);
        }

        // Horizontal shelf boards
        for (let level = 0; level < 4; level++) {
            const boardGeo = new THREE.BoxGeometry(3.6, 0.06, 0.5);
            const board = new THREE.Mesh(boardGeo, shelfMat);
            board.position.set(0, 0.4 + level * 0.85, shelfZ);
            board.castShadow = true;
            board.receiveShadow = true;
            store.add(board);
        }

        // Products on shelves (colorful boxes/cans)
        const productColors = [0xff4444, 0x44aa44, 0x4444ff, 0xffaa00, 0xff66cc, 0x44cccc, 0xff8844, 0x8844cc];
        for (let level = 0; level < 4; level++) {
            for (let p = 0; p < 6; p++) {
                const pColor = productColors[(level * 6 + p) % productColors.length];
                const isCan = Math.random() > 0.5;

                if (isCan) {
                    const canGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8);
                    const can = new THREE.Mesh(canGeo, plasticMat(pColor));
                    can.position.set(-1.4 + p * 0.55, 0.52 + level * 0.85, shelfZ);
                    can.castShadow = true;
                    store.add(can);
                } else {
                    const boxGeo = new THREE.BoxGeometry(0.15, 0.2, 0.12);
                    const box = new THREE.Mesh(boxGeo, plasticMat(pColor));
                    box.position.set(-1.4 + p * 0.55, 0.55 + level * 0.85, shelfZ);
                    box.castShadow = true;
                    store.add(box);
                }
            }
        }
    }

    // === Checkout counter ===
    const counterGeo = new THREE.BoxGeometry(2.5, 1.0, 0.8);
    const counter = new THREE.Mesh(counterGeo, woodMat(0x6b5030));
    counter.position.set(-3, 0.5, 2.8);
    counter.castShadow = true;
    counter.receiveShadow = true;
    store.add(counter);

    // Counter top
    const counterTopGeo = new THREE.BoxGeometry(2.7, 0.06, 1.0);
    const counterTop = new THREE.Mesh(counterTopGeo, plasticMat(0x555555));
    counterTop.position.set(-3, 1.03, 2.8);
    counterTop.castShadow = true;
    store.add(counterTop);

    // Cash register
    const regGeo = new THREE.BoxGeometry(0.5, 0.35, 0.4);
    const reg = new THREE.Mesh(regGeo, plasticMat(0x444444));
    reg.position.set(-2.5, 1.2, 2.8);
    reg.castShadow = true;
    store.add(reg);

    // Register screen
    const screenGeo = new THREE.PlaneGeometry(0.3, 0.2);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x66aadd,
        emissiveIntensity: 0.6,
        side: THREE.DoubleSide,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-2.5, 1.45, 3.01);
    screen.rotation.x = -0.3;
    store.add(screen);

    // === Interior light (warm glow) ===
    // Ceiling light panels
    for (let lx = -2; lx <= 2; lx += 2) {
        for (let lz = -2; lz <= 2; lz += 2) {
            const panelGeo = new THREE.BoxGeometry(1.2, 0.04, 0.6);
            const panel = new THREE.Mesh(panelGeo, emissiveWarmMat);
            panel.position.set(lx, H - 0.3, lz);
            store.add(panel);
        }
    }

    // Warm point light from inside store
    const interiorLight = new THREE.PointLight(0xffddaa, 2, 12, 1.5);
    interiorLight.position.set(0, 3, 0);
    interiorLight.castShadow = false;
    store.add(interiorLight);

    // === Awning / canopy at entrance ===
    const awningGeo = new THREE.BoxGeometry(2.5, 0.08, 1.8);
    const awningMat = new THREE.MeshStandardMaterial({
        color: 0xee3333,
        roughness: 0.5,
        metalness: 0.0,
    });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(W / 2 - 1.2, 3.0, D / 2 + 0.9);
    awning.castShadow = true;
    store.add(awning);

    // Awning stripes
    for (let i = 0; i < 4; i++) {
        const stripeGeo = new THREE.BoxGeometry(0.5, 0.09, 1.8);
        const stripeMat = plasticMat(0xffffff);
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(W / 2 - 2.2 + i * 0.6, 3.0, D / 2 + 0.9);
        store.add(stripe);
    }

    // Awning support poles
    for (let side of [-1, 1]) {
        const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6);
        const pole = new THREE.Mesh(poleGeo, metalMat(0xcccccc));
        pole.position.set(W / 2 - 0.5 + side * 0.8, 2.15, D / 2 + 1.7);
        pole.castShadow = true;
        store.add(pole);
    }

    scene.add(store);
    return store;
}
