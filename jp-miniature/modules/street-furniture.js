// street-furniture.js - Street lamps, convex mirror, bulletin board, trash cans, post box
import * as THREE from 'three';

function metalMat(c = 0x444444) {
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.75 });
}
function woodMat(c = 0x7a5a3a) {
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0.0 });
}

export function createStreetFurniture(scene) {
    const sfGroup = new THREE.Group();

    // ===== Street lamps (2) =====
    const lampPositions = [
        { x: -17, z: -8 },
        { x: -17, z: 5 },
    ];
    for (const pos of lampPositions) {
        const lampGroup = new THREE.Group();
        lampGroup.position.set(pos.x, 0, pos.z);

        // Lamp pole
        const poleGeo = new THREE.CylinderGeometry(0.04, 0.06, 4.5, 8);
        const pole = new THREE.Mesh(poleGeo, metalMat(0x333333));
        pole.position.y = 2.25;
        pole.castShadow = true;
        lampGroup.add(pole);

        // Lamp arm (curved)
        const armGeo = new THREE.CylinderGeometry(0.025, 0.03, 1.0, 6);
        const arm = new THREE.Mesh(armGeo, metalMat(0x333333));
        arm.position.set(0.3, 4.5, 0);
        arm.rotation.z = -0.8;
        arm.castShadow = true;
        lampGroup.add(arm);

        // Lamp shade
        const shadeGeo = new THREE.ConeGeometry(0.2, 0.25, 8, 1, true);
        const shade = new THREE.Mesh(shadeGeo, metalMat(0x222222));
        shade.position.set(0.6, 4.7, 0);
        shade.rotation.x = Math.PI;
        lampGroup.add(shade);

        // Lamp bulb (warm glow)
        const bulbGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xffeeaa,
            emissive: 0xffdd88,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9,
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0.6, 4.55, 0);
        lampGroup.add(bulb);

        // Lamp base
        const baseGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.1, 8);
        const base = new THREE.Mesh(baseGeo, metalMat(0x333333));
        base.position.y = 0.05;
        lampGroup.add(base);

        sfGroup.add(lampGroup);
    }

    // ===== Convex safety mirror (街角凸面镜) =====
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(-10, 0, -3);

    // Mirror pole
    const mPoleGeo = new THREE.CylinderGeometry(0.025, 0.03, 2.5, 6);
    const mPole = new THREE.Mesh(mPoleGeo, metalMat());
    mPole.position.y = 1.25;
    mPole.castShadow = true;
    mirrorGroup.add(mPole);

    // Mirror housing
    const housingGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16);
    const housing = new THREE.Mesh(housingGeo, metalMat(0xeeeeee));
    housing.position.set(0, 2.6, 0);
    housing.rotation.x = Math.PI / 2;
    housing.castShadow = true;
    mirrorGroup.add(housing);

    // Mirror glass (convex)
    const mirrorGeo = new THREE.SphereGeometry(0.23, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const mirrorMat = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        roughness: 0.05,
        metalness: 0.9,
        side: THREE.DoubleSide,
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 2.6, 0);
    mirror.rotation.x = -Math.PI / 2;
    mirrorGroup.add(mirror);

    sfGroup.add(mirrorGroup);

    // ===== Wooden bulletin board (公告板) =====
    const boardGroup = new THREE.Group();
    boardGroup.position.set(10, 0, -8);

    // Board frame
    const frameMat = woodMat(0x6b5030);
    // Back board
    const backBoardGeo = new THREE.BoxGeometry(1.6, 2.0, 0.08);
    const backBoard = new THREE.Mesh(backBoardGeo, frameMat);
    backBoard.position.y = 1.8;
    backBoard.castShadow = true;
    backBoard.receiveShadow = true;
    boardGroup.add(backBoard);

    // Frame border
    const frameTopGeo = new THREE.BoxGeometry(1.7, 0.08, 0.1);
    const frameTop = new THREE.Mesh(frameTopGeo, frameMat);
    frameTop.position.set(0, 2.84, 0);
    boardGroup.add(frameTop);
    const frameBot = new THREE.Mesh(frameTopGeo, frameMat);
    frameBot.position.set(0, 0.76, 0);
    boardGroup.add(frameBot);

    // Support legs
    for (let side of [-1, 1]) {
        const legGeo = new THREE.CylinderGeometry(0.03, 0.04, 2.0, 6);
        const leg = new THREE.Mesh(legGeo, frameMat);
        leg.position.set(side * 0.7, 1.0, -0.1);
        leg.rotation.x = -0.05;
        leg.castShadow = true;
        boardGroup.add(leg);
    }

    // Posters on board
    const posterColors = [0xff6666, 0x66ff66, 0x6666ff, 0xffcc44, 0xff88cc, 0x88ccff];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const posterGeo = new THREE.PlaneGeometry(0.6, 0.7);
            const posterMat = new THREE.MeshStandardMaterial({
                color: posterColors[row * 2 + col],
                roughness: 0.8,
                side: THREE.DoubleSide,
            });
            const poster = new THREE.Mesh(posterGeo, posterMat);
            poster.position.set(-0.4 + col * 0.8, 1.5 + row * 0.85, 0.05);
            boardGroup.add(poster);

            // Text marks on poster
            for (let t = 0; t < 3; t++) {
                const tGeo = new THREE.BoxGeometry(0.3, 0.04, 0.01);
                const tMesh = new THREE.Mesh(tGeo, new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.7,
                }));
                tMesh.position.set(-0.4 + col * 0.8, 1.75 + row * 0.85 - t * 0.1, 0.06);
                boardGroup.add(tMesh);
            }
        }
    }

    sfGroup.add(boardGroup);

    // ===== Trash cans (分类垃圾桶 - 2 sets) =====
    const trashPositions = [
        { x: 11, z: -6 },
        { x: 15, z: -4 },
    ];
    for (const tpos of trashPositions) {
        const trashGroup = new THREE.Group();
        trashGroup.position.set(tpos.x, 0, tpos.z);

        // 3 bins in a row (burnable, non-burnable, recyclable)
        const binColors = [0x2266cc, 0x22aa44, 0xcc3333];
        const binLabels = [0x4488ff, 0x44cc66, 0xff5555];
        for (let i = 0; i < 3; i++) {
            const binGroup = new THREE.Group();
            binGroup.position.x = (i - 1) * 0.6;

            // Bin body
            const binGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.8, 10);
            const binMat = new THREE.MeshStandardMaterial({
                color: binColors[i],
                roughness: 0.5,
                metalness: 0.15,
            });
            const bin = new THREE.Mesh(binGeo, binMat);
            bin.position.y = 0.4;
            bin.castShadow = true;
            binGroup.add(bin);

            // Bin lid
            const lidGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 10);
            const lid = new THREE.Mesh(lidGeo, binMat);
            lid.position.y = 0.82;
            lid.castShadow = true;
            binGroup.add(lid);

            // Label stripe
            const labelGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.1, 10, 1, true);
            const label = new THREE.Mesh(labelGeo, new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.6,
                side: THREE.DoubleSide,
            }));
            label.position.y = 0.5;
            binGroup.add(label);

            trashGroup.add(binGroup);
        }

        sfGroup.add(trashGroup);
    }

    // ===== Red post box (红色邮筒) =====
    const postBoxGroup = new THREE.Group();
    postBoxGroup.position.set(3, 0, 6);

    // Main cylinder body
    const pbBodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12);
    const pbMat = new THREE.MeshStandardMaterial({
        color: 0xcc2200,
        roughness: 0.4,
        metalness: 0.3,
    });
    const pbBody = new THREE.Mesh(pbBodyGeo, pbMat);
    pbBody.position.y = 0.6;
    pbBody.castShadow = true;
    postBoxGroup.add(pbBody);

    // Dome top
    const pbTopGeo = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const pbTop = new THREE.Mesh(pbTopGeo, pbMat);
    pbTop.position.y = 1.2;
    pbTop.castShadow = true;
    postBoxGroup.add(pbTop);

    // Crown ornament
    const crownGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.12, 8);
    const crownMat = new THREE.MeshStandardMaterial({
        color: 0xddaa00,
        roughness: 0.3,
        metalness: 0.8,
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.y = 1.46;
    postBoxGroup.add(crown);

    // Mail slot
    const slotGeo = new THREE.BoxGeometry(0.15, 0.02, 0.06);
    const slot = new THREE.Mesh(slotGeo, metalMat(0x222222));
    slot.position.set(0, 0.9, 0.2);
    postBoxGroup.add(slot);

    // Base pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.2, 10);
    const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x777777,
        roughness: 0.6,
        metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.1;
    pedestal.castShadow = true;
    postBoxGroup.add(pedestal);

    // White label band
    const bandGeo = new THREE.CylinderGeometry(0.215, 0.215, 0.15, 12, 1, true);
    const bandMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        side: THREE.DoubleSide,
    });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 0.5;
    postBoxGroup.add(band);

    sfGroup.add(postBoxGroup);

    scene.add(sfGroup);
    return sfGroup;
}
