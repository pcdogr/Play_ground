// railroad.js - Train tracks, sleepers, railroad crossing with barrier and signals
import * as THREE from 'three';

export function createRailroad(scene) {
    const rrGroup = new THREE.Group();

    // Materials
    const steelMat = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.3,
        metalness: 0.9,
        envMapIntensity: 1.0,
    });

    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x6b4226,
        roughness: 0.85,
        metalness: 0.0,
    });

    const gravelMat = new THREE.MeshStandardMaterial({
        color: 0x8a8078,
        roughness: 0.95,
        metalness: 0.0,
    });

    // ===== Track bed (ballast/gravel) =====
    const ballastGeo = new THREE.BoxGeometry(4, 0.1, 40);
    const ballast = new THREE.Mesh(ballastGeo, gravelMat);
    ballast.position.set(-13, 0.05, 10);
    ballast.receiveShadow = true;
    rrGroup.add(ballast);

    // ===== Sleepers (枕木) =====
    const sleeperCount = 60;
    const sleeperSpacing = 0.6;
    const startZ = -10;
    for (let i = 0; i < sleeperCount; i++) {
        const sleeperGeo = new THREE.BoxGeometry(2.5, 0.12, 0.15);
        const sleeper = new THREE.Mesh(sleeperGeo, woodMat);
        sleeper.position.set(-13, 0.12, startZ + i * sleeperSpacing);
        sleeper.castShadow = true;
        sleeper.receiveShadow = true;
        rrGroup.add(sleeper);
    }

    // ===== Rails =====
    // Two parallel rails along Z axis
    for (let side of [-1, 1]) {
        // Rail head - I-beam shape using two boxes
        const railHeadGeo = new THREE.BoxGeometry(0.08, 0.08, 40);
        const railHead = new THREE.Mesh(railHeadGeo, steelMat);
        railHead.position.set(-13 + side * 0.72, 0.2, 10);
        railHead.castShadow = true;
        rrGroup.add(railHead);

        // Rail base plate
        const railBaseGeo = new THREE.BoxGeometry(0.2, 0.04, 40);
        const railBase = new THREE.Mesh(railBaseGeo, steelMat);
        railBase.position.set(-13 + side * 0.72, 0.14, 10);
        rrGroup.add(railBase);
    }

    // ===== Railroad crossing (平交道口) =====
    // Crossing platform at Z = -5 (intersection with street)
    const crossingZ = -5;

    // Crossing surface - concrete slab over tracks
    const crossingGeo = new THREE.BoxGeometry(6, 0.08, 3);
    const crossingMat = new THREE.MeshStandardMaterial({
        color: 0x999999,
        roughness: 0.8,
        metalness: 0.0,
    });
    const crossing = new THREE.Mesh(crossingGeo, crossingMat);
    crossing.position.set(-13, 0.22, crossingZ);
    crossing.receiveShadow = true;
    crossing.castShadow = true;
    rrGroup.add(crossing);

    // Striped crossing pattern (black and white)
    for (let i = 0; i < 10; i++) {
        const stripeColor = i % 2 === 0 ? 0xffffff : 0x222222;
        const stripeGeo = new THREE.BoxGeometry(6, 0.01, 0.28);
        const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshStandardMaterial({
            color: stripeColor,
            roughness: 0.7,
        }));
        stripe.position.set(-13, 0.265, crossingZ - 1.3 + i * 0.28);
        rrGroup.add(stripe);
    }

    // ===== Crossing barrier arms =====
    const barrierMat = new THREE.MeshStandardMaterial({
        color: 0xcc2222,
        roughness: 0.5,
        metalness: 0.1,
    });
    const barrierWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1,
    });

    for (let side of [-1, 1]) {
        // Barrier post
        const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5, 8);
        const postMat = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.4,
            metalness: 0.7,
        });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(-13 + side * 3.5, 1.25, crossingZ);
        post.castShadow = true;
        rrGroup.add(post);

        // Barrier arm - horizontal (open position)
        const armGroup = new THREE.Group();
        armGroup.position.set(-13 + side * 3.5, 2.4, crossingZ);

        // Main arm body
        const armGeo = new THREE.BoxGeometry(0.12, 0.12, 5);
        const arm = new THREE.Mesh(armGeo, barrierMat);
        arm.position.set(0, 0, -side * 2.5);
        arm.castShadow = true;
        armGroup.add(arm);

        // White stripes on arm
        for (let i = 0; i < 5; i++) {
            const wStripeGeo = new THREE.BoxGeometry(0.14, 0.14, 0.5);
            const wStripe = new THREE.Mesh(wStripeGeo, barrierWhiteMat);
            wStripe.position.set(0, 0, -side * (1.5 + i * 0.9));
            armGroup.add(wStripe);
        }

        // Red light at end of arm
        const armLightGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const armLightMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.2,
            metalness: 0.3,
            emissive: 0xff2200,
            emissiveIntensity: 0.5,
        });
        const armLight = new THREE.Mesh(armLightGeo, armLightMat);
        armLight.position.set(0, 0, -side * 5);
        armGroup.add(armLight);

        rrGroup.add(armGroup);
    }

    // ===== Railroad signal lights =====
    // Signal post with red/yellow/green lights
    for (let side of [-1, 1]) {
        const signalX = -13 + side * 3.5;
        const signalZ = crossingZ + side * 3;

        // Signal pole
        const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 3, 8);
        const poleMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.4,
            metalness: 0.6,
        });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(signalX, 1.5, signalZ);
        pole.castShadow = true;
        rrGroup.add(pole);

        // Signal housing
        const housingGeo = new THREE.BoxGeometry(0.3, 1, 0.2);
        const housingMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.3,
            metalness: 0.5,
        });
        const housing = new THREE.Mesh(housingGeo, housingMat);
        housing.position.set(signalX, 2.8, signalZ);
        housing.castShadow = true;
        rrGroup.add(housing);

        // Traffic lights (red, yellow, green)
        const lightColors = [0xff0000, 0xffaa00, 0x00cc00];
        const emissiveColors = [0xff2200, 0xff8800, 0x00ff00];
        for (let i = 0; i < 3; i++) {
            const lightGeo = new THREE.CircleGeometry(0.08, 12);
            const lightMat = new THREE.MeshStandardMaterial({
                color: lightColors[i],
                emissive: emissiveColors[i],
                emissiveIntensity: i === 0 ? 1.0 : 0.1,
                roughness: 0.2,
                metalness: 0.3,
                side: THREE.DoubleSide,
            });
            const light = new THREE.Mesh(lightGeo, lightMat);
            light.position.set(signalX + (side > 0 ? -0.11 : 0.11), 3.0 - i * 0.35, signalZ);
            rrGroup.add(light);
        }
    }

    // ===== Crossing warning sign =====
    const signPostGeo = new THREE.CylinderGeometry(0.03, 0.03, 2, 6);
    const signPostMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.5,
        metalness: 0.5,
    });

    for (let side of [-1, 1]) {
        const signPost = new THREE.Mesh(signPostGeo, signPostMat);
        signPost.position.set(-13 + side * 5, 1, crossingZ);
        signPost.castShadow = true;
        rrGroup.add(signPost);

        // Crossbuck sign (X shape)
        const crossbuckGroup = new THREE.Group();
        const plankGeo = new THREE.BoxGeometry(0.05, 0.6, 0.5);
        const plankMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.6,
        });
        const plank1 = new THREE.Mesh(plankGeo, plankMat);
        plank1.rotation.z = Math.PI / 4;
        const plank2 = new THREE.Mesh(plankGeo, plankMat);
        plank2.rotation.z = -Math.PI / 4;
        crossbuckGroup.add(plank1, plank2);
        crossbuckGroup.position.set(-13 + side * 5, 2.1, crossingZ);
        crossbuckGroup.castShadow = true;
        rrGroup.add(crossbuckGroup);
    }

    scene.add(rrGroup);
    return rrGroup;
}
