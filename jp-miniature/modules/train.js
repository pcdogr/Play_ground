// train.js - Vintage Japanese single-car train
import * as THREE from 'three';

export function createTrain(scene) {
    const train = new THREE.Group();
    train.position.set(-5, 0, 10);

    // Materials
    const bodyCreamMat = new THREE.MeshStandardMaterial({
        color: 0xf5ead0,
        roughness: 0.35,
        metalness: 0.15,
    });
    const bodyGreenMat = new THREE.MeshStandardMaterial({
        color: 0x338855,
        roughness: 0.35,
        metalness: 0.15,
    });
    const windowMat = new THREE.MeshStandardMaterial({
        color: 0x88bbdd,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.3,
        metalness: 0.8,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.4,
        metalness: 0.7,
    });

    // === Train body (rounded rectangular shape) ===
    const bodyLen = 16;
    const bodyW = 2.6;
    const bodyH = 2.8;

    // Main body
    const bodyGeo = new THREE.BoxGeometry(bodyLen, bodyH, bodyW);
    const body = new THREE.Mesh(bodyGeo, bodyCreamMat);
    body.position.y = bodyH / 2 + 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    train.add(body);

    // Rounded front ends
    for (let end of [-1, 1]) {
        const frontGeo = new THREE.SphereGeometry(bodyW / 2, 12, 8, Math.PI, Math.PI * 2);
        const front = new THREE.Mesh(frontGeo, bodyCreamMat);
        front.position.set(end * bodyLen / 2, bodyH / 2 + 0.8, 0);
        front.scale.set(0.3, bodyH / bodyW, 1);
        front.castShadow = true;
        train.add(front);
    }

    // Green stripe along the side
    for (let side of [-1, 1]) {
        const stripeGeo = new THREE.BoxGeometry(bodyLen + 0.05, 0.3, bodyW / 2 + 0.05);
        const stripe = new THREE.Mesh(stripeGeo, bodyGreenMat);
        stripe.position.set(0, bodyH / 2 + 0.3, side * (bodyW / 2 + 0.01));
        train.add(stripe);
    }

    // === Windows ===
    // Side windows (8 per side)
    for (let side of [-1, 1]) {
        for (let i = 0; i < 8; i++) {
            const wGeo = new THREE.PlaneGeometry(1.2, 1.0);
            const w = new THREE.Mesh(wGeo, windowMat);
            w.position.set(-6 + i * 1.6, bodyH / 2 + 1.2, side * (bodyW / 2 + 0.02));
            train.add(w);

            // Window frame
            const frameGeo = new THREE.BoxGeometry(1.3, 1.1, 0.04);
            const frame = new THREE.Mesh(frameGeo, darkMetalMat);
            frame.position.set(-6 + i * 1.6, bodyH / 2 + 1.2, side * (bodyW / 2 - 0.01));
            train.add(frame);
        }

        // Door windows
        for (let d of [-3, 3]) {
            const dwGeo = new THREE.PlaneGeometry(0.7, 1.2);
            const dw = new THREE.Mesh(dwGeo, windowMat);
            dw.position.set(d, bodyH / 2 + 1.0, side * (bodyW / 2 + 0.02));
            train.add(dw);
        }
    }

    // === Doors ===
    const doorMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.4,
        metalness: 0.5,
    });
    for (let side of [-1, 1]) {
        for (let d of [-3, 3]) {
            const doorGeo = new THREE.BoxGeometry(0.8, 2.0, 0.05);
            const door = new THREE.Mesh(doorGeo, doorMat);
            door.position.set(d, bodyH / 2 + 0.8, side * (bodyW / 2 + 0.01));
            train.add(door);

            // Door frame
            const dfTopGeo = new THREE.BoxGeometry(0.9, 0.04, 0.06);
            const dfTop = new THREE.Mesh(dfTopGeo, darkMetalMat);
            dfTop.position.set(d, bodyH / 2 + 1.82, side * (bodyW / 2 + 0.01));
            train.add(dfTop);
        }
    }

    // === Roof ===
    const roofGeo = new THREE.BoxGeometry(bodyLen + 0.3, 0.1, bodyW + 0.2);
    const roofMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.3,
        metalness: 0.4,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = bodyH + 0.85;
    roof.castShadow = true;
    train.add(roof);

    // Roof equipment (AC unit / pantograph housing)
    const acGeo = new THREE.BoxGeometry(3, 0.3, 1.5);
    const ac = new THREE.Mesh(acGeo, darkMetalMat);
    ac.position.y = bodyH + 1.0;
    ac.castShadow = true;
    train.add(ac);

    // === Headlights ===
    for (let end of [-1, 1]) {
        // Headlight housing
        const hlGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12);
        const hlMat = new THREE.MeshStandardMaterial({
            color: 0xffffcc,
            emissive: 0xffffaa,
            emissiveIntensity: 0.3,
            roughness: 0.1,
        });
        const hl = new THREE.Mesh(hlGeo, hlMat);
        hl.position.set(end * (bodyLen / 2 + 0.05), 1.0, 0);
        hl.rotation.z = Math.PI / 2;
        train.add(hl);

        // Tail light
        const tlGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8);
        const tlMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff2200,
            emissiveIntensity: 0.2,
            roughness: 0.2,
        });
        const tl = new THREE.Mesh(tlGeo, tlMat);
        tl.position.set(end * (bodyLen / 2 + 0.05), 0.5, 0);
        tl.rotation.z = Math.PI / 2;
        train.add(tl);
    }

    // === Front grill / bumper area ===
    for (let end of [-1, 1]) {
        const grillGeo = new THREE.BoxGeometry(0.05, 0.6, 1.5);
        const grill = new THREE.Mesh(grillGeo, darkMetalMat);
        grill.position.set(end * (bodyLen / 2 + 0.15), 0.7, 0);
        train.add(grill);

        // Bumper bar
        const bumperGeo = new THREE.BoxGeometry(0.08, 0.06, bodyW + 0.2);
        const bumper = new THREE.Mesh(bumperGeo, darkMetalMat);
        bumper.position.set(end * (bodyLen / 2 + 0.1), 0.4, 0);
        train.add(bumper);

        // Cowcatcher / step
        const stepGeo = new THREE.BoxGeometry(0.15, 0.04, 1.0);
        const step = new THREE.Mesh(stepGeo, darkMetalMat);
        step.position.set(end * (bodyLen / 2 + 0.1), 0.25, 0);
        train.add(step);
    }

    // === Underframe / bogie ===
    const underGeo = new THREE.BoxGeometry(bodyLen - 2, 0.15, bodyW - 0.3);
    const under = new THREE.Mesh(underGeo, darkMetalMat);
    under.position.y = 0.65;
    train.add(under);

    // === Wheels (4 bogies, 2 wheels each) ===
    const wheelPositions = [
        [-5, 0, 0], [5, 0, 0],  // Z positions along train
    ];
    for (const wz of wheelPositions) {
        for (let side of [-1, 1]) {
            // Axle
            const axleGeo = new THREE.CylinderGeometry(0.04, 0.04, bodyW + 0.2, 6);
            const axle = new THREE.Mesh(axleGeo, darkMetalMat);
            axle.position.set(wz[0], 0.35, 0);
            axle.rotation.x = Math.PI / 2;
            train.add(axle);

            // Two wheels per axle
            for (let w of [-1, 1]) {
                const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16);
                const wheel = new THREE.Mesh(wGeo, wheelMat);
                wheel.position.set(wz[0], 0.35, side * 0.85);
                wheel.rotation.x = Math.PI / 2;
                wheel.castShadow = true;
                train.add(wheel);

                // Wheel flange detail
                const flangeGeo = new THREE.TorusGeometry(0.28, 0.015, 4, 12);
                const flange = new THREE.Mesh(flangeGeo, wheelMat);
                flange.position.set(wz[0], 0.35, side * 0.92);
                flange.rotation.y = Math.PI / 2;
                train.add(flange);
            }

            // Bogie frame
            const bogieGeo = new THREE.BoxGeometry(1.5, 0.08, bodyW - 0.3);
            const bogie = new THREE.Mesh(bogieGeo, darkMetalMat);
            bogie.position.set(wz[0], 0.55, 0);
            train.add(bogie);
        }
    }

    // === Number plate ===
    const plateGeo = new THREE.BoxGeometry(0.8, 0.2, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
    });
    for (let end of [-1, 1]) {
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.set(end * (bodyLen / 2 + 0.03), bodyH + 0.5, 0);
        train.add(plate);

        // Number text marks
        for (let i = 0; i < 3; i++) {
            const numGeo = new THREE.BoxGeometry(0.12, 0.1, 0.01);
            const num = new THREE.Mesh(numGeo, darkMetalMat);
            num.position.set(end * (bodyLen / 2 + 0.03), bodyH + 0.5, -0.2 + i * 0.2);
            train.add(num);
        }
    }

    // === Destination sign (electronic display) ===
    const destGeo = new THREE.BoxGeometry(2.0, 0.3, 0.02);
    const destMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff3300,
        emissiveIntensity: 0.4,
        roughness: 0.4,
    });
    for (let end of [-1, 1]) {
        const dest = new THREE.Mesh(destGeo, destMat);
        dest.position.set(end * (bodyLen / 2 + 0.03), bodyH / 2 + 1.8, 0);
        train.add(dest);
    }

    scene.add(train);
    return train;
}
