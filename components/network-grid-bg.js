import * as THREE from 'three';

class NetworkGridBg extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.isPaused = false;
        this.time = 0;
        this.animationId = null;
        this._isInitialized = false;
        this._observer = null;

        this.config = {
            spacing: 20,
            rotationX: -60.48,
            rotationY: 2.88,
            rotationZ: -134.28,
            gridZ: 20,
            maxLift: 3,
            speed: 0.3,
            offsetY: -50,
            offsetX: -100,
            gridWidth: 25,
            gridHeight: 15,
            gridPosX: 16.4,
            gridPosZ: 65,
            lineWidth: 2,
            lineBrightness: 0.3,
            coreBrightness: 3.0,
            dotSize: 100.0,
            coreSize: 0.15,
            coreSharpness: 24.0,
            glowSize: 0.55,
            glowSharpness: 3.0,
            redGlowIntensity: 0.5,
            baseColor: '#da0404',
            maskRadius: 110,
            maskFeather: 40,
            maskCenterX: -50,
            maskCenterY: 0,
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.points = null;
        this.lines = null;
        this.resizeObserver = null;
        this.linePositions = null;
        this.lineColors = null;
        this.phases = [];
        this.isHotArr = [];
    }

    hexToRgb(hex) {
        if (!hex || typeof hex !== 'string') return { r: 0.9, g: 0.067, b: 0.125 };
        const cleanHex = hex.replace('#', '');
        if (cleanHex.length !== 6) return { r: 0.9, g: 0.067, b: 0.125 };
        return {
            r: parseInt(cleanHex.substring(0, 2), 16) / 255,
            g: parseInt(cleanHex.substring(2, 4), 16) / 255,
            b: parseInt(cleanHex.substring(4, 6), 16) / 255
        };
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 0;
                    background: transparent;
                    overflow: hidden;
                }
                canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            </style>
            <canvas id="grid-canvas"></canvas>
        `;

        this._observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this._isInitialized) {
                this._isInitialized = true;
                this._observer.disconnect();
                
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => this._heavyInit(), { timeout: 1000 });
                } else {
                    setTimeout(() => this._heavyInit(), 100);
                }
            }
        }, { rootMargin: '300px' });

        this._observer.observe(this);
    }

    _heavyInit() {
        this.initThreeJS();
        this.createGrid();
        this.renderFrame();
        if (!this.isPaused) this.startAnimation();

        let resizeTimeout;
        this.resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.onResize(), 150);
        });
        this.resizeObserver.observe(this);
    }

    initThreeJS() {
        const canvas = this.shadowRoot.getElementById('grid-canvas');
        const rect = this.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        this.scene = new THREE.Scene();
        const bgColor = new THREE.Color('#0D0D0F');
        this.scene.background = bgColor;
        this.scene.fog = new THREE.FogExp2(bgColor, 0.002);

        this.camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 2000);
        this.camera.position.set(0, 0, 150);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.renderer.setSize(rect.width, rect.height);
        
        const dpr = window.devicePixelRatio;
        const limit = window.innerWidth > 1200 ? 1.25 : 1.5;
        this.renderer.setPixelRatio(Math.min(dpr, limit));
    }

    createGrid() {
        const { spacing, gridWidth, gridHeight, offsetX, offsetY, gridZ } = this.config;
        const count = gridWidth * gridHeight;
        
        const positions = new Float32Array(count * 3);
        this.phases = new Float32Array(count);
        this.isHotArr = new Float32Array(count);

        const startX = -(gridWidth * spacing) / 2 + offsetX;
        const startY = -(gridHeight * spacing) / 2 + offsetY;

        for (let i = 0; i < count; i++) {
            positions[i * 3] = startX + (i % gridWidth) * spacing;
            positions[i * 3 + 1] = startY + Math.floor(i / gridWidth) * spacing;
            positions[i * 3 + 2] = gridZ;
            
            const seed = Math.floor(i / gridWidth) * 12.9898 + (i % gridWidth) * 78.233;
            this.phases[i] = Math.abs(Math.sin(seed) * 43758.5453) % 1;
            this.isHotArr[i] = this.phases[i] > 0.85 ? 1.0 : 0.0;
        }

        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointGeometry.setAttribute('aRandomPhase', new THREE.BufferAttribute(this.phases, 1));
        pointGeometry.setAttribute('aIsHot', new THREE.BufferAttribute(this.isHotArr, 1));

        const rgb = this.hexToRgb(this.config.baseColor);

        const pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: this.config.speed },
                uBaseSize: { value: this.config.dotSize },
                uMaxLift: { value: this.config.maxLift },
                uCoreBrightness: { value: this.config.coreBrightness },
                uColorR: { value: rgb.r },
                uColorG: { value: rgb.g },
                uColorB: { value: rgb.b },
                uCoreSize: { value: this.config.coreSize },
                uCoreSharpness: { value: this.config.coreSharpness },
                uGlowSize: { value: this.config.glowSize },
                uGlowSharpness: { value: this.config.glowSharpness },
                uRedGlowIntensity: { value: this.config.redGlowIntensity },
                uMaskRadius: { value: this.config.maskRadius },
                uMaskFeather: { value: this.config.maskFeather },
                uMaskCenter: { value: new THREE.Vector2(this.config.maskCenterX, this.config.maskCenterY) }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uSpeed;
                uniform float uBaseSize;
                uniform float uMaxLift;
                uniform float uMaskRadius;
                uniform float uMaskFeather;
                uniform vec2 uMaskCenter;
                attribute float aRandomPhase;
                attribute float aIsHot;
                varying float vIntensity;
                varying float vIsHot;
                varying float vMask;
                
                void main() {
                    float cycleDuration = 10.0;
                    float flashDuration = 3.0;
                    float pauseDuration = cycleDuration - flashDuration;
                    float t = mod(uTime * uSpeed + aRandomPhase * 100.0, cycleDuration);
                    
                    float intensity = 0.2;
                    float lift = 0.0;
                    float sizeMult = 0.8;
                    
                    if (t > pauseDuration) {
                        float progress = (t - pauseDuration) / flashDuration;
                        float heightFactor = sin(progress * 3.14159);
                        lift = heightFactor * uMaxLift;
                        intensity = 0.2 + 0.8 * heightFactor;
                        sizeMult = 0.8 + 0.4 * heightFactor;
                    }
                    if (aIsHot > 0.5) intensity = min(1.0, intensity * 1.3);
                    
                    vIntensity = intensity;
                    vIsHot = aIsHot;
                    
                    float dist = length(position.xy - uMaskCenter);
                    vMask = smoothstep(uMaskRadius, uMaskRadius - uMaskFeather, dist);
                    
                    vec3 newPos = position + vec3(0.0, 0.0, lift);
                    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    if (vMask < 0.01) {
                        gl_PointSize = 0.0;
                    } else {
                        gl_PointSize = ceil(uBaseSize * sizeMult * (200.0 / -mvPosition.z));
                    }
                }
            `,
            fragmentShader: `
                uniform float uCoreBrightness;
                uniform float uColorR;
                uniform float uColorG;
                uniform float uColorB;
                uniform float uCoreSize;
                uniform float uCoreSharpness;
                uniform float uGlowSize;
                uniform float uGlowSharpness;
                uniform float uRedGlowIntensity;
                varying float vIntensity;
                varying float vIsHot;
                varying float vMask;
                
                void main() {
                    vec2 coord = gl_PointCoord - 0.5;
                    float dist = length(coord);
                    if (dist > 0.5) discard;
                    
                    float coreFactor = max(0.0, 1.0 - (dist / uCoreSize));
                    float core = pow(coreFactor, uCoreSharpness) * vIntensity * uCoreBrightness;
                    
                    float glowFactor = max(0.0, 1.0 - (dist / uGlowSize));
                    float redGlow = pow(glowFactor, uGlowSharpness) * vIntensity * uRedGlowIntensity;
                    
                    float outerGlowFactor = max(0.0, 1.0 - (dist / (uGlowSize * 1.5)));
                    float outerGlow = pow(outerGlowFactor, 4.0) * vIntensity * uRedGlowIntensity * 0.3;
                    
                    vec3 colorCore = vec3(1.0, 1.0, 1.0);
                    vec3 colorRed = vec3(uColorR, uColorG, uColorB);
                    
                    vec3 finalColor = colorCore * core;
                    finalColor += colorRed * redGlow;
                    finalColor += colorRed * outerGlow;
                    
                    if (vIsHot > 0.5) {
                        finalColor += colorRed * 0.2 * vIntensity;
                    }
                    
                    float alpha = (core + redGlow + outerGlow) * 1.5 * vMask;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            alphaTest: 0.05,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(pointGeometry, pointMaterial);
        this.points.renderOrder = 0;
        this.applyRotations();
        this.scene.add(this.points);

        this.createLines(startX, startY, spacing, gridWidth, gridHeight);
    }

    createLines(startX, startY, spacing, w, h) {
        let lineCount = (w * (h - 1)) + ((w - 1) * h) + (w * 2) + (h * 2);
        this.linePositions = new Float32Array(lineCount * 6);
        this.lineColors = new Float32Array(lineCount * 6);
        
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));
        
        const lineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uMaskRadius: { value: this.config.maskRadius },
                uMaskFeather: { value: this.config.maskFeather },
                uMaskCenter: { value: new THREE.Vector2(this.config.maskCenterX, this.config.maskCenterY) },
                uLineBrightness: { value: this.config.lineBrightness }
            },
            vertexShader: `
                uniform float uMaskRadius;
                uniform float uMaskFeather;
                uniform vec2 uMaskCenter;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vMask;

                void main() {
                    vColor = color;
                    float dist = length(position.xy - uMaskCenter);
                    vMask = smoothstep(uMaskRadius, uMaskRadius - uMaskFeather, dist);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vMask;
                uniform float uLineBrightness;
                void main() {
                    vec3 brightColor = vColor * (1.0 + uLineBrightness);
                    gl_FragColor = vec4(brightColor, 0.95 * vMask);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.lines.renderOrder = 1;
        this.applyRotations();
        this.scene.add(this.lines);
    }

    applyRotations() {
        const rad = Math.PI / 180;
        const rx = this.config.rotationX * rad;
        const ry = this.config.rotationY * rad;
        const rz = this.config.rotationZ * rad;

        if (this.points) this.points.rotation.set(rx, ry, rz);
        if (this.lines) this.lines.rotation.set(rx, ry, rz);
    }

    getPointLift(index) {
        const t = (this.time * this.config.speed + this.phases[index] * 100.0) % 10.0;
        if (t > 7.0) {
            return Math.sin(((t - 7.0) / 3.0) * Math.PI) * this.config.maxLift;
        }
        return 0.0;
    }

    getPointIntensity(index) {
        const t = (this.time * this.config.speed + this.phases[index] * 100.0) % 10.0;
        if (t > 7.0) {
            let intensity = 0.2 + 0.8 * Math.sin(((t - 7.0) / 3.0) * Math.PI);
            return this.isHotArr[index] > 0.5 ? Math.min(1.0, intensity * 1.3) : intensity;
        }
        return 0.2;
    }

    updateLines() {
        if (!this.lines) return;
        const { spacing, gridWidth, gridHeight, gridZ } = this.config;
        const positions = this.lines.geometry.attributes.position.array;
        const colors = this.lines.geometry.attributes.color.array;
        let idx = 0;

        const rgb = this.hexToRgb(this.config.baseColor);
        const baseR = 0.15 * rgb.r, baseG = 0.15 * rgb.g, baseB = 0.15 * rgb.b;

        const addLine = (i1, x1, y1, z1, i2, x2, y2, z2) => {
            const int1 = this.getPointIntensity(i1);
            const int2 = this.getPointIntensity(i2);
            
            positions[idx] = x1; positions[idx+1] = y1; positions[idx+2] = z1 + this.getPointLift(i1);
            positions[idx+3] = x2; positions[idx+4] = y2; positions[idx+5] = z2 + this.getPointLift(i2);
            
            const g1 = Math.pow(int1, 1.2) * this.config.lineBrightness;
            const g2 = Math.pow(int2, 1.2) * this.config.lineBrightness;
            
            colors[idx] = baseR + (g1 * rgb.r); colors[idx+1] = baseG + (g1 * rgb.g); colors[idx+2] = baseB + (g1 * rgb.b);
            colors[idx+3] = baseR + (g2 * rgb.r); colors[idx+4] = baseG + (g2 * rgb.g); colors[idx+5] = baseB + (g2 * rgb.b);
            idx += 6;
        };

        const startX = -(gridWidth * spacing) / 2 + this.config.offsetX;
        const startY = -(gridHeight * spacing) / 2 + this.config.offsetY;

        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                const i = row * gridWidth + col;
                const x = startX + col * spacing;
                const y = startY + row * spacing;

                if (col < gridWidth - 1) addLine(i, x, y, gridZ, i + 1, x + spacing, y, gridZ);
                if (row < gridHeight - 1) addLine(i, x, y, gridZ, i + gridWidth, x, y + spacing, gridZ);

                const vLen = spacing * 1.5;
                if (col === gridWidth - 1) addLine(i, x, y, gridZ, i, x + vLen, y, gridZ);
                if (col === 0) addLine(i, x, y, gridZ, i, x - vLen, y, gridZ);
                if (row === gridHeight - 1) addLine(i, x, y, gridZ, i, x, y + vLen, gridZ);
                if (row === 0) addLine(i, x, y, gridZ, i, x, y - vLen, gridZ);
            }
        }

        this.lines.geometry.attributes.position.needsUpdate = true;
        this.lines.geometry.attributes.color.needsUpdate = true;
    }

    renderFrame() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    animate = (timestamp) => {
        if (this.isPaused) return;
        this.time = timestamp * 0.001;
        if (this.points) this.points.material.uniforms.uTime.value = this.time;
        this.updateLines();
        this.renderFrame();
        this.animationId = requestAnimationFrame(this.animate);
    }

    startAnimation() {
        this.isPaused = false;
        this.animationId = requestAnimationFrame(this.animate);
    }

    pause() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    onResize() {
        const rect = this.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
        this.renderFrame();
    }

    disconnectedCallback() {
        this.pause();
        if (this._observer) this._observer.disconnect();
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.renderer) {
            this.renderer.dispose();
            if (this.points) {
                this.points.geometry.dispose();
                this.points.material.dispose();
            }
            if (this.lines) {
                this.lines.geometry.dispose();
                this.lines.material.dispose();
            }
        }
    }
}

customElements.define('network-grid-bg', NetworkGridBg);