class PlayableModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.urls = [];
        this.currentIndex = 0;
        this.currentDevice = 'iphone-x';
        this.currentOrientation = 'portrait';
        this.handleKeydown = this.handleKeydown.bind(this);
        this.lastClickTime = 0;
        this.clickCount = 0;
        
        this.deviceSizes = {
            'iphone-x': { portrait: { width: 420, height: 909 }, landscape: { width: 974, height: 450 } },
            'iphone': { portrait: { width: 450, height: 800 }, landscape: { width: 800, height: 450 } },
            'ipad': { portrait: { width: 654, height: 873 }, landscape: { width: 1164, height: 873 } },
            // 'square': { portrait: { width: 850, height: 850 }, landscape: { width: 850, height: 850 } }
        };
    }

    connectedCallback() {
        this.render();
        this.cacheDOM();
        this.bindEvents();
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeydown);
    }

    cacheDOM() {
        this.backdrop = this.shadowRoot.querySelector('.modal-backdrop');
        this.iframe = this.shadowRoot.querySelector('.playable-iframe');
        this.deviceFrame = this.shadowRoot.querySelector('.device-frame');
        this.closeBtn = this.shadowRoot.querySelector('.close-btn');
        this.prevBtn = this.shadowRoot.querySelector('.nav-btn.prev');
        this.nextBtn = this.shadowRoot.querySelector('.nav-btn.next');
        this.counter = this.shadowRoot.querySelector('.counter');
        this.deviceButtons = this.shadowRoot.querySelectorAll('.device-btn');
        this.rotationHint = this.shadowRoot.querySelector('.rotation-hint');
        this.modalBody = this.shadowRoot.querySelector('.modal-body');
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        this.deviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.currentTarget.dataset.device;
                
                // Если кликнули на уже выбранное устройство — поворачиваем
                if (device === this.currentDevice && device !== 'square') {
                    this.toggleOrientation();
                } else {
                    this.setDevice(device);
                }
            });
        });
        
        // Двойной клик по телефону — используем dblclick событие
        this.deviceFrame.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.currentDevice !== 'square') {
                this.toggleOrientation();
            }
        });
        
        // Предотвращаем стандартный dblclick (выделение текста)
        this.deviceFrame.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
    }

    setDevice(device) {
        this.currentDevice = device;
        // При смене устройства сбрасываем на portrait
        this.currentOrientation = 'portrait';
        
        this.deviceButtons.forEach(btn => {
            const isActive = btn.dataset.device === device;
            btn.classList.toggle('active', isActive);
            // Убираем поворот со всех иконок
            btn.classList.remove('icon-rotated');
        });
        
        if (device === 'square') {
            this.rotationHint.style.opacity = '0.3';
            this.rotationHint.style.pointerEvents = 'none';
        } else {
            this.rotationHint.style.opacity = '1';
            this.rotationHint.style.pointerEvents = 'auto';
        }
        
        this.updateDeviceSize();
    }

    toggleOrientation() {
        if (this.currentDevice === 'square') return;
        
        this.currentOrientation = this.currentOrientation === 'portrait' ? 'landscape' : 'portrait';
        
        // Поворачиваем активную иконку
        this.deviceButtons.forEach(btn => {
            if (btn.dataset.device === this.currentDevice) {
                btn.classList.toggle('icon-rotated', this.currentOrientation === 'landscape');
            }
        });
        
        this.updateDeviceSize();
    }

    updateDeviceSize() {
        const size = this.deviceSizes[this.currentDevice][this.currentOrientation];
        
        const bodyRect = this.modalBody.getBoundingClientRect();
        const maxWidth = bodyRect.width - 160;
        const maxHeight = bodyRect.height - 40;
        
        const scaleX = maxWidth / size.width;
        const scaleY = maxHeight / size.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        // Сначала убираем transition чтобы мгновенно установить размер
        this.deviceFrame.style.transition = 'none';
        this.deviceFrame.style.width = size.width + 'px';
        this.deviceFrame.style.height = size.height + 'px';
        
        // Форсируем reflow
        void this.deviceFrame.offsetHeight;
        
        // Теперь анимируем только transform
        this.deviceFrame.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.deviceFrame.style.transform = `scale(${scale})`;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/playableModal.css">
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <div class="device-selector-wrapper">
                        <div class="device-selector">
                            <button class="device-btn active" data-device="iphone-x" title="iPhone X">
                                <svg viewBox="0 0 57 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.7389 4.7C7.84896 4.7 4.69556 7.85639 4.69556 11.75V82.25C4.69556 86.1436 7.84896 89.3 11.7389 89.3H44.6611C48.551 89.3 51.7044 86.1436 51.7044 82.25V11.75C51.7044 7.85639 48.551 4.7 44.6611 4.7H44.6078C43.3111 4.7 42.26 5.75213 42.26 7.05C42.26 10.9436 39.1066 14.1 35.2167 14.1H21.13C17.2401 14.1 14.0867 10.9436 14.0867 7.05C14.0867 5.75213 13.0355 4.7 11.7389 4.7ZM18.3814 4.7C18.641 5.43503 18.7822 6.22601 18.7822 7.05C18.7822 8.34787 19.8334 9.4 21.13 9.4H35.2167C36.5133 9.4 37.5644 8.34787 37.5644 7.05C37.5644 6.22601 37.7057 5.43503 37.9652 4.7H18.3814ZM0 11.75C0 5.26065 5.25568 0 11.7389 0H44.6611C51.1443 0 56.4 5.26065 56.4 11.75V82.25C56.4 88.7393 51.1443 94 44.6611 94H11.7389C5.25568 94 0 88.7393 0 82.25V11.75Z" fill="currentColor"/>
                                    <path d="M16.45 3.525H38.775V10.575H16.45V3.525Z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button class="device-btn" data-device="iphone" title="iPhone">
                                <svg viewBox="0 0 52 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M41.2768 0H9.77436C4.38484 0 0 4.38448 0 9.77454V84.4361C0 89.8256 4.38484 94.2107 9.77436 94.2107H41.2768C46.6667 94.2107 51.0513 89.8255 51.0513 84.4369V9.77454C51.0513 4.38448 46.6667 0 41.2768 0ZM25.5256 88.437C23.3416 88.437 21.5647 86.6598 21.5647 84.4761C21.5647 82.2917 23.3414 80.5152 25.5256 80.5152C27.7095 80.5152 29.4865 82.2917 29.4865 84.4761C29.4865 86.6598 27.7095 88.437 25.5256 88.437ZM45.2647 12.3782V74.9687H5.78641V12.3782H45.2647Z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button class="device-btn" data-device="ipad" title="iPad">
                                <svg viewBox="0 0 69 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M59.7698 0H8.81361C3.3965 0 0 4.3965 0 9.81361V84.3971C0 89.8142 3.3965 94.2107 8.81361 94.2107H59.7698C65.187 94.2107 68.5835 89.8142 68.5835 84.3971V9.81361C68.5835 4.3965 65.187 0 59.7698 0ZM34.2917 90.2852C31.0336 90.2852 28.4036 87.6552 28.4036 84.3971C28.4036 81.1389 31.0336 78.5089 34.2917 78.5089C37.5498 78.5089 40.1799 81.1389 40.1799 84.3971C40.1799 87.6552 37.5498 90.2852 34.2917 90.2852ZM61.7326 75.5835H6.85089V7.77633H61.7326V75.5835Z" fill="currentColor"/>
                                </svg>
                            </button>
                            <!--
                            <button class="device-btn" data-device="square" title="Square 1:1">
                                <svg viewBox="0 0 81 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M70.3421 0H10.6579C4.77474 0 0 4.38667 0 9.79167V84.2083C0 89.6133 4.77474 94 10.6579 94H70.3421C76.2253 94 81 89.6133 81 84.2083V9.79167C81 4.38667 76.2253 0 70.3421 0ZM40.5 90.0833C36.9616 90.0833 35.1053 87.4592 35.1053 84.2083C35.1053 80.9575 36.9616 78.3333 40.5 78.3333C44.0384 78.3333 45.8947 80.9575 45.8947 84.2083C45.8947 87.4592 44.0384 90.0833 40.5 90.0833ZM72.4737 74.4167H8.52632V11.75H72.4737V74.4167Z" fill="currentColor"/>
                                </svg>
                            </button>
                            -->
                        </div>
                        <div class="rotation-hint">Press again to rotate</div>
                    </div>
                    <button class="close-btn" aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <button class="nav-btn prev" aria-label="Previous playable">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="device-frame">
                        <iframe class="playable-iframe" 
                                title="modalScreen"
                                src="" 
                                frameborder="0" 
                                allow="webgl; autoplay; fullscreen; microphone; camera; xr-spatial-tracking"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms">
                        </iframe>
                    </div>
                    <button class="nav-btn next" aria-label="Next playable">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="counter">1 / 100</div>
            </div>
        `;
    }

    open(urls, startIndex = 0) {
        if (!urls || urls.length === 0) return;
        
        this.urls = urls.filter(url => url && url !== '#');
        this.currentIndex = startIndex;
        
        if (this.urls.length === 0) return;

        this.currentDevice = 'iphone-x';
        this.currentOrientation = 'portrait';
        
        this.deviceButtons.forEach(btn => {
            const isActive = btn.dataset.device === 'iphone-x';
            btn.classList.toggle('active', isActive);
            btn.classList.remove('icon-rotated');
        });

        this.updateIframe();
        this.updateNavButtons();
        this.updateCounter();
        
        this.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.updateDeviceSize();
            });
        });
        
        document.addEventListener('keydown', this.handleKeydown);
    }

    close() {
        this.style.display = 'none';
        this.iframe.src = ''; 
        this.urls = [];
        this.currentIndex = 0;
        document.body.style.overflow = ''; 
        document.removeEventListener('keydown', this.handleKeydown);
    }

    next() {
        if (this.currentIndex < this.urls.length - 1) {
            this.currentIndex++;
            this.updateIframe();
            this.updateNavButtons();
            this.updateCounter();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateIframe();
            this.updateNavButtons();
            this.updateCounter();
        }
    }

    updateCounter() {
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.urls.length}`;
        }
    }

    updateIframe() {
        this.iframe.src = this.urls[this.currentIndex];
    }

    updateNavButtons() {
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
        this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        
        this.nextBtn.style.opacity = this.currentIndex === this.urls.length - 1 ? '0.3' : '1';
        this.nextBtn.style.pointerEvents = this.currentIndex === this.urls.length - 1 ? 'none' : 'auto';

        const display = this.urls.length > 1 ? 'flex' : 'none';
        this.prevBtn.style.display = display;
        this.nextBtn.style.display = display;
    }

    handleKeydown(e) {
        if (e.key === 'Escape') this.close();
        else if (e.key === 'ArrowRight') this.next();
        else if (e.key === 'ArrowLeft') this.prev();
    }
}

customElements.define('playable-modal', PlayableModal);