class AppPreloader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.progressBar = null;
        this.currentProgress = 0;
    }

    connectedCallback() {
        // ЖЕСТКО блокируем скролл
        document.documentElement.classList.add('preloader-active');
        document.body.classList.add('preloader-active');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #0D0D0F;
                    z-index: 99999;
                    transition: opacity 0.6s ease, visibility 0.6s ease;
                }

                .top-progress-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: #FF0036;
                    width: 0%;
                    box-shadow: 0 0 15px rgba(255, 0, 54, 0.8);
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .preloader-container {
                    max-width: 1440px;
                    margin: 0 auto;
                    padding: 24px 40px;
                }

                .sk-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 80px;
                }
                .sk-logo { width: 160px; height: 40px; border-radius: 4px; }
                .sk-nav { display: flex; gap: 24px; }
                .sk-nav-item { width: 100px; height: 16px; border-radius: 4px; margin-top: 12px; }

                .sk-hero { max-width: 800px; }
                .sk-title { width: 70%; height: 64px; border-radius: 6px; margin-bottom: 24px; }
                .sk-text { width: 85%; height: 20px; border-radius: 4px; margin-bottom: 16px; }
                .sk-text.short { width: 60%; }
                .sk-btn { width: 220px; height: 56px; border-radius: 8px; margin-top: 40px; }

                .skeleton {
                    background: #1a1a1e;
                    background-image: linear-gradient(90deg, #1a1a1e 0px, #2a2a30 40px, #1a1a1e 80px);
                    background-size: 600px;
                    animation: shimmer 1.5s infinite linear;
                }

                @keyframes shimmer {
                    0% { background-position: -100px; }
                    100% { background-position: 600px; }
                }

                .hidden {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }
            </style>

            <div class="top-progress-bar"></div>
            <div class="preloader-container">
                <div class="sk-header">
                    <div class="skeleton sk-logo"></div>
                    <div class="sk-nav">
                        <div class="skeleton sk-nav-item"></div>
                        <div class="skeleton sk-nav-item"></div>
                        <div class="skeleton sk-nav-item"></div>
                        <div class="skeleton sk-nav-item"></div>
                    </div>
                </div>
                <div class="sk-hero">
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-text"></div>
                    <div class="skeleton sk-text"></div>
                    <div class="skeleton sk-text short"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
            </div>
        `;

        this.progressBar = this.shadowRoot.querySelector('.top-progress-bar');

        // Запускаем отслеживание реальной загрузки
        this.trackRealProgress();
    }

    // Обновляем прогресс-бар с плавной анимацией
    setProgress(percent) {
        this.currentProgress = Math.min(100, Math.max(this.currentProgress, percent));
        if (this.progressBar) {
            this.progressBar.style.width = this.currentProgress + '%';
        }
    }

    trackRealProgress() {
        // 1. Быстрый старт: HTML уже загружен, показываем 15%
        this.setProgress(15);

        // 2. Ждём DOMContentLoaded (HTML распарсен, скрипты выполнены)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setProgress(40);
            });
        } else {
            // DOM уже готов
            this.setProgress(40);
        }

        // 3. Ждём window.load (все ресурсы: CSS, шрифты, базовые картинки)
        if (document.readyState === 'complete') {
            this.setProgress(70);
            this.waitForImagesAndFinish();
        } else {
            window.addEventListener('load', () => {
                this.setProgress(70);
                this.waitForImagesAndFinish();
            });
        }

        // 4. Fallback: если что-то зависло, через 10 секунд показываем сайт
        setTimeout(() => {
            this.setProgress(100);
            this.hide();
        }, 100);
    }

    // Ждём загрузки ВСЕХ картинок (включая те, что в Web Components)
    async waitForImagesAndFinish() {
        const allImages = Array.from(document.querySelectorAll('img'));
        const pendingImages = allImages.filter(img => !img.complete);

        if (pendingImages.length === 0) {
            // Все картинки уже загружены
            this.setProgress(100);
            setTimeout(() => this.hide(), 300);
            return;
        }

        // Оставшиеся 30% делим на количество картинок
        const progressPerImage = 30 / pendingImages.length;
        let loadedCount = 0;

        pendingImages.forEach(img => {
            const onImageReady = () => {
                loadedCount++;
                const newProgress = 70 + (progressPerImage * loadedCount);
                this.setProgress(newProgress);

                if (loadedCount === pendingImages.length) {
                    // Все картинки загружены
                    this.setProgress(100);
                    setTimeout(() => this.hide(), 400);
                }
            };

            if (img.complete) {
                onImageReady();
            } else {
                img.addEventListener('load', onImageReady);
                img.addEventListener('error', onImageReady); // Не зависаем на битых картинках
            }
        });
    }

    hide() {
        document.documentElement.classList.remove('preloader-active');
        document.body.classList.remove('preloader-active');
        
        const host = this.shadowRoot.host;
        host.classList.add('hidden');
        host.dispatchEvent(new CustomEvent('preloader-complete'));
        
        setTimeout(() => {
            host.remove();
        }, 600);
    }
}

customElements.define('app-preloader', AppPreloader);

// class AppPreloader extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//         this.progressBar = null;
//         this.progressText = null;
//         this.timeText = null;
//         this.currentProgress = 0;
//         this.startTime = performance.now();
//         this.animationFrame = null;
//         this.creepInterval = null;
//     }

//     connectedCallback() {
//         // Блокируем скролл
//         document.documentElement.classList.add('preloader-active');
//         document.body.classList.add('preloader-active');

//         this.shadowRoot.innerHTML = `
//             <style>
//                 :host {
//                     display: block;
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     width: 100vw;
//                     height: 100vh;
//                     background-color: #0D0D0F;
//                     z-index: 99999;
//                     transition: opacity 0.6s ease, visibility 0.6s ease;
//                 }

//                 .top-progress-bar {
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     height: 3px;
//                     background: #FF0036;
//                     width: 0%;
//                     box-shadow: 0 0 15px rgba(255, 0, 54, 0.8);
//                     transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//                 }

//                 /* === НОВЫЙ БЛОК: Текст по центру === */
//                 .loader-info {
//                     position: absolute;
//                     top: 50%;
//                     left: 50%;
//                     transform: translate(-50%, -50%);
//                     text-align: center;
//                     color: #ffffff;
//                     font-family: 'RobotoMedium', sans-serif;
//                     z-index: 10;
//                 }
//                 .loader-percent {
//                     font-size: 64px;
//                     font-weight: 800;
//                     letter-spacing: 2px;
//                     margin-bottom: 8px;
//                     /* tabular-nums предотвращает "дрожание" цифр при их смене */
//                     font-variant-numeric: tabular-nums; 
//                 }
//                 .loader-time {
//                     font-size: 16px;
//                     color: #888888;
//                     font-family: 'RobotoLight', sans-serif;
//                     letter-spacing: 1px;
//                 }

//                 .preloader-container {
//                     max-width: 1440px;
//                     margin: 0 auto;
//                     padding: 24px 40px;
//                     opacity: 0.3; /* Делаем скелетон чуть тусклее, чтобы акцент был на процентах */
//                 }

//                 .sk-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 80px; }
//                 .sk-logo { width: 160px; height: 40px; border-radius: 4px; }
//                 .sk-nav { display: flex; gap: 24px; }
//                 .sk-nav-item { width: 100px; height: 16px; border-radius: 4px; margin-top: 12px; }

//                 .sk-hero { max-width: 800px; }
//                 .sk-title { width: 70%; height: 64px; border-radius: 6px; margin-bottom: 24px; }
//                 .sk-text { width: 85%; height: 20px; border-radius: 4px; margin-bottom: 16px; }
//                 .sk-text.short { width: 60%; }
//                 .sk-btn { width: 220px; height: 56px; border-radius: 8px; margin-top: 40px; }

//                 .skeleton {
//                     background: #1a1a1e;
//                     background-image: linear-gradient(90deg, #1a1a1e 0px, #2a2a30 40px, #1a1a1e 80px);
//                     background-size: 600px;
//                     animation: shimmer 1.5s infinite linear;
//                 }

//                 @keyframes shimmer {
//                     0% { background-position: -100px; }
//                     100% { background-position: 600px; }
//                 }

//                 .hidden {
//                     opacity: 0;
//                     visibility: hidden;
//                     pointer-events: none;
//                 }
//             </style>

//             <div class="top-progress-bar"></div>
            
//             <div class="loader-info">
//                 <div class="loader-percent">0%</div>
//                 <div class="loader-time">0.0s</div>
//             </div>

//             <div class="preloader-container">
//                 <div class="sk-header">
//                     <div class="skeleton sk-logo"></div>
//                     <div class="sk-nav">
//                         <div class="skeleton sk-nav-item"></div>
//                         <div class="skeleton sk-nav-item"></div>
//                         <div class="skeleton sk-nav-item"></div>
//                         <div class="skeleton sk-nav-item"></div>
//                     </div>
//                 </div>
//                 <div class="sk-hero">
//                     <div class="skeleton sk-title"></div>
//                     <div class="skeleton sk-text"></div>
//                     <div class="skeleton sk-text"></div>
//                     <div class="skeleton sk-text short"></div>
//                     <div class="skeleton sk-btn"></div>
//                 </div>
//             </div>
//         `;

//         this.progressBar = this.shadowRoot.querySelector('.top-progress-bar');
//         this.progressText = this.shadowRoot.querySelector('.loader-percent');
//         this.timeText = this.shadowRoot.querySelector('.loader-time');

//         this.trackRealProgress();
//         this.startTimer();
//         this.startCreep(); // Запускаем плавное "подкрадывание"
//     }

//     setProgress(percent) {
//         this.currentProgress = Math.min(100, Math.max(this.currentProgress, percent));
//         if (this.progressBar) {
//             this.progressBar.style.width = this.currentProgress + '%';
//         }
//         if (this.progressText) {
//             this.progressText.textContent = Math.round(this.currentProgress) + '%';
//         }
//     }

//     // Таймер секунд
//     startTimer() {
//         const updateTimer = () => {
//             const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(1);
//             if (this.timeText) {
//                 this.timeText.textContent = elapsed + 's';
//             }
//             if (this.currentProgress < 100) {
//                 this.animationFrame = requestAnimationFrame(updateTimer);
//             }
//         };
//         this.animationFrame = requestAnimationFrame(updateTimer);
//     }

//     // Плавное "подкрадывание" (чтобы проценты не стояли на месте, пока грузится тяжелый JS)
//     startCreep() {
//         this.creepInterval = setInterval(() => {
//             if (this.currentProgress < 90) {
//                 this.setProgress(this.currentProgress + 0.5);
//             }
//         }, 200);
//     }

//     trackRealProgress() {
//         this.setProgress(10); // Старт

//         if (document.readyState === 'loading') {
//             document.addEventListener('DOMContentLoaded', () => {
//                 this.setProgress(40);
//             });
//         } else {
//             this.setProgress(40);
//         }

//         if (document.readyState === 'complete') {
//             this.setProgress(70);
//             this.waitForImagesAndFinish();
//         } else {
//             window.addEventListener('load', () => {
//                 this.setProgress(70);
//                 this.waitForImagesAndFinish();
//             });
//         }

//         // Fallback: если что-то зависло, через 8 секунд принудительно показываем сайт
//         setTimeout(() => {
//             this.setProgress(100);
//             this.hide();
//         }, 1000);
//     }

//     async waitForImagesAndFinish() {
//         const allImages = Array.from(document.querySelectorAll('img'));
//         const pendingImages = allImages.filter(img => !img.complete);

//         if (pendingImages.length === 0) {
//             this.setProgress(100);
//             setTimeout(() => this.hide(), 300);
//             return;
//         }

//         const progressPerImage = 25 / pendingImages.length; // Оставляем 25% на картинки
//         let loadedCount = 0;

//         pendingImages.forEach(img => {
//             const onImageReady = () => {
//                 loadedCount++;
//                 const newProgress = 75 + (progressPerImage * loadedCount);
//                 this.setProgress(newProgress);

//                 if (loadedCount === pendingImages.length) {
//                     this.setProgress(100);
//                     setTimeout(() => this.hide(), 400);
//                 }
//             };

//             if (img.complete) {
//                 onImageReady();
//             } else {
//                 img.addEventListener('load', onImageReady);
//                 img.addEventListener('error', onImageReady);
//             }
//         });
//     }

//     hide() {
//         // Останавливаем все анимации и таймеры
//         if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
//         if (this.creepInterval) clearInterval(this.creepInterval);

//         document.documentElement.classList.remove('preloader-active');
//         document.body.classList.remove('preloader-active');
        
//         const host = this.shadowRoot.host;
//         host.classList.add('hidden');
//         host.dispatchEvent(new CustomEvent('preloader-complete'));
        
//         setTimeout(() => {
//             host.remove();
//         }, 600);
//     }
// }

// customElements.define('app-preloader', AppPreloader);