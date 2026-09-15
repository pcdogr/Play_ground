// petal-particles.js - Falling cherry blossom petal particle system
import * as THREE from 'three';

export function createPetalParticles(scene) {
    const petalCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(petalCount * 3);
    const colors = new Float32Array(petalCount * 3);
    const sizes = new Float32Array(petalCount);
    const velocities = new Float32Array(petalCount * 3);
    const rotations = new Float32Array(petalCount);

    // Pink color palette
    const petalColors = [
        new THREE.Color(0xffc0cb),
        new THREE.Color(0xffd1dc),
        new THREE.Color(0xffe4e8),
        new THREE.Color(0xffb6c1),
        new THREE.Color(0xffe6ea),
    ];

    for (let i = 0; i < petalCount; i++) {
        // Spread petals across the scene area
        positions[i * 3] = (Math.random() - 0.5) * 38;
        positions[i * 3 + 1] = Math.random() * 10 + 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 38;

        const col = petalColors[Math.floor(Math.random() * petalColors.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;

        sizes[i] = 0.1 + Math.random() * 0.15;

        // Wind velocity (gentle breeze)
        velocities[i * 3] = (Math.random() - 0.3) * 0.02;
        velocities[i * 3 + 1] = -0.005 - Math.random() * 0.01;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

        rotations[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for petal shape
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: createPetalTexture() },
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uTime;

            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
                vAlpha = smoothstep(0.0, 2.0, position.y) * smoothstep(12.0, 8.0, position.y);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            uniform sampler2D uTexture;

            void main() {
                vec4 texColor = texture2D(uTexture, gl_PointCoord);
                if (texColor.a < 0.3) discard;
                gl_FragColor = vec4(vColor, vAlpha * texColor.a * 0.85);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Ground petal clusters (accumulated petals)
    createGroundPetals(scene);

    return {
        mesh: particles,
        velocities,
        positions: geometry.attributes.position.array,
        count: petalCount,
        material,
    };
}

function createPetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Draw a petal shape
    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = 'white';
    ctx.beginPath();

    // Petal shape - oval with point
    ctx.moveTo(32, 50);
    ctx.bezierCurveTo(10, 40, 10, 15, 25, 10);
    ctx.bezierCurveTo(28, 5, 36, 5, 39, 10);
    ctx.bezierCurveTo(54, 15, 54, 40, 32, 50);

    ctx.fill();

    // Slight center line
    ctx.strokeStyle = 'rgba(255, 200, 200, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, 50);
    ctx.lineTo(32, 15);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function createGroundPetals(scene) {
    const groundGroup = new THREE.Group();
    const petalMat = new THREE.MeshStandardMaterial({
        color: 0xffd1dc,
        roughness: 0.7,
        metalness: 0.0,
    });

    // Scattered petal clusters on ground
    for (let i = 0; i < 30; i++) {
        const clusterSize = 0.5 + Math.random() * 1.5;
        const cx = (Math.random() - 0.5) * 30;
        const cz = (Math.random() - 0.5) * 30;

        for (let j = 0; j < 8; j++) {
            const pGeo = new THREE.PlaneGeometry(0.08, 0.12);
            const p = new THREE.Mesh(pGeo, petalMat);
            p.position.set(
                cx + (Math.random() - 0.5) * clusterSize,
                0.03,
                cz + (Math.random() - 0.5) * clusterSize
            );
            p.rotation.x = -Math.PI / 2;
            p.rotation.z = Math.random() * Math.PI;
            p.receiveShadow = true;
            groundGroup.add(p);
        }
    }

    scene.add(groundGroup);
    return groundGroup;
}

// Animation update function
export function updatePetals(petals, time, deltaTime) {
    if (!petals) return;

    const pos = petals.positions;
    const vel = petals.velocities;
    const count = petals.count;

    for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // Apply wind sway
        const windX = Math.sin(time * 0.5 + pos[iz] * 0.3) * 0.003;
        const windZ = Math.cos(time * 0.4 + pos[ix] * 0.2) * 0.002;

        pos[ix] += vel[ix] + windX;
        pos[iy] += vel[iy];
        pos[iz] += vel[iz] + windZ;

        // Reset fallen petals
        if (pos[iy] < 0.05) {
            pos[ix] = (Math.random() - 0.5) * 38;
            pos[iy] = 8 + Math.random() * 4;
            pos[iz] = (Math.random() - 0.5) * 38;
        }

        // Keep within bounds
        if (Math.abs(pos[ix]) > 20) pos[ix] *= -0.9;
        if (Math.abs(pos[iz]) > 20) pos[iz] *= -0.9;
    }

    petals.mesh.geometry.attributes.position.needsUpdate = true;
    petals.material.uniforms.uTime.value = time;
}
