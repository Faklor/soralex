class ServicesCards extends HTMLElement {
    constructor() {
        super();
        this.services = [
            { icon: 'assets/img/services/cards/icon1.png', title: 'Video ads', description: 'High-quality video ads for UA campaigns, app stores and social media.', image: 'assets/img/services/cards/card1.png' },
            { icon: 'assets/img/services/cards/icon2.png', title: 'HTML5 banners', description: 'Interactive and animated HTML5 banners for all major ad networks.', image: 'assets/img/services/cards/card2.png' },
            { icon: 'assets/img/services/cards/icon3.png', title: '2D/3D graphics', description: 'Concept art, characters, environments, icons and UI/UX.', image: 'assets/img/services/cards/card3.png' },
            { icon: 'assets/img/services/cards/icon4.png', title: 'Animations (spine / 3D)', description: 'Smooth, eye-catching animations for games, ads and app stores.', image: 'assets/img/services/cards/card4.png' },
            { icon: 'assets/img/services/cards/icon5.png', title: 'Store assets', description: 'Custom assets for App Store, Google Play and other platforms.', image: 'assets/img/services/cards/card5.png' }
        ];
        
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    connectedCallback() { 
        this.render(); 
        // Небольшая задержка, чтобы DOM точно успел отрисоваться перед инициализацией
        requestAnimationFrame(() => this.initSlider());
    }

    render() {
        this.innerHTML = `
            <section class="services-cards-section">
                <div class="services-header">
                    <h2 class="services-title">
                        Everything you need<br>
                        to make your game <span class="text-red">stand out</span>
                    </h2>
                    <p class="services-subtitle">
                        We combine creative thinking, technical expertise and performance insights to deliver assets that look great and get results.
                    </p>
                </div>

                <div class="services-grid">
                    ${this.services.map((service, index) => `
                        <div class="service-card" data-index="${index}">
                            <div class="card-icon-wrapper">
                                <img src="${service.icon}" alt="${service.title}" class="card-icon">
                            </div>
                            <h3 class="card-title">${service.title}</h3>
                            <p class="card-description">${service.description}</p>
                            <div class="card-image-wrapper">
                                <img src="${service.image}" alt="${service.title}" class="card-image">
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="sc-slider-controls">
                    <button class="sc-slider-btn sc-slider-prev" aria-label="Previous service" type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="sc-slider-dots"></div>
                    <button class="sc-slider-btn sc-slider-next" aria-label="Next service" type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </section>
        `;
    }

    initSlider() {
        const cards = this.querySelectorAll('.service-card');
        const dotsContainer = this.querySelector('.sc-slider-dots');
        const prevBtn = this.querySelector('.sc-slider-prev');
        const nextBtn = this.querySelector('.sc-slider-next');

        if (!dotsContainer || cards.length === 0) return;

        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('sc-slider-dot');
            dot.setAttribute('aria-label', `Go to service ${index + 1}`);
            dot.setAttribute('type', 'button');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());

        this.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    goToSlide(index) {
        const cards = this.querySelectorAll('.service-card');
        const dots = this.querySelectorAll('.sc-slider-dot');
        
        this.currentSlide = index;
        
        cards.forEach((card, i) => {
            // Сдвигаем ровно на 100% ширины контейнера для каждого индекса
            card.style.transform = `translateX(-${index * 100}%)`;
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        const cards = this.querySelectorAll('.service-card');
        const maxSlide = cards.length - 1;
        this.goToSlide(this.currentSlide < maxSlide ? this.currentSlide + 1 : 0);
    }

    prevSlide() {
        const cards = this.querySelectorAll('.service-card');
        const maxSlide = cards.length - 1;
        this.goToSlide(this.currentSlide > 0 ? this.currentSlide - 1 : maxSlide);
    }
}

customElements.define('services-cards', ServicesCards);