class DashboardPromo extends HTMLElement {
    constructor() {
        super();
        this.animationFrame = null;
    }

    connectedCallback() {
        this.render();
        this.initVideoControls();
        this.startIconAnimation();
    }

    disconnectedCallback() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    render() {
        this.innerHTML = `
            <section class="dashboard-promo">
                <div class="promo-content">
                    <div class="promo-text">
                        <div class="logo-wrapper">
                            <div class="animated-icon">
                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect id="rect-tl" x="4.5" y="4.5" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-tr" x="22.8333" y="4.5" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-bl" x="4.5" y="22.8333" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-br" x="22.8333" y="22.8333" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                </svg>
                            </div>
                            <span class="logo-text">Soralex Studio Dashboard</span>
                        </div>
                        
                        <h2 class="promo-title">
                            Create banners in minutes<br>
                            with our editor
                        </h2>
                        
                        <p class="promo-description">
                            Our in-house editor allows you to create HTML5<br>
                            banners quickly and easily - no coding required.
                        </p>
                        
                        <a href="https://dashboard.mraid.io/" class="promo-cta-btn">
                            Go to Dashboard
                            <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div>

                    <div class="promo-video-wrapper promo-paused">
                        <div class="video-container">
                            <video class="promo-video" playsinline loop>
                                <source src="assets/video/video5.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            
                            <!-- ЦЕНТРАЛЬНЫЙ ОВЕРЛЕЙ: Красный круг с белым треугольником -->
                            <div class="promo-play-overlay">
                                <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="40" cy="40" r="40" fill="#FF0036"/>
                                    <path d="M32 26 L56 40 L32 54 Z" fill="#FFFFFF"/>
                                </svg>
                            </div>
                            
                            <div class="promo-video-controls">
                                <div class="promo-control-bar">
                                    <div class="promo-progress-bar">
                                        <div class="promo-progress-fill"></div>
                                    </div>
                                    <span class="promo-time-display">0:00 / 0:00</span>
                                </div>
                                <div class="promo-control-buttons">
                                    <!-- КНОПКА PLAY/PAUSE: Просто белая иконка -->
                                    <button class="promo-control-btn promo-play-pause-btn" aria-label="Play/Pause">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5v14l11-7z" fill="#FFFFFF"/>
                                        </svg>
                                    </button>
                                    
                                    <!-- КНОПКА RESTART: Просто белая иконка -->
                                    <button class="promo-control-btn promo-restart-btn" aria-label="Restart">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                            <path d="M3 3v5h5"/>
                                        </svg>
                                    </button>
                                    
                                    <!-- КНОПКА FULLSCREEN: Просто белая иконка -->
                                    <button class="promo-control-btn promo-fullscreen-btn" aria-label="Fullscreen">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    initVideoControls() {
        const video = this.querySelector('.promo-video');
        const playPauseBtn = this.querySelector('.promo-play-pause-btn');
        const restartBtn = this.querySelector('.promo-restart-btn');
        const playOverlay = this.querySelector('.promo-play-overlay');
        const progressBar = this.querySelector('.promo-progress-bar');
        const progressFill = this.querySelector('.promo-progress-fill');
        const timeDisplay = this.querySelector('.promo-time-display');
        const videoWrapper = this.querySelector('.promo-video-wrapper');
        const fullscreenBtn = this.querySelector('.promo-fullscreen-btn');

        if (!video) return;

        const togglePlay = () => {
            if (video.paused) {
                video.play();
                videoWrapper.classList.remove('promo-paused');
                playOverlay.style.opacity = '0';
                playOverlay.style.pointerEvents = 'none';
                this.updatePlayButton(playPauseBtn, true);
            } else {
                video.pause();
                videoWrapper.classList.add('promo-paused');
                playOverlay.style.opacity = '1';
                playOverlay.style.pointerEvents = 'auto';
                this.updatePlayButton(playPauseBtn, false);
            }
        };

        playPauseBtn.addEventListener('click', togglePlay);
        playOverlay.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        restartBtn.addEventListener('click', () => {
            video.currentTime = 0;
            video.play();
            videoWrapper.classList.remove('promo-paused');
            playOverlay.style.opacity = '0';
            playOverlay.style.pointerEvents = 'none';
            this.updatePlayButton(playPauseBtn, true);
        });

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressFill.style.width = progress + '%';
                
                const currentTime = this.formatTime(video.currentTime);
                const duration = this.formatTime(video.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        progressBar.addEventListener('click', (e) => {
            if (video.duration) {
                const rect = progressBar.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                video.currentTime = pos * video.duration;
            }
        });

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (videoWrapper.requestFullscreen) videoWrapper.requestFullscreen();
                    else if (videoWrapper.webkitRequestFullscreen) videoWrapper.webkitRequestFullscreen();
                    else if (videoWrapper.msRequestFullscreen) videoWrapper.msRequestFullscreen();
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    else if (document.msExitFullscreen) document.msExitFullscreen();
                }
            });
        }
    }

    // ОБНОВЛЕНО: Теперь генерирует ТОЛЬКО белые иконки без красных кругов
    updatePlayButton(button, isPlaying) {
        if (!button) return;
        if (isPlaying) {
            // Белая иконка Pause
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="#FFFFFF"/>
                </svg>
            `;
        } else {
            // Белая иконка Play
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="#FFFFFF"/>
                </svg>
            `;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    startIconAnimation() {
        const rectTL = this.querySelector('#rect-tl');
        const rectTR = this.querySelector('#rect-tr');
        const rectBL = this.querySelector('#rect-bl');
        const rectBR = this.querySelector('#rect-br');

        if (!rectTL || !rectTR || !rectBL || !rectBR) return;

        const bigHeight = 13.6667;
        const smallHeight = 6.8333;
        const fixedBottomY = 29.0; 

        let startTime = null;
        const duration = 3000;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;
            const t = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;

            const tlHeight = smallHeight + (bigHeight - smallHeight) * t;
            rectTL.setAttribute('y', 4.5);
            rectTL.setAttribute('height', tlHeight);

            const blHeight = bigHeight - (bigHeight - smallHeight) * t;
            rectBL.setAttribute('y', fixedBottomY - blHeight);
            rectBL.setAttribute('height', blHeight);

            const trHeight = bigHeight - (bigHeight - smallHeight) * t;
            rectTR.setAttribute('y', 4.5);
            rectTR.setAttribute('height', trHeight);

            const brHeight = smallHeight + (bigHeight - smallHeight) * t;
            rectBR.setAttribute('y', fixedBottomY - brHeight);
            rectBR.setAttribute('height', brHeight);

            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}

customElements.define('dashboard-promo', DashboardPromo);