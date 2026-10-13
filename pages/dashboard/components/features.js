class DashboardFeatures extends HTMLElement {
    constructor() {
        super();
        this.activeFeature = 0;
    }

    connectedCallback() {
        const features = [
            {
                icon: 'assets/img/dashboard/features/icon1.png',
                title: 'Easy customization',
                subtitle: 'No code. Just results',
                description: 'Customize playables without limits',
                details: 'Change text, images, colors, characters, logos and more. Make each playable match your brand and campaign',
                items: [
                    'Edit texts & fonts',
                    'Replace images & logos',
                    'Adjust colors & themes',
                    'Move & resize any element'
                ],
                video: 'assets/video/video1.mp4'
            },
            {
                icon: 'assets/img/dashboard/features/icon2.png',
                title: 'AI asset generation',
                subtitle: 'Create unique visuals in seconds',
                description: 'Generate assets with AI',
                details: 'Use AI to create backgrounds, characters, icons and other visual elements automatically',
                items: [
                    'AI-powered background generation',
                    'Character creation',
                    'Icon and UI generation',
                    'Style transfer'
                ],
                video: 'assets/video/video2.mp4'
            },
            {
                icon: 'assets/img/dashboard/features/icon3.png',
                title: 'Responsive preview',
                subtitle: 'Test across devices and ratios',
                description: 'See changes instantly',
                details: 'Preview your playable on different devices and orientations in real-time',
                items: [
                    'Multi-device preview',
                    'Portrait and landscape modes',
                    'Real-time updates',
                    'Device frame simulation'
                ],
                video: 'assets/video/video3.mp4'
            },
            {
                icon: 'assets/img/dashboard/features/icon4.png',
                title: 'Export & build',
                subtitle: 'Production ready builds for all major networks',
                description: 'Export anywhere',
                details: 'Build and export to all major ad platforms in one click',
                items: [
                    'One-click export',
                    'All major ad networks',
                    'Automatic optimization',
                    'Batch export'
                ],
                video: 'assets/video/video4.mp4'
            },
            {
                icon: 'assets/img/dashboard/features/icon5.png',
                title: 'Version control',
                subtitle: 'Save, manage and compare all your versions',
                description: 'Track changes',
                details: 'Keep track of all changes and easily rollback to previous versions',
                items: [
                    'Automatic versioning',
                    'Compare versions',
                    'Quick rollback',
                    'Change history'
                ],
                video: 'assets/video/video5.mp4'
            }
        ];

        this.features = features;

        this.innerHTML = `
            <section class="df-section">
                <h2 class="df-heading">Powerful features</h2>
                
                <div class="df-container">
                    <div class="df-list">
                        ${features.map((feature, index) => `
                            <div class="df-item ${index === this.activeFeature ? 'df-active' : ''}" 
                                data-index="${index}">
                                <div class="df-icon-wrapper">
                                    <img src="${feature.icon}" alt="${feature.title}" class="df-icon">
                                </div>
                                <div class="df-text">
                                    <h3 class="df-title">${feature.title}</h3>
                                    <p class="df-subtitle">${feature.subtitle}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="df-panel">
                        <div class="df-content">
                            <div class="df-content-header">
                                <h3 class="df-content-title">${features[this.activeFeature].description}</h3>
                                <p class="df-content-description">${features[this.activeFeature].details}</p>
                                <ul class="df-content-list">
                                    ${features[this.activeFeature].items.map(item => `
                                        <li>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 13L9 17L19 7" stroke="#FF0036" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>${item}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>

                        <div class="df-video-wrapper df-paused">
                            <div class="df-video-container">
                                <video class="df-video" 
                                    src="${features[this.activeFeature].video}" 
                                    loop 
                                    playsinline>
                                </video>
                                
                                <div class="df-play-overlay">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                                
                                <div class="df-video-controls">
                                    <div class="df-control-bar">
                                        <div class="df-progress-bar">
                                            <div class="df-progress-fill"></div>
                                        </div>
                                        <span class="df-time-display">0:00 / 0:00</span>
                                    </div>
                                    <div class="df-control-buttons">
                                        <button class="df-control-btn df-play-pause-btn">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </button>
                                        <button class="df-control-btn df-restart-btn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                <path d="M3 3v5h5"/>
                                            </svg>
                                        </button>
                                        <button class="df-control-btn df-fullscreen-btn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.initFeatures();
        this.initVideoControls();
    }

    initFeatures() {
        const featureItems = this.querySelectorAll('.df-item');
        
        featureItems.forEach((item) => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                
                featureItems.forEach(i => i.classList.remove('df-active'));
                item.classList.add('df-active');
                
                this.activeFeature = index;
                
                this.updateContent();
                this.switchVideo();
            });
        });
    }

    updateContent() {
        const feature = this.features[this.activeFeature];
        const contentHeader = this.querySelector('.df-content-header');
        
        if (!contentHeader) return;

        contentHeader.classList.add('df-fade-out');

        setTimeout(() => {
            const title = contentHeader.querySelector('.df-content-title');
            const description = contentHeader.querySelector('.df-content-description');
            const list = contentHeader.querySelector('.df-content-list');

            if (title) title.textContent = feature.description;
            if (description) description.textContent = feature.details;

            if (list) {
                const listItems = list.querySelectorAll('li span');
                feature.items.forEach((item, index) => {
                    if (listItems[index]) {
                        listItems[index].textContent = item;
                    }
                });
            }

            contentHeader.classList.remove('df-fade-out');
            contentHeader.classList.add('df-fade-in');

            setTimeout(() => {
                contentHeader.classList.remove('df-fade-in');
            }, 300);
        }, 200);
    }

    switchVideo() {
        const video = this.querySelector('.df-video');
        if (video) {
            video.pause();
            video.src = this.features[this.activeFeature].video;
            video.load();
        }
    }

    initVideoControls() {
        const video = this.querySelector('.df-video');
        const playPauseBtn = this.querySelector('.df-play-pause-btn');
        const restartBtn = this.querySelector('.df-restart-btn');
        const playOverlay = this.querySelector('.df-play-overlay');
        const progressBar = this.querySelector('.df-progress-bar');
        const progressFill = this.querySelector('.df-progress-fill');
        const timeDisplay = this.querySelector('.df-time-display');
        const videoWrapper = this.querySelector('.df-video-wrapper');

        if (!video) return;

        const togglePlay = () => {
            if (video.paused) {
                video.play();
                videoWrapper.classList.remove('df-paused');
                playOverlay.style.display = 'none';
                this.updatePlayButton(playPauseBtn, true);
            } else {
                video.pause();
                videoWrapper.classList.add('df-paused');
                playOverlay.style.display = 'flex';
                this.updatePlayButton(playPauseBtn, false);
            }
        };

        playPauseBtn.addEventListener('click', togglePlay);
        playOverlay.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        restartBtn.addEventListener('click', () => {
            video.currentTime = 0;
            video.play();
            videoWrapper.classList.remove('df-paused');
            playOverlay.style.display = 'none';
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

        const fullscreenBtn = this.querySelector('.df-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (video.requestFullscreen) video.requestFullscreen();
                    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                    else if (video.msRequestFullscreen) video.msRequestFullscreen();
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    else if (document.msExitFullscreen) document.msExitFullscreen();
                }
            });
        }
    }

    updatePlayButton(button, isPlaying) {
        if (!button) return;
        if (isPlaying) {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            `;
        } else {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
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
}

customElements.define('dashboard-features', DashboardFeatures);