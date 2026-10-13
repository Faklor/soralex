class PhoneShowcase extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.inactivityTimer = null;
        this.currentTime = 0;
        this.lastPlayable = null;
    }

    connectedCallback() {
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
        
        // Пути от корня сайта (../../../ поднимает из components в корень)
        const playableSrc = `assets/playables/pl${randomPl}/index.html`;
        const previewSrc = `assets/playables/pl${randomPl}/preview.jpg`;
        
        const iframe = this.shadowRoot.querySelector('.playable-screen');
        const preloaderBg = this.shadowRoot.querySelector('.preloader-bg');
        const preloader = this.shadowRoot.querySelector('.preloader');

        if (iframe) {
            if (preloader) preloader.classList.remove('hidden');
            
            // Меняем картинку фона ПЕРЕД загрузкой iframe
            if (preloaderBg) preloaderBg.src = previewSrc;
            
            iframe.src = playableSrc;
            
            iframe.onload = () => {
                if (preloader) preloader.classList.add('hidden');
            };
        } else {
            this.renderHTML(playableSrc, previewSrc);
        }
        
        this.resetInactivityTimer();
    }

    renderHTML(playableSrc, previewSrc) {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/home/components/css/phoneBlock.css">
            
            <div class="showcase-wrapper">
                <img src="assets/img/main-blick.png" alt="Main Blick" class="bg-blick">
                
                <div class="phone-3d-container">
                    <div class="phone-inner">
                        <!-- ПРЕЛОАДЕР С ОБЫЧНОЙ КАРТИНКОЙ -->
                        <div class="preloader">
                            <img src="${previewSrc}" alt="Preview" class="preloader-bg">
                            <div class="spinner"></div>
                        </div>
                        
                        <iframe src="${playableSrc}" class="playable-screen" frameborder="0" title="Playable Game"></iframe>
                        <div class="screen-reflection"></div>
                        <img src="assets/img/phone.png" alt="Phone Frame" class="phone-frame-img">
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

        // Функция плавного сглаживания (lerp)
        const lerp = (start, end, factor) => {
            return start + (end - start) * factor;
        };

        // Анимационный цикл для плавного движения
        const animate = () => {
            // Сглаживаем текущий угол к целевому (factor 0.1 = очень плавно)
            currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
            currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

            // Применяем трансформацию
            phoneInner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

            // Продолжаем анимацию, пока курсор внутри
            if (isMouseInside) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            
            const isInside = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );

            // Вход курсора
            if (isInside && !isMouseInside) {
                isMouseInside = true;
                phoneInner.style.animation = 'none';
                
                // Запускаем анимационный цикл
                animationFrameId = requestAnimationFrame(animate);
            } 
            // Выход курсора
            else if (!isInside && isMouseInside) {
                isMouseInside = false;
                
                // Останавливаем анимационный цикл
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }

                // Плавно возвращаем в центр
                targetRotateX = 0;
                targetRotateY = 0;
                
                // Запускаем анимацию возврата
                const returnAnimate = () => {
                    currentRotateX = lerp(currentRotateX, 0, 0.1);
                    currentRotateY = lerp(currentRotateY, 0, 0.1);
                    phoneInner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

                    // Продолжаем, пока не достигнем центра (погрешность 0.1°)
                    if (Math.abs(currentRotateX) > 0.1 || Math.abs(currentRotateY) > 0.1) {
                        requestAnimationFrame(returnAnimate);
                    } else {
                        // Возвращаем CSS-анимацию
                        phoneInner.style.animation = 'tilt3d 8s ease-in-out infinite';
                        currentRotateX = 0;
                        currentRotateY = 0;
                    }
                };
                requestAnimationFrame(returnAnimate);
            }

            // Расчет целевого наклона (работает от самого центра)
            if (isMouseInside) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Нормализуем от -1 до 1
                const normalizedX = (x - centerX) / centerX;
                const normalizedY = (centerY - y) / centerY;

                // Максимальный угол 6 градусов (умеренный наклон)
                const maxTilt = 6;
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