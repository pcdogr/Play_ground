// vending-machine.js - Japanese-style vending machine with can details
import * as THREE from 'three';

function plasticMat(color) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.0,
    });
}

export function createVendingMachine(scene) {
    const vmGroup = new THREE.Group();
    vmGroup.position.set(12, 0, 0);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.3,
        metalness: 0.6,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.3,
        metalness: 0.7,
    });
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        roughness: 0.05,
        metalness: 0.05,
        transparent: true,
        opacity: 0.3,
    });
    const emissiveMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeff,
        emissive: 0xccccff,
        emissiveIntensity: 1.0,
    });

    // Main body
    const bodyGeo = new THREE.BoxGeometry(1.2, 2.8, 0.8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.4;
    body.castShadow = true;
    body.receiveShadow = true;
    vmGroup.add(body);

    // Base
    const baseGeo = new THREE.BoxGeometry(1.3, 0.15, 0.9);
    const base = new THREE.Mesh(baseGeo, darkMetalMat);
    base.position.y = 0.075;
    base.castShadow = true;
    vmGroup.add(base);

    // Top cap
    const topGeo = new THREE.BoxGeometry(1.25, 0.15, 0.85);
    const top = new THREE.Mesh(topGeo, bodyMat);
    top.position.y = 2.875;
    top.castShadow = true;
    vmGroup.add(top);

    // Display window (glass front)
    const windowGeo = new THREE.PlaneGeometry(1.0, 1.6);
    const windowMesh = new THREE.Mesh(windowGeo, glassMat);
    windowMesh.position.set(0, 1.6, 0.41);
    vmGroup.add(windowMesh);

    // Interior light glow
    const interiorLight = new THREE.PointLight(0xccddff, 1.5, 3, 2);
    interiorLight.position.set(0, 1.6, 0);
    vmGroup.add(interiorLight);

    // Glow panel behind glass
    const glowGeo = new THREE.PlaneGeometry(0.9, 1.5);
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeff,
        emissive: 0xccccff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 1.6, 0.35);
    vmGroup.add(glow);

    // Shelves inside
    const shelfMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.4,
        metalness: 0.5,
    });
    for (let i = 0; i < 4; i++) {
        const shelfGeo = new THREE.BoxGeometry(0.9, 0.03, 0.6);
        const shelf = new THREE.Mesh(shelfGeo, shelfMat);
        shelf.position.set(0, 0.7 + i * 0.5, 0);
        vmGroup.add(shelf);
    }

    // Cans on shelves (colorful)
    const canColors = [0xff3333, 0x33cc33, 0x3366ff, 0xffaa00, 0xff6699, 0x66ccaa, 0x9966ff, 0xff8833];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            const cColor = canColors[(row * 5 + col) % canColors.length];
            const canGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.14, 10);
            const canMat = new THREE.MeshStandardMaterial({
                color: cColor,
                roughness: 0.25,
                metalness: 0.7,
            });
            const can = new THREE.Mesh(canGeo, canMat);
            can.position.set(-0.35 + col * 0.18, 0.85 + row * 0.5, 0.1);
            can.castShadow = true;
            vmGroup.add(can);

            // Can top detail (pull tab ring)
            const ringGeo = new THREE.TorusGeometry(0.02, 0.005, 4, 8);
            const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.3,
                metalness: 0.8,
            }));
            ring.position.copy(can.position);
            ring.position.y += 0.07;
            ring.rotation.x = Math.PI / 2;
            vmGroup.add(ring);
        }
    }

    // Control panel area (right side)
    const panelGeo = new THREE.BoxGeometry(0.25, 1.2, 0.05);
    const panel = new THREE.Mesh(panelGeo, darkMetalMat);
    panel.position.set(0.48, 1.5, 0.42);
    vmGroup.add(panel);

    // Button grid
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
            const btnGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8);
            const btn = new THREE.Mesh(btnGeo, plasticMat(0x4488cc));
            btn.position.set(0.48, 1.2 + row * 0.2, 0.45);
            btn.rotation.x = Math.PI / 2;
            vmGroup.add(btn);
        }
    }

    // Coin slot
    const slotGeo = new THREE.BoxGeometry(0.08, 0.03, 0.02);
    const slot = new THREE.Mesh(slotGeo, darkMetalMat);
    slot.position.set(0.48, 2.0, 0.45);
    vmGroup.add(slot);

    // Collection tray
    const trayGeo = new THREE.BoxGeometry(0.6, 0.08, 0.25);
    const tray = new THREE.Mesh(trayGeo, darkMetalMat);
    tray.position.set(0, 0.25, 0.42);
    tray.castShadow = true;
    vmGroup.add(tray);

    // Opening for collection
    const openingGeo = new THREE.BoxGeometry(0.5, 0.15, 0.01);
    const openingMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
    });
    const opening = new THREE.Mesh(openingGeo, openingMat);
    opening.position.set(0, 0.28, 0.405);
    vmGroup.add(opening);

    // Brand label panel (top area)
    const labelGeo = new THREE.PlaneGeometry(0.8, 0.3);
    const labelMat = new THREE.MeshStandardMaterial({
        color: 0x2266cc,
        emissive: 0x2266cc,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(0, 2.3, 0.41);
    vmGroup.add(label);

    scene.add(vmGroup);
    return vmGroup;
}
