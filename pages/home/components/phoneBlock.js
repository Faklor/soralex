class PhoneShowcase extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.inactivityTimer = null;
        this.currentTime = 0;
        this.lastPlayable = null;
    }

    connectedCallback() {
        this.renderHTML();
        this.loadRandomPlayable();
        this.setupInactivityDetection();
        this.setup3DTilt();
    }

    loadRandomPlayable() {
        let randomPl;
        do {
            randomPl = Math.floor(Math.random() * 5) + 1;
        } while (randomPl === this.lastPlayable && 5 > 1);
        
        this.lastPlayable = randomPl;
        
        const playableSrc = `assets/playables/pl${randomPl}/index.html`;
        const previewSrc = `assets/playables/pl${randomPl}/preview.jpg`;
        
        const iframe = this.shadowRoot.querySelector('.playable-screen');
        const preloaderBg = this.shadowRoot.querySelector('.preloader-bg');
        const preloader = this.shadowRoot.querySelector('.preloader');

        if (iframe) {
            if (preloader) preloader.classList.remove('hidden');
            if (preloaderBg) preloaderBg.src = previewSrc;
            
            iframe.src = 'about:blank';
            setTimeout(() => {
                iframe.src = playableSrc;
            }, 50);
            
            iframe.onload = () => {
                if (preloader) preloader.classList.add('hidden');
            };
        }
        
        this.resetInactivityTimer();
    }

    // renderHTML() {
    //     this.shadowRoot.innerHTML = `
    //         <link rel="stylesheet" href="pages/home/components/css/phoneBlock.css">
            
    //         <div class="showcase-wrapper">
    //             <div class="phone-3d-container">
    //                 <div class="phone-inner">
    //                     <div class="preloader">
    //                         <img src="" alt="Preview" class="preloader-bg">
    //                         <div class="spinner"></div>
    //                     </div>
    //                     <iframe src="about:blank" class="playable-screen" frameborder="0" title="Playable Game"></iframe>
    //                     <svg class="phone-svg-body" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
    //                         <rect x="2" y="2" width="296" height="596" rx="45" fill="#111114" stroke="#26282C" stroke-width="4"/>
    //                         <rect x="14" y="14" width="272" height="572" rx="36" fill="none" stroke="#101114" stroke-width="20"/>
    //                         <rect x="16" y="16" width="268" height="568" rx="35" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    //                     </svg>
    //                     <svg class="phone-svg-notch" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
    //                         <rect x="100" y="20" width="100" height="22" rx="10" fill="#101114"/>
    //                     </svg>
    //                     <div class="screen-reflection"></div>
    //                 </div>
    //             </div>
    //             <div class="inactivity-indicator">
    //                 <span>Next game in <span class="countdown">30</span>s</span>
    //             </div>
    //         </div>
    //     `;
        
    //     const iframe = this.shadowRoot.querySelector('.playable-screen');
    //     const preloader = this.shadowRoot.querySelector('.preloader');
    //     if (iframe && preloader) {
    //         iframe.onload = () => {
    //             preloader.classList.add('hidden');
    //         };
    //     }
    // }
    renderHTML() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/home/components/css/phoneBlock.css">
            
            <div class="showcase-wrapper">
                <div class="phone-3d-container">
                    <!-- НОВОЕ: Круглое свечение позади телефона -->
                    <div class="phone-glow"></div>
                    
                    <div class="phone-inner">
                        <div class="preloader">
                            <img src="" alt="Preview" class="preloader-bg">
                            <div class="spinner"></div>
                        </div>
                        <iframe src="about:blank" class="playable-screen" frameborder="0" title="Playable Game"></iframe>
                        <svg class="phone-svg-body" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="296" height="596" rx="45" fill="#111114" stroke="#26282C" stroke-width="4"/>
                            <rect x="14" y="14" width="272" height="572" rx="36" fill="none" stroke="#101114" stroke-width="20"/>
                            <rect x="16" y="16" width="268" height="568" rx="35" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                        </svg>
                        <svg class="phone-svg-notch" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
                            <rect x="100" y="20" width="100" height="22" rx="10" fill="#101114"/>
                        </svg>
                        <div class="screen-reflection"></div>
                    </div>
                </div>
                <div class="inactivity-indicator">
                    <span>Next game in <span class="countdown">30</span>s</span>
                </div>
            </div>
        `;
        
        const iframe = this.shadowRoot.querySelector('.playable-screen');
        const preloader = this.shadowRoot.querySelector('.preloader');
        if (iframe && preloader) {
            iframe.onload = () => {
                preloader.classList.add('hidden');
            };
        }
    }

    setupInactivityDetection() {
        const activities = ['mousedown', 'mousemove', 'click', 'touchstart', 'touchmove', 'scroll', 'keypress'];
        activities.forEach(event => {
            document.addEventListener(event, () => this.resetInactivityTimer(), true);
        });
        this.startInactivityCounter();
    }

    resetInactivityTimer() {
        this.currentTime = 0;
        this.updateCountdownDisplay();
        const indicator = this.shadowRoot.querySelector('.inactivity-indicator');
        if (indicator) indicator.style.opacity = '0';
    }

    startInactivityCounter() {
        setInterval(() => {
            this.currentTime++;
            this.updateCountdownDisplay();
            
            if (this.currentTime >= 25) {
                const indicator = this.shadowRoot.querySelector('.inactivity-indicator');
                if (indicator) indicator.style.opacity = '1';
            }
            
            if (this.currentTime >= 30) {
                this.loadRandomPlayable();
            }
        }, 1000);
    }

    updateCountdownDisplay() {
        const countdownEl = this.shadowRoot.querySelector('.countdown');
        if (countdownEl) {
            countdownEl.textContent = Math.max(0, 30 - this.currentTime);
        }
    }

    setup3DTilt() {
        const container = this.shadowRoot.querySelector('.phone-3d-container');
        const phoneInner = this.shadowRoot.querySelector('.phone-inner');

        if (!container || !phoneInner) return;

        let isMouseInside = false;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let animationFrameId = null;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const animate = () => {
            currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
            currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);
            phoneInner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

            if (isMouseInside) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const isInside = (
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom
            );

            if (isInside && !isMouseInside) {
                isMouseInside = true;
                phoneInner.style.animation = 'none';
                animationFrameId = requestAnimationFrame(animate);
            } else if (!isInside && isMouseInside) {
                isMouseInside = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                targetRotateX = 0;
                targetRotateY = 0;
                
                const returnAnimate = () => {
                    currentRotateX = lerp(currentRotateX, 0, 0.1);
                    currentRotateY = lerp(currentRotateY, 0, 0.1);
                    phoneInner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

                    if (Math.abs(currentRotateX) > 0.1 || Math.abs(currentRotateY) > 0.1) {
                        requestAnimationFrame(returnAnimate);
                    } else {
                        // Сбрасываем inline transform, чтобы CSS-анимация могла работать
                        phoneInner.style.transform = '';
                        phoneInner.style.animation = 'float3D 12s ease-in-out infinite';
                        currentRotateX = 0;
                        currentRotateY = 0;
                    }
                };
                requestAnimationFrame(returnAnimate);
            }

            if (isMouseInside) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const normalizedX = (x - centerX) / centerX;
                const normalizedY = (centerY - y) / centerY;
                const maxTilt = 8;
                targetRotateX = normalizedY * maxTilt;
                targetRotateY = normalizedX * maxTilt;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        this._tiltMouseMoveHandler = handleMouseMove;
    }

    disconnectedCallback() {
        if (this._tiltMouseMoveHandler) {
            document.removeEventListener('mousemove', this._tiltMouseMoveHandler);
        }
    }
}

customElements.define('phone-showcase', PhoneShowcase);