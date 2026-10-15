class ProcessSteps extends HTMLElement {
    constructor() {
        super();
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    connectedCallback() {
        const processItems = [
            {
                number: '01',
                title: 'Idea & Concept',
                description: 'We turn your brief or idea into playable concepts, mechanics and scenarios',
                icon: 'assets/img/process/idea.svg',
                image: 'assets/img/process/preview/preview2.png',
                aiText: 'AI explores multiple concepts and creative directions in minutes'
            },
            {
                number: '02',
                title: 'Game design',
                description: 'We design engaging mechanics and map out key screens and flows',
                icon: 'assets/img/process/game.svg',
                image: 'assets/img/process/preview/preview3.png',
                aiText: 'AI helps generate, test and balance gameplay ideas and user flows'
            },
            {
                number: '03',
                title: 'Art & Animation',
                description: 'We create high-quality visuals and animations that bring your playable to life',
                icon: 'assets/img/process/art.svg',
                image: 'assets/img/process/preview/preview4.png',
                aiText: 'AI accelerates asset creation, style exploration and animation variations'
            },
            {
                number: '04',
                title: 'Development',
                description: 'We build clean, optimized HTML5 code for maximum performance',
                icon: 'assets/img/process/dev.svg',
                image: 'assets/img/process/preview/preview5.png',
                aiText: 'AI assists with code generation, optimization and debugging'
            },
            {
                number: '05',
                title: 'Testing',
                description: 'We test across devices and ad networks to ensure perfect performance',
                icon: 'assets/img/process/testing.svg',
                image: 'assets/img/process/preview/preview1.png',
                aiText: 'AI accelerates QA by detecting issues and edge cases early'
            },
            {
                number: '06',
                title: 'Launch & Support',
                description: 'We deliver, monitor results and support your campaign for growth',
                icon: 'assets/img/process/support.svg',
                image: 'assets/img/process/preview/preview6.png',
                aiText: 'AI analyzes performance data to help improve future results'
            }
        ];

        this.innerHTML = `
            <section class="process-grid">
                ${processItems.map((item, index) => `
                    <div class="process-column">
                        <div class="step-card">
                            <div class="step-icon-wrapper">
                                <img src="${item.icon}" alt="${item.title} icon" class="step-icon">
                            </div>
                            <span class="step-number">${item.number}</span>
                            <h3 class="step-title">${item.title}</h3>
                            <p class="step-description">${item.description}</p>
                            <div class="step-arrow"></div>
                        </div>

                        <div class="preview-card">
                            <img src="${item.image}" alt="${item.title} preview">
                        </div>

                        <div class="ai-feature">
                            <span class="ai-diamond">✦</span>
                            <p>${item.aiText}</p>
                        </div>
                    </div>
                `).join('')}
            </section>
            <div class="slider-controls">
                <button class="slider-btn slider-prev" aria-label="Previous slide">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="proccers-slider-dots"></div>
                <button class="slider-btn slider-next" aria-label="Next slide">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

        this.initSlider();
    }

    initSlider() {
        const columns = this.querySelectorAll('.process-column');
        const dotsContainer = this.querySelector('.proccers-slider-dots');
        const prevBtn = this.querySelector('.slider-prev');
        const nextBtn = this.querySelector('.slider-next');

        // Создаем точки
        columns.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Обработчики кнопок
        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Свайп для мобильных
        this.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        this.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (window.innerWidth <= 768) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
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
        const columns = this.querySelectorAll('.process-column');
        const dots = this.querySelectorAll('.slider-dot');
        
        this.currentSlide = index;
        
        columns.forEach((col, i) => {
            if (window.innerWidth <= 768) {
                col.style.transform = `translateX(-${index * 100}%)`;
            } else {
                col.style.transform = '';
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        const columns = this.querySelectorAll('.process-column');
        const maxSlide = columns.length - 1;
        if (this.currentSlide < maxSlide) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            this.goToSlide(0);
        }
    }

    prevSlide() {
        const columns = this.querySelectorAll('.process-column');
        const maxSlide = columns.length - 1;
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            this.goToSlide(maxSlide);
        }
    }
}

customElements.define('process-steps', ProcessSteps);