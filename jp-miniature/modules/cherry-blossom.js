// cherry-blossom.js - Cherry blossom trees with detailed branches and flowers
import * as THREE from 'three';

function createBranch(ctx, origin, dir, length, thickness, depth) {
    if (depth <= 0 || length < 0.1 || thickness < 0.005) return;

    const end = new THREE.Vector3().copy(origin).add(dir.clone().multiplyScalar(length));

    // Branch cylinder
    const geo = new THREE.CylinderGeometry(thickness * 0.7, thickness, length, 6);
    const branch = new THREE.Mesh(geo, ctx.branchMat);
    const mid = new THREE.Vector3().copy(origin).add(end).multiplyScalar(0.5);
    branch.position.copy(mid);
    branch.lookAt(end);
    branch.rotateX(Math.PI / 2);
    branch.castShadow = true;
    ctx.scene.add(branch);

    // Recurse with smaller branches
    const numBranches = depth > 3 ? 3 : 2;
    const spreadAngle = 0.5 + depth * 0.15;

    for (let i = 0; i < numBranches; i++) {
        const newDir = dir.clone();
        const angle = (i / numBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;

        // Rotate around Y axis
        newDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * 0.6);
        // Add upward bias
        newDir.y += 0.2;
        newDir.normalize();

        // Add some random spread
        newDir.x += (Math.random() - 0.5) * spreadAngle;
        newDir.y += (Math.random() - 0.5) * spreadAngle * 0.5;
        newDir.z += (Math.random() - 0.5) * spreadAngle;
        newDir.normalize();

        createBranch(ctx, end, newDir, length * 0.7, thickness * 0.65, depth - 1);
    }

    // Add flower clusters at tips
    if (depth <= 2) {
        addFlowerCluster(ctx, end, (2 - depth) * 0.3 + 0.15);
    }
}

function addFlowerCluster(ctx, position, size) {
    // Multiple small clusters around the branch tip
    const numClusters = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numClusters; i++) {
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * size * 1.5,
            (Math.random() - 0.5) * size,
            (Math.random() - 0.5) * size * 1.5
        );
        const clusterPos = new THREE.Vector3().copy(position).add(offset);
        const clusterSize = size * (0.4 + Math.random() * 0.3);

        // Flower sphere cluster
        const fGeo = new THREE.SphereGeometry(clusterSize, 8, 6);
        const shade = Math.random();
        let fColor;
        if (shade < 0.4) {
            fColor = new THREE.Color(0xffc0cb); // pink
        } else if (shade < 0.7) {
            fColor = new THREE.Color(0xffd1dc); // light pink
        } else if (shade < 0.9) {
            fColor = new THREE.Color(0xffe4e8); // very light pink
        } else {
            fColor = new THREE.Color(0xffffff); // white
        }

        const fMat = new THREE.MeshStandardMaterial({
            color: fColor,
            roughness: 0.6,
            metalness: 0.0,
        });
        const flower = new THREE.Mesh(fGeo, fMat);
        flower.position.copy(clusterPos);
        flower.castShadow = true;
        ctx.scene.add(flower);

        // Small individual petals around cluster
        if (clusterSize > 0.15) {
            for (let p = 0; p < 5; p++) {
                const petalGeo = new THREE.SphereGeometry(clusterSize * 0.5, 5, 4);
                const petal = new THREE.Mesh(petalGeo, fMat.clone());
                const pOffset = new THREE.Vector3(
                    (Math.random() - 0.5) * clusterSize * 1.2,
                    (Math.random() - 0.5) * clusterSize * 1.2,
                    (Math.random() - 0.5) * clusterSize * 1.2
                );
                petal.position.copy(clusterPos).add(pOffset);
                petal.scale.set(1, 0.6, 1);
                ctx.scene.add(petal);
            }
        }
    }
}

export function createCherryBlossomTree(scene, position, scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.copy(position);
    treeGroup.scale.setScalar(scale);

    // Trunk
    const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x4a3525,
        roughness: 0.85,
        metalness: 0.0,
    });

    // Main trunk
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.15, 2.0, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.0;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Trunk base / root flare
    const rootGeo = new THREE.SphereGeometry(0.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
    const root = new THREE.Mesh(rootGeo, trunkMat);
    root.position.y = 0.1;
    treeGroup.add(root);

    // Branch context
    const ctx = {
        scene: treeGroup,
        branchMat: trunkMat,
    };

    // Create main branches from trunk top
    const numMainBranches = 5;
    for (let i = 0; i < numMainBranches; i++) {
        const angle = (i / numMainBranches) * Math.PI * 2;
        const spread = 0.4 + Math.random() * 0.3;
        const dir = new THREE.Vector3(
            Math.cos(angle) * spread,
            0.7 + Math.random() * 0.3,
            Math.sin(angle) * spread
        ).normalize();

        createBranch(ctx, new THREE.Vector3(0, 2.0, 0), dir,
            1.2 + Math.random() * 0.5, 0.06, 5);
    }

    // Additional horizontal branches (Japanese cherry trees have characteristic spreading branches)
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + 0.5;
        const y = 1.0 + Math.random() * 1.0;
        const dir = new THREE.Vector3(
            Math.cos(angle) * 0.8,
            0.1 + Math.random() * 0.2,
            Math.sin(angle) * 0.8
        ).normalize();

        createBranch(ctx, new THREE.Vector3(0, y, 0), dir,
            1.5 + Math.random() * 0.5, 0.04, 4);
    }

    scene.add(treeGroup);
    return treeGroup;
}

export function createCherryBlossoms(scene) {
    const trees = [];

    // Large tree - main visual feature
    const tree1 = createCherryBlossomTree(scene, new THREE.Vector3(-15, 0, -5), 1.5);
    trees.push(tree1);

    // Medium tree - near convenience store
    const tree2 = createCherryBlossomTree(scene, new THREE.Vector3(14, 0, -6), 1.0);
    trees.push(tree2);

    // Tree near station platform
    const tree3 = createCherryBlossomTree(scene, new THREE.Vector3(-5, 0, 14), 1.2);
    trees.push(tree3);

    // Small tree near street corner
    const tree4 = createCherryBlossomTree(scene, new THREE.Vector3(-12, 0, 12), 0.8);
    trees.push(tree4);

    // Additional small tree
    const tree5 = createCherryBlossomTree(scene, new THREE.Vector3(16, 0, 10), 0.7);
    trees.push(tree5);

    return trees;
}
