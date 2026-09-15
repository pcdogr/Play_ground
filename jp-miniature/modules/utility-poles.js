// utility-poles.js - Utility poles with overhead power lines
import * as THREE from 'three';

export function createUtilityPoles(scene) {
    const upGroup = new THREE.Group();

    const poleMat = new THREE.MeshStandardMaterial({
        color: 0x5a4a3a,
        roughness: 0.8,
        metalness: 0.0,
    });
    const crossBarMat = new THREE.MeshStandardMaterial({
        color: 0x6b5a4a,
        roughness: 0.7,
        metalness: 0.0,
    });
    const insulatorMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeff,
        roughness: 0.3,
        metalness: 0.1,
    });
    const wireMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.6,
        metalness: 0.4,
    });

    // Pole positions
    const poles = [
        { x: -17, z: -12, h: 7 },
        { x: -17, z: -5, h: 6.5 },
        { x: -17, z: 2, h: 7 },
        { x: -17, z: 9, h: 6.5 },
    ];

    const poleMeshes = [];

    for (const p of poles) {
        const poleGroup = new THREE.Group();
        poleGroup.position.set(p.x, 0, p.z);

        // Main pole (tapered)
        const poleGeo = new THREE.CylinderGeometry(0.06, 0.1, p.h, 8);
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = p.h / 2;
        pole.castShadow = true;
        poleGroup.add(pole);

        // Cross bars at different heights
        const crossBarHeights = [0.6, 0.75, 0.9];
        const crossBarWidths = [1.2, 1.0, 0.8];
        for (let i = 0; i < crossBarHeights.length; i++) {
            const cbGeo = new THREE.BoxGeometry(crossBarWidths[i], 0.05, 0.08);
            const cb = new THREE.Mesh(cbGeo, crossBarMat);
            cb.position.y = p.h * crossBarHeights[i];
            cb.castShadow = true;
            poleGroup.add(cb);

            // Insulators on each end
            for (let side of [-1, 1]) {
                const insGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.08, 6);
                const ins = new THREE.Mesh(insGeo, insulatorMat);
                ins.position.set(side * crossBarWidths[i] / 2, p.h * crossBarHeights[i] + 0.04, 0);
                poleGroup.add(ins);
            }
        }

        // Warning bands near top
        for (let b = 0; b < 3; b++) {
            const bandGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.08, 8, 1, true);
            const bandColor = b % 2 === 0 ? 0x222222 : 0xf5f5f5;
            const band = new THREE.Mesh(bandGeo, new THREE.MeshStandardMaterial({
                color: bandColor,
                roughness: 0.7,
                side: THREE.DoubleSide,
            }));
            band.position.y = p.h - 0.5 + b * 0.1;
            poleGroup.add(band);
        }

        // Lightning arrester / equipment box
        const equipGeo = new THREE.BoxGeometry(0.15, 0.2, 0.1);
        const equipMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.3,
            metalness: 0.5,
        });
        const equip = new THREE.Mesh(equipGeo, equipMat);
        equip.position.set(0.1, p.h * 0.7, 0.05);
        equip.castShadow = true;
        poleGroup.add(equip);

        upGroup.add(poleGroup);
        poleMeshes.push({ mesh: poleGroup, data: p });
    }

    // ===== Wires between poles =====
    for (let i = 0; i < poleMeshes.length - 1; i++) {
        const p1 = poleMeshes[i].data;
        const p2 = poleMeshes[i + 1].data;

        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const midX = (p1.x + p2.x) / 2;
        const midZ = (p1.z + p2.z) / 2;

        // Multiple wire levels with sag
        const wireLevels = [
            { h1: 0.6, h2: 0.6, sag: 0.3 },
            { h1: 0.75, h2: 0.75, sag: 0.25 },
            { h1: 0.9, h2: 0.9, sag: 0.2 },
        ];

        for (const wl of wireLevels) {
            const y1 = p1.h * wl.h1;
            const y2 = p2.h * wl.h2;
            const midY = (y1 + y2) / 2 - wl.sag;

            // Create catenary curve using quadratic bezier
            const points = [];
            const segments = 20;
            for (let s = 0; s <= segments; s++) {
                const t = s / segments;
                const x = p1.x + t * dx;
                const z = p1.z + t * dz;
                // Catenary sag
                const y = y1 * (1 - t) + y2 * t - 4 * wl.sag * t * (1 - t);
                points.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.008, 4, false);
            const wire = new THREE.Mesh(tubeGeo, wireMat);
            upGroup.add(wire);
        }
    }

    // Extra horizontal cross wires (横向电线)
    // Connect to perpendicular direction poles
    const crossPoles = [
        { x: -10, z: -5, h: 5.5 },
        { x: 0, z: -5, h: 6 },
        { x: 10, z: -5, h: 5.5 },
    ];

    for (const cp of crossPoles) {
        const poleGroup = new THREE.Group();
        poleGroup.position.set(cp.x, 0, cp.z);

        const poleGeo = new THREE.CylinderGeometry(0.05, 0.08, cp.h, 8);
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = cp.h / 2;
        pole.castShadow = true;
        poleGroup.add(pole);

        // Cross bar
        const cbGeo = new THREE.BoxGeometry(0.8, 0.05, 0.08);
        const cb = new THREE.Mesh(cbGeo, crossBarMat);
        cb.position.y = cp.h * 0.85;
        poleGroup.add(cb);

        // Warning bands
        for (let b = 0; b < 3; b++) {
            const bandGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.06, 8, 1, true);
            const band = new THREE.Mesh(bandGeo, new THREE.MeshStandardMaterial({
                color: b % 2 === 0 ? 0x222222 : 0xf5f5f5,
                roughness: 0.7,
                side: THREE.DoubleSide,
            }));
            band.position.y = cp.h - 0.3 + b * 0.08;
            poleGroup.add(band);
        }

        upGroup.add(poleGroup);
    }

    // Wires between cross poles
    for (let i = 0; i < crossPoles.length - 1; i++) {
        const p1 = crossPoles[i];
        const p2 = crossPoles[i + 1];
        const points = [];
        for (let s = 0; s <= 15; s++) {
            const t = s / 15;
            const x = p1.x + t * (p2.x - p1.x);
            const z = p1.z + t * (p2.z - p1.z);
            const y = p1.h * 0.8 + t * (p2.h * 0.8 - p1.h * 0.8) - 0.15 * 4 * t * (1 - t);
            points.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 15, 0.006, 4, false);
        const wire = new THREE.Mesh(tubeGeo, wireMat);
        upGroup.add(wire);
    }

    scene.add(upGroup);
    return upGroup;
}
