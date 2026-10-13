class PortfolioBuild extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' }); // Оставляем закомментированным
        this.currentPlayable = '2d';
        this.isLoading = false;
    }

    connectedCallback() {
        // ВАЖНО: Замени 'playable_id_...' на реальные ID из твоего portfolio.json
        const features = [
            {
                id: 'variations',
                title: 'Playable variations',
                description: 'Multiple creative variations to test different mechanics, visuals and hooks',
                playableId: 'proj_variations_01', // <-- ID из кэша
                icon: 'variations',
                active: false
            },
            {
                id: '2d',
                title: '2D playable',
                description: 'Custom 2D playables built around your game or product',
                playableId: 'proj_2d_01', // <-- ID из кэша
                icon: '2d',
                active: true
            },
            {
                id: '3d',
                title: '3D Playable',
                description: 'Interactive 3D experiences with characters, environments and animations',
                playableId: 'proj_3d_01', // <-- ID из кэша
                icon: '3d',
                active: false
            },
            {
                id: 'banners',
                title: 'Banners, videos, etc.',
                description: 'Interactive banners for your advertising',
                playableId: 'proj_banners_01', // <-- ID из кэша
                icon: 'banners',
                active: false
            },
            {
                id: 'fullcycle',
                title: 'Full-cycle production',
                description: 'Concept Art → Development → Testing Builds. We handle the entire production',
                playableId: 'proj_fullcycle_01', // <-- ID из кэша
                icon: 'fullcycle',
                active: false
            },
            {
                id: 'reskin',
                title: 'Reskin from library',
                description: 'Quick & cost-effective way to launch a playable with proven performance',
                playableId: 'proj_reskin_01', // <-- ID из кэша
                icon: 'reskin',
                active: false
            }
        ];

        this.innerHTML = `
            <section class="pb-section">
                <div class="pb-header">
                    <h2>What we can build for you?</h2>
                    <a href="#portfolio" class="pb-see-more-link">
                        See more
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </a>
                </div>

                <div class="pb-interactive">
                    <!-- Левая колонка -->
                    <div class="pb-features-left">
                        ${features.slice(0, 3).map((feature) => `
                            <div class="pb-card ${feature.active ? 'active' : ''}" data-feature="${feature.id}">
                                <div class="pb-icon">
                                    ${this.getIcon(feature.icon)}
                                </div>
                                <div class="pb-content">
                                    <h3 class="pb-title">${feature.title}</h3>
                                    <p class="pb-description">${feature.description}</p>
                                </div>
                                ${feature.active ? '<div class="pb-arrow pb-arrow-right"></div>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Телефон по центру -->
                    <div class="pb-phone-container">
                        <img src="assets/img/looper.png" alt="" class="pb-blick-looper" loading="lazy">
                        <img src="assets/img/main-blick.png" alt="" class="pb-blick-main" loading="lazy">
                        
                        
                        <div class="pb-phone-frame">
                            <img src="assets/img/phone.png" alt="Phone frame" class="pb-phone-image">
                            <div class="pb-screen">
                                <!-- Черная полоса сверху -->
                                <div class="pb-bar pb-bar-top"></div>
                                
                                <div class="pb-iframe-wrapper">
                                    <div class="pb-preloader active">
                                        <div class="pb-spinner"></div>
                                    </div>
                                    <iframe 
                                        src="about:blank" 
                                        class="pb-iframe"
                                        frameborder="0"
                                        scrolling="no"
                                        title="buildPhone"
                                    ></iframe>
                                </div>

                                <!-- Черная полоса снизу -->
                                <div class="pb-bar pb-bar-bottom"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Правая колонка -->
                    <div class="pb-features-right">
                        ${features.slice(3).map((feature) => `
                            <div class="pb-card ${feature.active ? 'active' : ''}" data-feature="${feature.id}">
                                ${feature.active ? '<div class="pb-arrow pb-arrow-left"></div>' : ''}
                                <div class="pb-icon">
                                    ${this.getIcon(feature.icon)}
                                </div>
                                <div class="pb-content">
                                    <h3 class="pb-title">${feature.title}</h3>
                                    <p class="pb-description">${feature.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        this.initFeatures(features);
    }

    getIcon(type) {
        const icons = {
            'variations': `<svg width="56" height="42" viewBox="0 0 56 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.125 42C25.5006 42 23.9426 41.3547 22.794 40.206C21.6453 39.0574 21 37.4995 21 35.875V6.125C21 2.744 23.744 0 27.125 0H49.875C53.256 0 56 2.744 56 6.125V35.875C56 37.4995 55.3547 39.0574 54.206 40.206C53.0574 41.3547 51.4995 42 49.875 42H27.125ZM26.25 35.875C26.25 36.358 26.642 36.75 27.125 36.75H49.875C50.1071 36.75 50.3296 36.6578 50.4937 36.4937C50.6578 36.3296 50.75 36.1071 50.75 35.875V6.125C50.75 5.89294 50.6578 5.67038 50.4937 5.50628C50.3296 5.34219 50.1071 5.25 49.875 5.25H27.125C26.8929 5.25 26.6704 5.34219 26.5063 5.50628C26.3422 5.67038 26.25 5.89294 26.25 6.125V35.875ZM17.15 5.278C17.3227 5.5765 17.4349 5.9061 17.4802 6.24798C17.5254 6.58985 17.5029 6.93729 17.4138 7.27045C17.3248 7.60361 17.1709 7.91596 16.9611 8.18964C16.7513 8.46333 16.4896 8.69299 16.191 8.8655C16.0571 8.942 15.9458 9.05254 15.8683 9.18591C15.7909 9.31929 15.7501 9.47077 15.75 9.625V32.375C15.75 32.69 15.918 32.9805 16.191 33.1345C16.7934 33.4835 17.2326 34.0576 17.4117 34.7304C17.5909 35.4031 17.4955 36.1196 17.1465 36.722C16.7975 37.3244 16.2234 37.7636 15.5506 37.9427C14.8779 38.1219 14.1614 38.0265 13.559 37.6775C12.6288 37.1396 11.8565 36.3665 11.3196 35.4358C10.7826 34.5051 10.5 33.4495 10.5 32.375V9.625C10.5 7.3535 11.7355 5.376 13.559 4.319C13.8575 4.1463 14.1871 4.03411 14.529 3.98885C14.8709 3.94358 15.2183 3.96612 15.5515 4.05518C15.8846 4.14424 16.197 4.29682 16.4706 4.50789C16.7443 4.7177 16.9775 4.97939 17.15 5.278ZM5.6875 12.3655C5.55358 12.442 5.44226 12.5525 5.36481 12.6859C5.28737 12.8193 5.24655 12.9708 5.2465 13.125V28.875C5.2465 29.19 5.4145 29.4805 5.6875 29.6345C5.9858 29.8073 6.24714 30.0372 6.45659 30.311C6.66605 30.5848 6.81952 30.8972 6.90825 31.2304C6.99697 31.5635 7.01922 31.9108 6.97371 32.2526C6.9282 32.5943 6.81582 32.9237 6.643 33.222C6.47018 33.5203 6.2403 33.7816 5.96648 33.9911C5.69267 34.2005 5.38027 34.354 5.04714 34.4427C4.71401 34.5315 4.36667 34.5537 4.02494 34.5082C3.68322 34.4627 3.3538 34.3503 3.0555 34.1775C2.12597 33.6392 1.35434 32.8659 0.818042 31.9352C0.281741 31.0045 -0.000373014 29.9492 2.59792e-06 28.875V13.125C-0.000987138 12.0503 0.280836 10.9942 0.817167 10.0628C1.3535 9.13144 2.12545 8.3576 3.0555 7.819C3.35403 7.64618 3.68367 7.53385 4.02561 7.48843C4.36755 7.44301 4.71509 7.46538 5.04838 7.55427C5.38167 7.64316 5.69419 7.79682 5.9681 8.00649C6.24201 8.21616 6.47193 8.47772 6.64475 8.77625C6.81757 9.07478 6.9299 9.40442 6.97532 9.74636C7.02075 10.0883 6.99837 10.4358 6.90949 10.7691C6.8206 11.1024 6.66693 11.4149 6.45726 11.6888C6.24759 11.9628 5.98603 12.1927 5.6875 12.3655Z" fill="#FF0034"/></svg>`,
            '2d': `<svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.08163" y="2.08163" width="46.8367" height="46.8367" rx="3.12245" stroke="#FF0034" stroke-width="4.16327"/></svg>`,
            '3d': `<svg width="53" height="62" viewBox="0 0 53 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M49.918 15.2335V43.3975C49.918 44.3402 49.415 45.2114 48.5985 45.6828L26.168 58.6331L3.73741 45.6828C2.92094 45.2114 2.41797 44.3402 2.41797 43.3975V15.2335L24.8864 2.75104C25.6834 2.30826 26.6525 2.30826 27.4495 2.75104L49.918 15.2335ZM2.41797 15.2335L26.168 28.9456M26.168 58.6331V28.9456M49.918 15.2335L26.168 28.9456" stroke="#FF0034" stroke-width="4.83654" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            'banners': `<svg width="53" height="62" viewBox="0 0 53 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M49.918 15.2335V43.3975C49.918 44.3402 49.415 45.2114 48.5985 45.6828L26.168 58.6331L3.73741 45.6828C2.92094 45.2114 2.41797 44.3402 2.41797 43.3975V15.2335L24.8864 2.75104C25.6834 2.30826 26.6525 2.30826 27.4495 2.75104L49.918 15.2335ZM2.41797 15.2335L26.168 28.9456M26.168 58.6331V28.9456M49.918 15.2335L26.168 28.9456" stroke="#FF0034" stroke-width="4.83654" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            'fullcycle': `<svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.3555 20.9025C20.2457 16.5566 23.2783 15.0878 29.1449 14.0078C35.0115 15.0921 38.0441 16.5566 42.9343 20.9025L29.1449 27.7973L15.3555 20.9025Z" stroke="#FF0034" stroke-width="4.32" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.1588 27.7684V43.8863M15.3693 20.9082C13.6716 25.5738 13.6543 31.138 15.0021 35.8252C15.2289 36.5935 15.6802 37.2765 16.2981 37.7864C20.5663 41.3461 23.4866 42.6551 28.2472 43.6962C28.848 43.8259 29.4695 43.8259 30.0703 43.6962C34.8309 42.6551 37.7512 41.3461 42.0151 37.7864C42.6346 37.2771 43.0874 36.594 43.3154 35.8252C44.6632 31.138 44.646 25.5738 42.9482 20.9082L29.1588 27.8029L15.3693 20.9082Z" stroke="#FF0034" stroke-width="4.32" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.16016 29.1706C2.15784 23.1598 4.1613 17.3201 7.85314 12.5767C11.545 7.8333 16.7141 4.45744 22.5415 2.98398C28.3689 1.51052 34.5213 2.02371 40.0241 4.44225C45.5268 6.8608 50.0652 11.0464 52.9202 16.3359C53.2485 11.5752 53.1491 8.85365 52.4882 3.91589M56.1602 29.1706C56.162 35.1688 54.1665 40.9969 50.4885 45.7351C46.8104 50.4733 41.6593 53.8519 35.8481 55.3377C30.0368 56.8234 23.8962 56.3318 18.3953 53.9403C12.8944 51.5488 8.34654 47.3937 5.46928 42.1306C5.14096 46.8912 5.236 49.6128 5.90128 54.5506" stroke="#FF0034" stroke-width="4.32" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            'reskin': `<svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.7 11.4H0V51.3C0 54.435 2.565 57 5.7 57H45.6V51.3H5.7V11.4ZM51.3 0H17.1C13.965 0 11.4 2.565 11.4 5.7V39.9C11.4 43.035 13.965 45.6 17.1 45.6H51.3C54.435 45.6 57 43.035 57 39.9V5.7C57 2.565 54.435 0 51.3 0ZM51.3 39.9H17.1V5.7H51.3V39.9ZM31.35 34.2H37.05V25.65H45.6V19.95H37.05V11.4H31.35V19.95H22.8V25.65H31.35V34.2Z" fill="#FF0034"/></svg>`
        };
        return icons[type] || icons['2d'];
    }

    async initFeatures(features) {
        // ВАЖНО: используем this.querySelectorAll, а не this.shadowRoot
        const cards = this.querySelectorAll('.pb-card');
        const preloader = this.querySelector('.pb-preloader');
        const iframe = this.querySelector('.pb-iframe');

        const hideLoading = () => {
            setTimeout(() => {
                if (preloader) preloader.classList.remove('active');
                this.isLoading = false;
            }, 300); // Небольшая задержка для плавности
        };

        const loadPlayable = async (featureId, card) => {
            if (this.isLoading) return;
            this.isLoading = true;

            const feature = features.find(f => f.id === featureId);
            
            if (feature) {
                // Сброс активных классов
                cards.forEach(c => {
                    c.classList.remove('active');
                    const arrow = c.querySelector('.pb-arrow');
                    if (arrow) arrow.remove();
                });
                
                // Активация текущей
                card.classList.add('active');
                const arrow = document.createElement('div');
                arrow.className = 'pb-arrow ' + (card.closest('.pb-features-left') ? 'pb-arrow-right' : 'pb-arrow-left');
                
                if (card.closest('.pb-features-left')) {
                    card.appendChild(arrow);
                } else {
                    card.insertBefore(arrow, card.firstChild);
                }

                if (preloader) preloader.classList.add('active');

                try {
                    // Загрузка из кэша
                    const data = await window.PortfolioDataCache.getData();
                    // Ищем проект по ID. Если не найден, берем первый попавшийся для демо
                    const project = data.previews.find(p => p.id === feature.playableId) || data.previews[0];
                    
                    if (project && project.url) {
                        iframe.src = project.url;
                        
                        // Ждем загрузки iframe, чтобы убрать прелоадер
                        iframe.onload = () => {
                            hideLoading();
                        };
                        
                        // Fallback: если onload не сработал (CORS), убираем через 2 секунды
                        setTimeout(() => {
                            if (this.isLoading) hideLoading();
                        }, 2000);
                    } else {
                        hideLoading();
                    }
                } catch (error) {
                    console.error('Ошибка загрузки playable из кэша:', error);
                    hideLoading();
                }
            }
        };

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const featureId = card.dataset.feature;
                loadPlayable(featureId, card);
            });
        });

        // Загружаем активный элемент при инициализации
        const activeCard = this.querySelector('.pb-card.active');
        if (activeCard) {
            loadPlayable(activeCard.dataset.feature, activeCard);
        }
    }
}

customElements.define('portfolio-build', PortfolioBuild);