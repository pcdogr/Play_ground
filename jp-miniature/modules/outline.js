// outline.js - Toon/cel-shading and outline post-processing
// Uses custom shaders compatible with three.js r170+
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Cel-shading (toon) shader for the main scene
const CelShader = {
    uniforms: {
        tDiffuse: { value: null },
        lightDir: { value: new THREE.Vector3(15, 25, 10).normalize() },
        numSteps: { value: 4.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 lightDir;
        uniform float numSteps;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            // Calculate NdotL
            float NdotL = dot(vWorldNormal, lightDir);

            // Step function for cel-shading bands
            float intensity = floor(NdotL * numSteps) / (numSteps - 1.0);

            // Mix lit and shadow tones
            vec3 litColor = color.rgb;
            vec3 shadowColor = color.rgb * 0.55;

            vec3 finalColor;

            if (NdotL > 0.0) {
                finalColor = mix(litColor * 0.75, litColor, intensity);
            } else {
                finalColor = shadowColor;
            }

            // Rim light effect
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            float rimFactor = 1.0 - max(dot(viewDir, vWorldNormal), 0.0);
            rimFactor = smoothstep(0.5, 1.0, rimFactor);
            finalColor += litColor * rimFactor * 0.15;

            gl_FragColor = vec4(finalColor, color.a);
        }
    `,
};

// Outline effect shader - renders inverted hull for black edge lines
const OutlineShader = {
    uniforms: {
        tDiffuse: { value: null },
        uOutlineThickness: { value: 1.2 },
        uOutlineColor: { value: new THREE.Color(0x1a1a1a) },
        uMainColorThreshold: { value: 0.1 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uOutlineThickness;
        uniform vec3 uOutlineColor;
        uniform float uMainColorThreshold;
        varying vec2 vUv;

        void main() {
            vec4 mainColor = texture2D(tDiffuse, vUv);

            // Sample neighbors to detect edges
            float texelSize = 1.0 / 1024.0;
            vec2 dir[8];
            dir[0] = vec2(0, texelSize);
            dir[1] = vec2(texelSize, texelSize);
            dir[2] = vec2(texelSize, 0);
            dir[3] = vec2(texelSize, -texelSize);
            dir[4] = vec2(0, -texelSize);
            dir[5] = vec2(-texelSize, -texelSize);
            dir[6] = vec2(-texelSize, 0);
            dir[7] = vec2(-texelSize, texelSize);

            float edge = 0.0;
            for (int i = 0; i < 8; i++) {
                vec4 neighbor = texture2D(tDiffuse, vUv + dir[i]);
                float diff = distance(mainColor.rgb, neighbor.rgb);
                if (diff > uMainColorThreshold) {
                    edge = 1.0;
                    break;
                }
            }

            // Also check depth discontinuity via brightness change
            float brightness = dot(mainColor.rgb, vec3(0.299, 0.587, 0.114));
            for (int i = 0; i < 8; i++) {
                vec4 neighbor = texture2D(tDiffuse, vUv + dir[i]);
                float nb = dot(neighbor.rgb, vec3(0.299, 0.587, 0.114));
                if (abs(brightness - nb) > uMainColorThreshold) {
                    edge = 1.0;
                    break;
                }
            }

            // Mix outline with main color
            vec3 result = mix(mainColor.rgb, uOutlineColor, edge * 0.85);

            gl_FragColor = vec4(result, mainColor.a);
        }
    `,
};

// Color grading pass (anime-like warm/spring tone)
const ColorGradeShader = {
    uniforms: {
        tDiffuse: { value: null },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            // Warm color grading - spring day feel
            color.r = pow(color.r, 0.95) * 1.02;
            color.g = pow(color.g, 0.98) * 1.0;
            color.b = pow(color.b, 1.02) * 0.98;

            // Slight desaturation then boost of warm tones
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            vec3 desat = vec3(gray);
            color.rgb = mix(desat, color.rgb, 0.88);

            // Subtle vignette
            float dist = distance(vUv, vec2(0.5));
            float vignette = smoothstep(0.7, 0.35, dist);
            color.rgb = mix(color.rgb * 0.8, color.rgb, vignette);

            gl_FragColor = vec4(color.rgb, color.a);
        }
    `,
};

// Inverted Hull outline approach - adds outline geometry behind objects
export function addOutlineToMesh(mesh, outlineColor = 0x1a1a1a, thickness = 0.015) {
    if (!mesh.geometry) return null;

    const outlineMat = new THREE.ShadowMaterial({
        opacity: 0.6,
        color: outlineColor,
    });

    // Create a slightly larger version of the mesh for outline
    const outlineGeo = mesh.geometry.clone();
    // Scale up slightly
    outlineGeo.scale(1.0 + thickness / Math.max(
        mesh.geometry.parameters?.width || 1,
        mesh.geometry.parameters?.height || 1,
        mesh.geometry.parameters?.depth || 1,
        0.5
    ));

    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    outlineMesh.position.copy(mesh.position);
    outlineMesh.rotation.copy(mesh.rotation);
    outlineMesh.scale.copy(mesh.scale);
    outlineMesh.visible = true;

    return outlineMesh;
}

export function setupToonRendering(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);

    // 1. Render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 2. Cel-shading pass
    const celPass = new ShaderPass(CelShader);
    composer.addPass(celPass);

    // 3. Edge/outline detection pass
    const outlinePass = new ShaderPass(OutlineShader);
    composer.addPass(outlinePass);

    // 4. Color grading pass
    const colorGradePass = new ShaderPass(ColorGradeShader);
    composer.addPass(colorGradePass);

    // 5. Output pass (tone mapping / color space)
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    return { composer, outlinePass, celPass };
}

// Apply toon-friendly materials
export function applyToonMaterial(objectGroup) {
    if (!objectGroup) return;

    objectGroup.traverse((child) => {
        if (child.isMesh) {
            if (child.material) {
                const mat = child.material;
                if (mat.metalness !== undefined && mat.metalness < 0.5) {
                    mat.roughness = Math.min(mat.roughness + 0.1, 0.9);
                }
            }
        }
    });
}

export function registerOutlineTargets(/* unused with new approach */) {
    // Edge detection is now shader-based, no need to register targets
}
