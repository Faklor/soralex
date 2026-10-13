import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

class NetworkBackground extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.isPaused = false;
        this.time = 0;
        this.animationId = null;
        
        // 🔥 НОВОЕ: Флаги для отложенной загрузки
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
            
            gridGlowEnabled: true,     
            gridGlowIntensity: 80,     
            gridGlowDistance: 60,      
            gridGlowHeight: 2,         
            gridGlowSamples: 12, 

            phonePivotName: 'Empty-phone',
            phoneModelPath: 'assets/models/IPHONE-15-PRO-MAX.glb',
            phoneScale: 270.0,
            phonePosX: 12.4,
            phonePosY: 12,
            phonePosZ: 65,
            phoneRotX: 0,
            phoneRotY: -90,
            phoneRotZ: 0,
            
            cameraOffsetX: 0.06,
            cameraOffsetY: 0,
            cameraOffsetZ: 0,

            playableJsonUrl: 'https://dashboard.mraid.io/portfolio.json',
            inactivityTimeout: 30000,

            frameWidth: 740,  
            frameHeight: 1400,

            screenOffsetX: 0,
            screenOffsetY: 0,
            screenOffsetZ: 0,
            
            statusBarHeight: 20,
            homeBarHeight: 25,
            uiOffsetZ: 0.02,
            uiGap: 20,  

            phoneAnimSpeedX: 0.1,
            phoneAnimSpeedY: 0.1,
            phoneAnimSpeedZ: 0.1,
            
            phoneAnimBiasX: -10,
            phoneAnimBiasY: -20,
            phoneAnimBiasZ: 10,

            phoneAnimAmpX: 2,
            phoneAnimAmpY: 5,
            phoneAnimAmpZ: 2,

            redLightIntensity: 1.5,
            redLightDistance: 0,
            redLightDecay: 1.5,
            redLightPosX: 30,
            redLightPosY: 0,
            redLightPosZ: 80,

            vignetteInner: 20,
            vignetteOuter: 80,
            vignetteFeather: 30,

            showPhone: true,
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cssRenderer = null;
        this.points = null;
        this.lines = null;
        this.phoneModel = null;
        this.glassMesh = null;
        this.screenObject = null;
        this.statusBarObject = null;
        this.homeBarObject = null;
        this.playableIframe = null;
        this.loader = null;
        this.resizeObserver = null;
        
        this.linePositions = null;
        this.lineColors = null;
        this.phases = [];
        this.isHotArr = [];
        
        this.playablesData = [];
        this.inactivityTimer = null;
        this.currentPlayableUrl = '';
        
        this.screenN = null;
        this.screenUp = null;
        this.screenRight = null;
        this.screenLocalCenter = null;
        this.glassParentScale = null;
        this.screenW = 0;
        this.screenH = 0;

        this.redPointLight = null;
        this.gridGlowLight = null;
        this.phoneBottomY = 0;

        this.redSpotLightLeft = null;
        this.redSpotLightRight = null;
        this.redBackGlowLight = null;

        this.helperSpotLeft = null;
        this.helperSpotRight = null;
        this.helperPointBack = null;

        this.redColor = 0xff1a1a;

        this.mouse = { x: 0, y: 0 }; 
        this.isHoveringPhone = false; 
        this.smoothRotation = { x: 0, y: 0, z: 0 }; 
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.isMuted = false;
        this.muteBtn = null; 
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
        // 1. МГНОВЕННО рендерим только HTML и CSS (занимает < 1 мс)
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
                    transform: translate3d(0, 0, 0); 
                }
                canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    outline: none;
                }
                .screen-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background: transparent;
                    pointer-events: auto;
                }
                .screen-wrapper iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: transparent;
                }
                .status-bar {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 48px 60px 0 60px;
                    box-sizing: border-box;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 30px;
                    font-weight: 300;
                    text-shadow: 0 0 10px rgba(0,0,0,0.8);
                    pointer-events: none;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .status-bar .time { margin-left: 30px; }
                .status-bar .icons { display: flex; gap: 10px; align-items: center; }
                .home-indicator {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .home-indicator .bar {
                    width: 50%;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 3px;
                    margin-bottom: 10px;
                }
                .playable-mute-btn {
                    position: absolute;
                    top: 20px;       
                    left: 20px;     
                    width: 60px;   
                    height: 60px;   
                    border-radius: 50%;
                    background: rgba(13, 13, 15, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #ffffff;
                    cursor: pointer;
                    z-index: 101;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
                    display: none;
                }
                .playable-mute-btn:hover {
                    background: rgba(218, 4, 4, 0.9);
                    border-color: rgba(218, 4, 4, 1);
                    transform: scale(1.15); 
                    box-shadow: 0 6px 20px rgba(218, 4, 4, 0.4);
                }
                .playable-mute-btn:active { transform: scale(0.95); }
                .playable-mute-btn svg { width: 28px; height: 28px; }
                .iframe-preloader { z-index: 102 !important; }
            </style>
            <canvas id="network-canvas"></canvas>
            <div class="vignette-overlay"></div>
        `;

        this.applyVignetteCSS();

        // 2. 🔥 ГЛАВНАЯ ОПТИМИЗАЦИЯ: Отложенная инициализация
        // Мы не грузим Three.js сразу. Мы ждем, пока элемент появится на экране (с запасом 300px)
        this._observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this._isInitialized) {
                this._isInitialized = true;
                this._observer.disconnect(); // Отключаем наблюдение, оно больше не нужно
                
                // Используем requestIdleCallback, чтобы выполнить тяжелый код, когда процессор свободен
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => this._heavyInit(), { timeout: 1000 });
                } else {
                    setTimeout(() => this._heavyInit(), 100); // Фолбэк для Safari
                }
            }
        }, { rootMargin: '300px' });

        this._observer.observe(this);
    }

    // 3. Вся тяжелая логика вынесена в отдельный метод
    _heavyInit() {
        this.initThreeJS();
        this.createPhoneBacklights();
        this.createGrid();
        
        if (this.config.showPhone) {
            this.loadPhoneModel();
        }
        
        this.loadPlayablesData();
        this.setupInteractionListeners();
        
        this.renderFrame();
        if (!this.isPaused) this.startAnimation();

        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
        
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    createPhoneBacklights() {
        const c = this.config;
      
        this.redSpotLightLeft = new THREE.SpotLight(this.redColor, 80); 
        this.redSpotLightLeft.position.set(c.phonePosX + 50, c.phonePosY - 20, c.phonePosZ + 0);
        this.redSpotLightLeft.target.position.set(c.phonePosX, c.phonePosY, c.phonePosZ);
        this.redSpotLightLeft.angle = Math.PI / 5;      
        this.redSpotLightLeft.penumbra = 0.6;         
        this.redSpotLightLeft.decay = 1.2;               
        this.redSpotLightLeft.distance = 0; 
        this.scene.add(this.redSpotLightLeft);
        this.scene.add(this.redSpotLightLeft.target);    

        this.redSpotLightRight = new THREE.SpotLight(this.redColor, 80);
        this.redSpotLightRight.position.set(c.phonePosX - 50, c.phonePosY + 0, c.phonePosZ + 30);
        this.redSpotLightRight.target.position.set(c.phonePosX, c.phonePosY, c.phonePosZ);
        this.redSpotLightRight.angle = Math.PI / 5;
        this.redSpotLightRight.penumbra = 0.6;
        this.redSpotLightRight.decay = 1.2;
        this.redSpotLightRight.distance = 0; 
        this.scene.add(this.redSpotLightRight);
        this.scene.add(this.redSpotLightRight.target);
    }

    applyGridPosition() {
        const c = this.config;
        if (this.points) this.points.position.set(c.gridPosX, 0, c.gridPosZ);
        if (this.lines) this.lines.position.set(c.gridPosX, 0, c.gridPosZ);
    }

    applyVignetteCSS() {
        const c = this.config;
        const inner = Math.max(0, c.vignetteInner || 0);
        const outer = Math.min(100, c.vignetteOuter || 100);
        const feather = c.vignetteFeather || 20;
        
        const mid1 = Math.max(inner, outer - feather * 1.5);
        const mid2 = Math.min(outer, outer + feather * 0.5);
        
        this.style.setProperty('--vignette-inner', inner + '%');
        this.style.setProperty('--vignette-mid1', mid1 + '%');
        this.style.setProperty('--vignette-mid2', mid2 + '%');
        this.style.setProperty('--vignette-outer', outer + '%');
    }

    handleMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.phonePivot && this.camera) {
            const phonePos = new THREE.Vector3();
            this.phonePivot.getWorldPosition(phonePos);
            phonePos.project(this.camera);
            
            const screenX = (phonePos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-(phonePos.y * 0.5) + 0.5) * window.innerHeight;
            
            const distance = Math.hypot(event.clientX - screenX, event.clientY - screenY);
            this.isHoveringPhone = distance < 250; 
        }
    }

    initThreeJS() {
        const canvas = this.shadowRoot.getElementById('network-canvas');
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
        // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        this.cssRenderer = new CSS3DRenderer();
        this.cssRenderer.setSize(rect.width, rect.height);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.left = '0';
        this.cssRenderer.domElement.style.pointerEvents = 'none';
        this.cssRenderer.domElement.style.zIndex = '10';
        this.shadowRoot.appendChild(this.cssRenderer.domElement);
        
        this.setupLighting();
    }

    setupLighting() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.keyLight = new THREE.DirectionalLight(0xffffff, 10);
        this.keyLight.position.set(100, 100, 30);
        this.scene.add(this.keyLight);

        this.fillLight = new THREE.DirectionalLight(0xFED9D9, 10);
        this.fillLight.position.set(-100, 100, 200);
        this.scene.add(this.fillLight);
    }

    // async loadPlayablesData() {
    //     try {
    //         const data = await window.PortfolioDataCache.getData();
    //         this.playablesData = data.previews || (Array.isArray(data) ? data : []);
    //         if (this.playablesData.length > 0) this.loadRandomPlayable();
    //     } catch (error) {
    //         console.error('Ошибка загрузки JSON:', error);
    //         this.playablesData = [{ url: ''}];
    //         this.loadRandomPlayable();
    //     }
    // }
    async loadPlayablesData() {
        try {
            const data = await window.PortfolioDataCache.getData();
            const allPreviews = data.previews || (Array.isArray(data) ? data : []);
            
            
            const favoritePreviews = allPreviews.filter(item => 
                item.favorite === 1 || item.favorite === true || item.favorite === "1" || item.favorite === "true"
            );

            
            this.playablesData = favoritePreviews.length > 0 ? favoritePreviews : allPreviews;
            
            if (this.playablesData.length > 0) {
                this.loadRandomPlayable();
            }
        } catch (error) {
            console.error('Ошибка загрузки JSON для фона:', error);
            this.playablesData = [];
        }
    }

    loadRandomPlayable() {
        if (!this.playablesData || this.playablesData.length === 0) return;
        const selected = this.playablesData[Math.floor(Math.random() * this.playablesData.length)];
        if (selected.url && selected.url !== this.currentPlayableUrl) {
            this.currentPlayableUrl = selected.url;
            this.setPlayableUrl(selected.url);
            this.resetInactivityTimer();
        }
    }

    resetInactivityTimer() {
        if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => this.loadRandomPlayable(), this.config.inactivityTimeout);
    }

    setupInteractionListeners() {
        const resetTimer = () => this.resetInactivityTimer();
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('keydown', resetTimer);
        this._interactionReset = resetTimer;
    }

    loadPhoneModel() {
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.loader.setDRACOLoader(dracoLoader);

        this.loader.load(this.config.phoneModelPath, (gltf) => {
            this.phoneModel = gltf.scene;
            
            this.phoneModel.position.set(0, 0, 0);
            this.phoneModel.rotation.set(0, 0, 0);
            this.phoneModel.scale.set(1, 1, 1);

            this.phonePivot = null;
            this.phoneModel.traverse((child) => {
                if (child.name && child.name.includes('Empty-phone')) {
                    this.phonePivot = child;
                }
                
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.name && child.name.toUpperCase().includes('GLASS')) {
                        this.glassMesh = child;
                    }
                }
            });

            if (this.phonePivot) {
                this.phonePivot.rotation.order = 'YXZ';
                this.phonePivot.position.set(this.config.phonePosX, this.config.phonePosY, this.config.phonePosZ);
                
                const rad = Math.PI / 180;
                this.phonePivot.rotation.set(
                    this.config.phoneRotX * rad, 
                    this.config.phoneRotY * rad, 
                    this.config.phoneRotZ * rad
                );
                this.phonePivot.scale.setScalar(this.config.phoneScale);
            } else {
                console.error(`❌ ОШИБКА: Нода "Empty-phone" не найдена!`);
                this.phoneModel.traverse(c => console.log("-", c.name));
            }
            
            this.scene.add(this.phoneModel);
            
            if (this.glassMesh) {
                this.makeGlassBlack();
                this.createScreenObject();
            } else {
                console.warn('⚠️ GLASS не найден');
            }
            
            this.createGridGlow();
        }, undefined, (error) => console.error('Ошибка GLB:', error));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        const iconUnmuted = this.muteBtn.querySelector('.icon-unmuted');
        const iconMuted = this.muteBtn.querySelector('.icon-muted');
        if (this.isMuted) {
            iconUnmuted.style.display = 'none';
            iconMuted.style.display = 'block';
        } else {
            iconUnmuted.style.display = 'block';
            iconMuted.style.display = 'none';
        }

        try {
            const iframeDoc = this.playableIframe.contentDocument || this.playableIframe.contentWindow.document;
            iframeDoc.querySelectorAll('video, audio').forEach(media => {
                media.muted = this.isMuted;
                if (this.isMuted) media.pause();
            });

            if (iframeDoc.defaultView.Howler) {
                iframeDoc.defaultView.Howler.mute(this.isMuted);
            }
        } catch (e) {
            // CORS ошибка - это нормально для чужих доменов
        }
    }

    createScreenObject() {
        const glass = this.glassMesh;
        glass.updateWorldMatrix(true, false);

        const box = new THREE.Box3().setFromObject(glass);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const ps = glass.getWorldScale(new THREE.Vector3()).x;
        this.glassParentScale = ps;

        glass.geometry.computeBoundingBox();
        const ls = glass.geometry.boundingBox.getSize(new THREE.Vector3());
        const dims = [ls.x, ls.y, ls.z];
        const nAxis = dims.indexOf(Math.min(...dims));
        const rest = [0, 1, 2].filter(i => i !== nAxis);
        const upAxis = dims[rest[0]] > dims[rest[1]] ? rest[0] : rest[1];
        const wAxis = rest.find(i => i !== upAxis);

        this.screenW = dims[wAxis];
        this.screenH = dims[upAxis];

        const gq = glass.getWorldQuaternion(new THREE.Quaternion());
        const n = new THREE.Vector3().setComponent(nAxis, 1);
        if (n.clone().applyQuaternion(gq).dot(this.camera.position.clone().sub(center)) < 0) {
            n.setComponent(nAxis, -1);
        }
        const up = new THREE.Vector3().setComponent(upAxis, 1);
        if (up.clone().applyQuaternion(gq).y < 0) up.setComponent(upAxis, -1);
        const right = up.clone().cross(n);

        this.screenN = n;
        this.screenUp = up;
        this.screenRight = right;

        const wrapper = document.createElement('div');
        wrapper.className = 'screen-wrapper';
        wrapper.style.width = this.config.frameWidth + 'px';
        wrapper.style.height = this.config.frameHeight + 'px';
        wrapper.style.position = 'relative';

        this.muteBtn = document.createElement('button');
        this.muteBtn.className = 'playable-mute-btn';
        this.muteBtn.title = this.isMuted ? 'Unmute' : 'Mute';
        this.muteBtn.innerHTML = `
            <svg class="icon-unmuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg class="icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        wrapper.appendChild(this.muteBtn);

        this.preloaderElement = document.createElement('div');
        this.preloaderElement.className = 'iframe-preloader';
        this.preloaderElement.innerHTML = `
            <style>
                .iframe-preloader {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: #0D0D0F; display: flex; align-items: center; justify-content: center;
                    z-index: 100; transition: opacity 0.4s ease-out;
                }
                .iframe-preloader.hidden { opacity: 0; pointer-events: none; }
                .red-spinner {
                    width: 60px; height: 60px; border: 4px solid rgba(218, 4, 4, 0.2); 
                    border-top: 4px solid #da0404; border-radius: 50%; animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
            <div class="red-spinner"></div>
        `;
        wrapper.appendChild(this.preloaderElement);

        this.playableIframe = document.createElement('iframe');
        this.playableIframe.src = 'about:blank';
        this.playableIframe.setAttribute('allow', 'webgl; autoplay; fullscreen; microphone; camera; xr-spatial-tracking;title="customPhone"');
        this.playableIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
        
        this.playableIframe.style.background = 'transparent';
        this.playableIframe.style.border = 'none';
        this.playableIframe.style.width = '100%';
        this.playableIframe.style.height = '100%';
        this.playableIframe.style.transform = 'translate3d(0, 0, 0)';
        this.playableIframe.style.willChange = 'transform';
        this.playableIframe.style.backfaceVisibility = 'hidden';

        // 🔥 ИСПРАВЛЕНО: Убрано дублирование этого блока
        this.playableIframe.onload = () => {
            if (this.preloaderElement) {
                this.preloaderElement.classList.add('hidden');
            }
        };
        
        wrapper.appendChild(this.playableIframe);

        this.screenObject = new CSS3DObject(wrapper);
        glass.add(this.screenObject);

        const cssScale = dims[wAxis] / this.config.frameWidth;
        this.screenObject.scale.set(cssScale, cssScale, cssScale);

        this.screenObject.quaternion.setFromRotationMatrix(
            new THREE.Matrix4().makeBasis(right, up, n)
        );

        const localCenter = glass.worldToLocal(center.clone());
        this.screenLocalCenter = localCenter.clone();
        
        this.applyScreenOffsets();
        this.createStatusBar(glass, localCenter, n, up, right, cssScale, ps);
        this.createHomeIndicator(glass, localCenter, n, up, right, cssScale, ps);

        if (this.currentPlayableUrl) {
            this.playableIframe.src = this.currentPlayableUrl;
        }
    }

    applyScreenOffsets() {
        if (!this.screenObject || !this.screenLocalCenter) return;
        const ps = this.glassParentScale || 1;
        this.screenObject.position.copy(this.screenLocalCenter)
            .addScaledVector(this.screenN, this.config.screenOffsetZ / ps)
            .addScaledVector(this.screenUp, this.config.screenOffsetY / ps)
            .addScaledVector(this.screenRight, this.config.screenOffsetX / ps);
    }

    createStatusBar(glass, localCenter, n, up, right, cssScale, ps) {
        const wrapper = document.createElement('div');
        wrapper.className = 'status-bar';
        wrapper.innerHTML = `<span class="time">${this.getCurrentTime()}</span><div class="icons"><span>📶</span><span>🔋</span></div>`;
        
        const barHeightPx = this.config.statusBarHeight;
        wrapper.style.width = this.config.frameWidth + 'px';
        wrapper.style.height = barHeightPx + 'px';
        
        this.statusBarObject = new CSS3DObject(wrapper);
        glass.add(this.statusBarObject);
        this.statusBarObject.scale.set(cssScale, cssScale, cssScale);
        this.statusBarObject.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, n));
        
        const frameHWorld = this.config.frameHeight * cssScale;
        const barHWorld = barHeightPx * cssScale;
        const yOffset = frameHWorld / 2 + barHWorld / 2 + this.config.uiGap;
        
        this.statusBarObject.position.copy(localCenter)
            .addScaledVector(up, yOffset / ps)
            .addScaledVector(n, this.config.uiOffsetZ / ps);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }

    createHomeIndicator(glass, localCenter, n, up, right, cssScale, ps) {
        const wrapper = document.createElement('div');
        wrapper.className = 'home-indicator';
        wrapper.innerHTML = `<div class="bar"></div>`;
        
        const barHeightPx = this.config.homeBarHeight;
        wrapper.style.width = this.config.frameWidth + 'px';
        wrapper.style.height = barHeightPx + 'px';
        
        this.homeBarObject = new CSS3DObject(wrapper);
        glass.add(this.homeBarObject);
        this.homeBarObject.scale.set(cssScale, cssScale, cssScale);
        this.homeBarObject.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, n));
        
        const frameHWorld = this.config.frameHeight * cssScale;
        const barHWorld = barHeightPx * cssScale;
        const yOffset = -(frameHWorld / 2 + barHWorld / 2 + this.config.uiGap);
        
        this.homeBarObject.position.copy(localCenter)
            .addScaledVector(up, yOffset / ps)
            .addScaledVector(n, this.config.uiOffsetZ / ps);
    }

    makeGlassBlack() {
        const old = this.glassMesh.material;
        const mat = old.clone();
        mat.color.set(0x000000);
        mat.transparent = false;
        mat.opacity = 1;
        if (mat.emissive) mat.emissive.set(0x000000);
        if ('metalness' in mat) mat.metalness = 0.6;
        if ('roughness' in mat) mat.roughness = 0.15;
        mat.needsUpdate = true;
        this.glassMesh.material = mat;
    }

    makeModelOpaque(model) {
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                    mat.transparent = false;
                    mat.opacity = 1.0;
                    mat.depthWrite = true;
                    mat.needsUpdate = true;
                });
            }
        });
    }

    updateScreenVisibility() {
        if (!this.screenObject || !this.camera || !this.phoneModel) return;
        
        const screenPos = new THREE.Vector3();
        this.screenObject.getWorldPosition(screenPos);
        
        const raycaster = new THREE.Raycaster();
        const direction = screenPos.clone().sub(this.camera.position).normalize();
        raycaster.set(this.camera.position, direction);
        
        const occluders = [];
        this.phoneModel.traverse((child) => {
            if (child.isMesh && child !== this.glassMesh) {
                occluders.push(child);
            }
        });
        
        const intersects = raycaster.intersectObjects(occluders);
        const dist = screenPos.distanceTo(this.camera.position);
        
        if (intersects.length > 0 && intersects[0].distance < dist - 0.5) {
            this.screenObject.visible = false;
            if (this.statusBarObject) this.statusBarObject.visible = false;
            if (this.homeBarObject) this.homeBarObject.visible = false;
            return;
        }
        
        const screenNormal = new THREE.Vector3(0, 0, 1);
        this.screenObject.getWorldDirection(screenNormal);
        const camPos = this.camera.position.clone();
        const toCamera = camPos.sub(screenPos).normalize();
        const dot = screenNormal.dot(toCamera);
        
        const visible = dot > 0.15;
        this.screenObject.visible = visible;
        if (this.statusBarObject) this.statusBarObject.visible = visible;
        if (this.homeBarObject) this.homeBarObject.visible = visible;
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
        this.applyRotations();
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

        if (this.points) { this.points.rotation.set(rx, ry, rz); }
        if (this.lines) { this.lines.rotation.set(rx, ry, rz); }
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
        if (this.cssRenderer && this.scene && this.camera) {
            this.cssRenderer.render(this.scene, this.camera);
        }
    }

    animate = (timestamp) => {
        if (this.isPaused) return;
        this.time = timestamp * 0.001;
        this.animatePhone(timestamp);      
        if (this.points) this.points.material.uniforms.uTime.value = this.time;
        this.updateLines();
        this.updateScreenVisibility();
        this.updateGridGlow();
        this.renderFrame();                
        this.animationId = requestAnimationFrame(this.animate);
    }

    animatePhone(timestamp) {
        if (!this.phonePivot) return; 

        const rad = Math.PI / 180;
        const c = this.config;

        
        if (window.innerWidth <= 1024 && window.innerWidth >= 768) {
            this.phonePivot.rotation.set(
                c.phoneRotX * rad,
                c.phoneRotY * rad,
                c.phoneRotZ * rad
            );
            this.phonePivot.position.x = 0; 

            if (this.points) this.points.visible = true;
            if (this.lines) this.lines.visible = true;
            if (this.gridGlowLight) this.gridGlowLight.visible = true;
            return; 
        } 
        else if (window.innerWidth <= 768) {
             this.phonePivot.rotation.set(
                c.phoneRotX * rad,
                c.phoneRotY * rad,
                c.phoneRotZ * rad
            );
            this.phonePivot.position.x = 0;
            
           
            if (this.points) this.points.visible = false;
            if (this.lines) this.lines.visible = false;
            if (this.gridGlowLight) this.gridGlowLight.visible = false;
            
           
            return; 
        } 
        else {

             
            this.phonePivot.position.set(c.phonePosX, c.phonePosY, c.phonePosZ);

            if (this.points) this.points.visible = true;
            if (this.lines) this.lines.visible = true;
            if (this.gridGlowLight) this.gridGlowLight.visible = true;
        }

       
        this.phonePivot.rotation.order = 'YXZ';
        const t = timestamp * 0.01;

        let targetX, targetY, targetZ;

        if (this.isHoveringPhone) {
            targetX = c.phoneRotX * rad;
            targetY = c.phoneRotY * rad;
            targetZ = c.phoneRotZ * rad;
        } else {
            const idleX = c.phoneRotX * rad + (c.phoneAnimBiasX * rad) + Math.sin(t * c.phoneAnimSpeedX + 1.5) * (c.phoneAnimAmpX * rad);
            const idleY = c.phoneRotY * rad + (c.phoneAnimBiasY * rad) + Math.sin(t * c.phoneAnimSpeedY) * (c.phoneAnimAmpY * rad);
            const idleZ = c.phoneRotZ * rad + (c.phoneAnimBiasZ * rad) + Math.sin(t * c.phoneAnimSpeedZ + 0.8) * (c.phoneAnimAmpZ * rad);

            const tiltIntensity = 0.15; 
            const mouseTiltX = this.mouse.y * tiltIntensity; 
            const mouseTiltY = this.mouse.x * tiltIntensity; 

            targetX = idleX + mouseTiltX;
            targetY = idleY + mouseTiltY;
            targetZ = idleZ;
        }

        const lerpFactor = 0.06; 
        this.smoothRotation.x += (targetX - this.smoothRotation.x) * lerpFactor;
        this.smoothRotation.y += (targetY - this.smoothRotation.y) * lerpFactor;
        this.smoothRotation.z += (targetZ - this.smoothRotation.z) * lerpFactor;

        this.phonePivot.rotation.set(this.smoothRotation.x, this.smoothRotation.y, this.smoothRotation.z);
    }
    
    startAnimation() { this.isPaused = false; this.animationId = requestAnimationFrame(this.animate); }
    pause() {
        this.isPaused = true;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
    }
    resume() { if (this.isPaused) this.startAnimation(); }
    toggleAnimation() { this.isPaused ? this.resume() : this.pause(); }

    onResize() {
        const rect = this.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
        if (this.cssRenderer) this.cssRenderer.setSize(rect.width, rect.height);
        this.renderFrame();
    }

    rebuildGrid() {
        this.scene.remove(this.points); 
        this.scene.remove(this.lines);
        if (this.points) {
            this.points.geometry.dispose(); 
            this.points.material.dispose();
        }
        if (this.lines) {
            this.lines.geometry.dispose(); 
            this.lines.material.dispose();
        }
        this.createGrid(); 
    }

    createGridGlow() {
        this.gridGlowLight = new THREE.PointLight(0xff1a1a, 0, this.config.gridGlowDistance, 2);
        
        if (this.config.showPhone && this.phoneModel) {
            const box = new THREE.Box3().setFromObject(this.phoneModel);
            this.phoneBottomY = box.min.y;
            this.gridGlowLight.position.set(
                this.config.phonePosX,
                this.phoneBottomY + this.config.gridGlowHeight,
                this.config.phonePosZ
            );
        } else {
            this.gridGlowLight.position.set(
                this.config.phonePosX,
                0,
                this.config.phonePosZ
            );
        }
        this.scene.add(this.gridGlowLight);
    }

    updateGridGlow() {
        if (!this.gridGlowLight || !this.config.gridGlowEnabled) return;
        
        const step = Math.max(1, Math.floor(this.phases.length / this.config.gridGlowSamples));
        let sum = 0, cnt = 0;
        for (let i = 0; i < this.phases.length; i += step) {
            sum += this.getPointIntensity(i) + this.getPointLift(i) * 0.15;
            cnt++;
        }
        const avg = cnt ? sum / cnt : 0;
        this.gridGlowLight.intensity = avg * this.config.gridGlowIntensity;
    }

    setPlayableUrl(v) { 
        if (this.playableIframe) {
            if (this.preloaderElement) {
                this.preloaderElement.classList.remove('hidden');
            }
            this.playableIframe.src = v;
        }
    }
    
    disconnectedCallback() {
        this.pause();
        if (this._observer) this._observer.disconnect(); // 🔥 Очистка наблюдателя
        window.removeEventListener('mousemove', this.handleMouseMove);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
        if (this._interactionReset) {
            window.removeEventListener('mousemove', this._interactionReset);
            window.removeEventListener('click', this._interactionReset);
            window.removeEventListener('touchstart', this._interactionReset);
            window.removeEventListener('keydown', this._interactionReset);
        }
        if (this.phoneModel) {
            this.scene.remove(this.phoneModel);
            this.phoneModel.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            });
        }
        if (this.screenObject) this.screenObject.element.remove();
        if (this.statusBarObject) this.statusBarObject.element.remove();
        if (this.homeBarObject) this.homeBarObject.element.remove();
        if (this.cssRenderer) this.cssRenderer.domElement.remove();
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

        if (this.redSpotLightLeft) {
            this.scene.remove(this.redSpotLightLeft);
            this.scene.remove(this.redSpotLightLeft.target);
        }
        if (this.redSpotLightRight) {
            this.scene.remove(this.redSpotLightRight);
            this.scene.remove(this.redSpotLightRight.target);
        }
        if (this.redBackGlowLight) {
            this.scene.remove(this.redBackGlowLight);
        }
    }
}

customElements.define('network-background', NetworkBackground);