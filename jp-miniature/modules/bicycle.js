// bicycle.js - Detailed bicycle with rack
import * as THREE from 'three';

export function createBicycle(scene) {
    const bikeGroup = new THREE.Group();
    bikeGroup.position.set(14, 0, 0);
    bikeGroup.rotation.y = 0.3;

    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x2266cc,
        roughness: 0.3,
        metalness: 0.7,
    });
    const blackMetalMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.6,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.15,
        metalness: 0.9,
    });
    const tireMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.85,
        metalness: 0.0,
    });
    const seatMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7,
        metalness: 0.0,
    });
    const handleMat = new THREE.MeshStandardMaterial({
        color: 0xcc3333,
        roughness: 0.6,
        metalness: 0.0,
    });

    // === Wheels ===
    function makeWheel(x, z) {
        const wGroup = new THREE.Group();
        wGroup.position.set(x, 0.35, z);

        // Tire (torus)
        const tireGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 24);
        const tire = new THREE.Mesh(tireGeo, tireMat);
        wGroup.add(tire);

        // Inner rim
        const rimGeo = new THREE.TorusGeometry(0.31, 0.015, 4, 24);
        const rim = new THREE.Mesh(rimGeo, chromeMat);
        wGroup.add(rim);

        // Hub
        const hubGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8);
        const hub = new THREE.Mesh(hubGeo, chromeMat);
        hub.rotation.x = Math.PI / 2;
        wGroup.add(hub);

        // Spokes (8 per wheel)
        const spokeMat = new THREE.MeshStandardMaterial({
            color: 0xbbbbbb,
            roughness: 0.3,
            metalness: 0.8,
        });
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.3, 3);
            const spoke = new THREE.Mesh(spokeGeo, spokeMat);
            spoke.position.set(0, Math.sin(angle) * 0.155, Math.cos(angle) * 0.155);
            spoke.rotation.x = angle;
            wGroup.add(spoke);
        }

        return wGroup;
    }

    const frontWheel = makeWheel(0.6, 0);
    const backWheel = makeWheel(-0.6, 0);
    bikeGroup.add(frontWheel, backWheel);

    // === Frame ===
    // Frame tube function
    function makeTube(start, end, radius = 0.015) {
        const dir = new THREE.Vector3().subVectors(
            new THREE.Vector3(...end),
            new THREE.Vector3(...start)
        );
        const len = dir.length();
        const geo = new THREE.CylinderGeometry(radius, radius, len, 6);
        const tube = new THREE.Mesh(geo, metalMat);

        tube.position.set(
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2,
            (start[2] + end[2]) / 2
        );

        // Orient tube along direction
        const axis = new THREE.Vector3(0, 1, 0);
        dir.normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(axis, dir);
        tube.quaternion.copy(quat);

        return tube;
    }

    // Main triangle
    bikeGroup.add(makeTube([-0.6, 0.35, 0], [0.15, 0.65, 0], 0.018)); // Seat tube (downward)
    bikeGroup.add(makeTube([0.15, 0.65, 0], [0.45, 0.55, 0], 0.018)); // Top tube
    bikeGroup.add(makeTube([-0.6, 0.35, 0], [0.45, 0.55, 0], 0.018)); // Down tube
    bikeGroup.add(makeTube([-0.6, 0.35, 0], [-0.3, 0.7, 0], 0.018)); // Seat stay
    bikeGroup.add(makeTube([-0.6, 0.35, 0], [0.15, 0.5, 0], 0.018)); // Chain stay
    bikeGroup.add(makeTube([0.45, 0.55, 0], [0.55, 0.35, 0], 0.018)); // Fork

    // === Seat ===
    const seatGeo = new THREE.BoxGeometry(0.18, 0.04, 0.12);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(-0.15, 0.73, 0);
    seat.rotation.z = -0.1;
    bikeGroup.add(seat);

    // Seat post
    const seatPostGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.15, 0.78, 0);
    bikeGroup.add(seatPost);

    // === Handlebars ===
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6);
    const stem = new THREE.Mesh(stemGeo, chromeMat);
    stem.position.set(0.48, 0.62, 0);
    stem.rotation.z = 0.2;
    bikeGroup.add(stem);

    // Handlebar (drop bar style)
    const hbGeo = new THREE.TorusGeometry(0.1, 0.012, 4, 12, Math.PI);
    const hb = new THREE.Mesh(hbGeo, metalMat);
    hb.position.set(0.52, 0.7, 0);
    hb.rotation.y = Math.PI / 2;
    hb.rotation.z = 0.3;
    bikeGroup.add(hb);

    // Handle grips
    for (let side of [-1, 1]) {
        const gripGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6);
        const grip = new THREE.Mesh(gripGeo, handleMat);
        grip.position.set(0.52, 0.75 + side * 0.06, side * 0.09);
        grip.rotation.x = Math.PI / 2;
        grip.rotation.z = side * 0.3;
        bikeGroup.add(grip);
    }

    // === Basket (车筐) ===
    const basketGroup = new THREE.Group();
    basketGroup.position.set(0.52, 0.55, 0);

    // Basket sides (wire mesh style)
    const basketMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.5,
        metalness: 0.6,
    });

    // Basket frame
    const basketFrameGeo = new THREE.BoxGeometry(0.3, 0.15, 0.2, 1, 1, 1);
    const basketWire = new THREE.WireframeGeometry(basketFrameGeo);
    const basket = new THREE.LineSegments(basketWire, new THREE.LineBasicMaterial({
        color: 0x444444,
    }));
    basket.position.y = 0.08;
    basketGroup.add(basket);

    // Basket bottom
    const basketBottomGeo = new THREE.BoxGeometry(0.28, 0.01, 0.18);
    const basketBottom = new THREE.Mesh(basketBottomGeo, basketMat);
    basketBottom.position.y = 0.01;
    basketGroup.add(basketBottom);

    // Basket support wires
    for (let side of [-1, 1]) {
        const supGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.15, 4);
        const sup = new THREE.Mesh(supGeo, chromeMat);
        sup.position.set(0, 0.075, side * 0.1);
        sup.rotation.x = 0.15;
        basketGroup.add(sup);
    }

    bikeGroup.add(basketGroup);

    // === Chain ===
    const chainGeo = new THREE.TorusGeometry(0.15, 0.005, 3, 12);
    const chainMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.4,
        metalness: 0.7,
    });
    const chain = new THREE.Mesh(chainGeo, chainMat);
    chain.position.set(-0.15, 0.35, 0.02);
    chain.rotation.y = Math.PI / 2;
    bikeGroup.add(chain);

    // Chain rings
    const ringGeo = new THREE.TorusGeometry(0.08, 0.008, 4, 12);
    const ring = new THREE.Mesh(ringGeo, chromeMat);
    ring.position.set(-0.3, 0.35, 0);
    ring.rotation.y = Math.PI / 2;
    bikeGroup.add(ring);

    // === Pedals ===
    for (let side of [-1, 1]) {
        const pedalGeo = new THREE.BoxGeometry(0.08, 0.015, 0.05);
        const pedal = new THREE.Mesh(pedalGeo, blackMetalMat);
        pedal.position.set(-0.15, 0.35 + side * 0.05, side * 0.06);
        bikeGroup.add(pedal);

        const crankGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 4);
        const crank = new THREE.Mesh(crankGeo, chromeMat);
        crank.position.set(-0.15, 0.35 + side * 0.025, 0);
        bikeGroup.add(crank);
    }

    // === Bicycle rack ===
    const rackGroup = new THREE.Group();
    rackGroup.position.set(14, 0, 0);

    // Rack base
    const rackBaseGeo = new THREE.BoxGeometry(2.0, 0.05, 0.3);
    const rackBaseMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.4,
        metalness: 0.6,
    });
    const rackBase = new THREE.Mesh(rackBaseGeo, rackBaseMat);
    rackBase.position.set(14, 0.025, 0);
    rackBase.castShadow = true;
    rackGroup.add(rackBase);

    // Inverted U-bars (3 racks)
    for (let i = 0; i < 3; i++) {
        const barGroup = new THREE.Group();
        barGroup.position.set(13.2 + i * 0.8, 0, 0);

        // Vertical legs
        for (let side of [-1, 1]) {
            const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6);
            const leg = new THREE.Mesh(legGeo, rackBaseMat);
            leg.position.set(side * 0.35, 0.3, 0);
            leg.castShadow = true;
            barGroup.add(leg);
        }

        // Top bar
        const topBarGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6);
        const topBar = new THREE.Mesh(topBarGeo, rackBaseMat);
        topBar.position.set(0, 0.6, 0);
        topBar.rotation.z = Math.PI / 2;
        topBar.castShadow = true;
        barGroup.add(topBar);

        // Curved top
        const curveGeo = new THREE.TorusGeometry(0.35, 0.015, 4, 12, Math.PI);
        const curve = new THREE.Mesh(curveGeo, rackBaseMat);
        curve.position.set(0, 0.6, 0);
        curve.rotation.y = Math.PI / 2;
        barGroup.add(curve);

        rackGroup.add(barGroup);
    }

    scene.add(bikeGroup);
    scene.add(rackGroup);
    return { bikeGroup, rackGroup };
}
