class TopPlayablesSlider extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.cardsPerView = 6;
        this.cardsData = [];
        this.resizeObserver = null;
        
        // === НОВОЕ: флаг для блокировки кликов во время анимации ===
        this.isAnimating = false;
    }

    async connectedCallback() {
        this.innerHTML = `<div style="padding: 40px; text-align: center; color: #888;">Loading top playables...</div>`;
        
        await this.loadData();
        this.render();
        this.initSlider();
        
        this.resizeObserver = new ResizeObserver(() => {
            this.updateCardsPerView();
            this.updateSliderPosition();
        });
        
        const wrapper = this.querySelector('.slider-track-wrapper');
        if (wrapper) {
            this.resizeObserver.observe(wrapper);
        }
    }

    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async loadData() {
        try {
            const data = await window.PortfolioDataCache.getData();
            
            const favoriteProjects = data.previews.filter(item => 
                item.favorite === 1 || item.favorite === true || item.favorite === "1"
            );

            this.cardsData = favoriteProjects.map(item => {
                const category = (item.categories && item.categories.length > 0) 
                    ? item.categories[0] 
                    : 'Playable';
                return {
                    title: item.project || 'Unknown Project',
                    image: item.screenshot || 'assets/img/portfolio/ex_slider.png',
                    url: item.url || '#',
                    category: category
                };
            });

        } catch (error) {
            console.error('Error loading slider data:', error);
            this.cardsData = [];
        }
    }

    render() {
        if (this.cardsData.length === 0) {
            this.innerHTML = `<div style="padding: 40px; text-align: center; color: #888;">No favorite playables found.</div>`;
            return;
        }

        this.innerHTML = `
            
            
            
                <div class="slider-header">
                    <h2>Top performing playables</h2>
                    <a href="#portfolio" class="see-more">
                        See more 
                        <span class="arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
                </div>

                <div class="slider-container">
                    <button class="slider-btn prev-btn" aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <div class="slider-track-wrapper">
                        <div class="slider-track">
                            ${this.cardsData.map((card, index) => `
                                <div class="slider-card" data-index="${index}" data-url="${card.url}">
                                    <div class="card-image">
                                        <img src="${card.image}" alt="${card.title}" loading="lazy" decoding="async">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <button class="slider-btn next-btn" aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div class="slider-dots">
                    ${this.generateDots()}
                </div>
            
        `;
    }

    generateDots() {
        const totalPages = Math.ceil(this.cardsData.length / this.cardsPerView);
        let dots = '';
        for (let i = 0; i < totalPages; i++) {
            dots += `<span class="dot ${i === 0 ? 'active' : ''}" data-page="${i}"></span>`;
        }
        return dots;
    }

    // === НОВЫЙ ХЕЛПЕР: включает анимацию с блокировкой ===
    startAnimation() {
        this.isAnimating = true;
        
        // Снимаем блокировку после завершения CSS-анимации (transitionend)
        // + запасной таймаут на случай, если событие не сработает
        const track = this.querySelector('.slider-track');
        const unlock = () => {
            this.isAnimating = false;
            if (track) track.removeEventListener('transitionend', unlock);
        };
        
        if (track) {
            track.addEventListener('transitionend', unlock, { once: true });
        }
        
        // Запасной план: если transitionend не сработает — разблокируем через 500мс
        // (должно совпадать со значением в CSS: transition: transform 0.5s)
        setTimeout(() => {
            this.isAnimating = false;
        }, 550);
    }

    initSlider() {
        const track = this.querySelector('.slider-track');
        const prevBtn = this.querySelector('.prev-btn');
        const nextBtn = this.querySelector('.next-btn');
        const cards = this.querySelectorAll('.slider-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const clickedIndex = parseInt(card.getAttribute('data-index'));
                
                const allLinks = this.cardsData
                    .map(card => card.url)
                    .filter(link => link && link !== '#');

                if (allLinks.length > 0) {
                    const modal = document.getElementById('global-playable-modal');
                    if (modal && typeof modal.open === 'function') {
                        modal.open(allLinks, clickedIndex);
                    } else {
                        window.open(allLinks[clickedIndex] || allLinks[0], '_blank');
                    }
                }
            });
        });

        this.updateSliderPosition = () => {
            if (!track || !track.querySelector('.slider-card')) return;
            
            const cardWidth = track.querySelector('.slider-card').offsetWidth;
            const gap = 24; 
            const offset = -(this.currentIndex * (cardWidth + gap));
            
            track.style.transform = `translateX(${offset}px)`;

            const currentDots = this.querySelectorAll('.dot');
            currentDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });

            const maxIndex = Math.max(0, Math.ceil(this.cardsData.length / this.cardsPerView) - 1);
            
            if (this.currentIndex > maxIndex) {
                this.currentIndex = maxIndex;
                requestAnimationFrame(() => this.updateSliderPosition());
                return;
            }
            
            prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
            
            nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto';
        };

        // === ИСПРАВЛЕНО: клики на стрелки с проверкой isAnimating ===
        prevBtn.addEventListener('click', () => {
            if (this.isAnimating) return; // <-- блок, если анимация ещё идёт
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.startAnimation();      // <-- включаем флаг
                this.updateSliderPosition();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (this.isAnimating) return; // <-- блок
            const maxIndex = Math.max(0, Math.ceil(this.cardsData.length / this.cardsPerView) - 1);
            if (this.currentIndex < maxIndex) {
                this.currentIndex++;
                this.startAnimation();      // <-- включаем флаг
                this.updateSliderPosition();
            }
        });

        const attachDotListeners = () => {
            this.querySelectorAll('.dot').forEach((dot) => {
                dot.addEventListener('click', () => {
                    if (this.isAnimating) return; // <-- блок и для точек
                    const newIndex = parseInt(dot.dataset.page);
                    if (newIndex !== this.currentIndex) {
                        this.currentIndex = newIndex;
                        this.startAnimation();
                        this.updateSliderPosition();
                    }
                });
            });
        };
        
        attachDotListeners();

        this.updateCardsPerView();
        setTimeout(() => this.updateSliderPosition(), 100);
    }

    updateCardsPerView() {
        const wrapper = this.querySelector('.slider-track-wrapper');
        if (!wrapper) return;
        
        const width = wrapper.offsetWidth;
        
        if (width <= 768) {
            this.cardsPerView = 2;
        } else if (width <= 1024) {
            this.cardsPerView = 3;
        } else if (width <= 1440) {
            this.cardsPerView = 4;
        } else {
            this.cardsPerView = 6;
        }
        
        // === ГЛАВНОЕ ИСПРАВЛЕНИЕ ===
        // Считаем ширину на основе видимой области wrapper, а не абстрактных 100%
        const gap = 24;
        const cardWidth = (width - gap * (this.cardsPerView - 1)) / this.cardsPerView;
        
        // Применяем ширину ко всем карточкам
        const cards = this.querySelectorAll('.slider-card');
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.flexShrink = '0'; // Гарантируем, что они не будут сжиматься
        });
        // ============================
        
        const dotsContainer = this.querySelector('.slider-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.generateDots();
            
            dotsContainer.querySelectorAll('.dot').forEach((dot) => {
                // Удаляем старые слушатели, чтобы не дублировались (хотя innerHTML и так их стирает, но для чистоты)
                const newDot = dot.cloneNode(true);
                dot.parentNode.replaceChild(newDot, dot);
                
                newDot.addEventListener('click', () => {
                    if (this.isAnimating) return;
                    const newIndex = parseInt(newDot.dataset.page);
                    if (newIndex !== this.currentIndex) {
                        this.currentIndex = newIndex;
                        this.startAnimation();
                        this.updateSliderPosition();
                    }
                });
            });
        }
        
        // После пересчета размеров сразу обновляем позицию, чтобы не было скачков
        this.updateSliderPosition();
    }
}

customElements.define('top-playables-slider', TopPlayablesSlider);