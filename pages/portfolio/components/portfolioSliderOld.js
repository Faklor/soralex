class PortfolioSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.cardsPerView = 6;
        
        this.allProjects = [];
        this.uniqueCategories = [];
        this.uniqueMechanics = [];
        this.uniqueDimensions = [];
        
        this.currentCategory = '';
        this.currentMechanic = '';
        this.currentDimension = '';
        this.filteredProjects = [];
    }

    async connectedCallback() {
        await this.fetchPortfolioData();
        this.renderSlider();
    }

    async fetchPortfolioData() {
        try {
            const response = await fetch('https://dashboard.mraid.io/portfolio.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            
            this.allProjects = data.previews.map(item => ({
                title: item.project || 'Unknown Project',
                categories: (item.categories && item.categories.length > 0) ? item.categories : ['Other'],
                mechanics: (item.genres && item.genres.length > 0) ? item.genres : ['Other'],
                dimension: (item.formats && item.formats.length > 0) ? item.formats[0].toLowerCase() : '2d',
                image: item.screenshot || 'assets/img/portfolio/ex_slider.png',
                link: item.url || '#'
            }));

           
            this.uniqueCategories = [...new Set(this.allProjects.flatMap(p => p.categories))].sort();

            
            this.currentCategory = this.uniqueCategories[0] || '';
            
           
            this.updateAvailableFilters();

           
            this.applyFilters();

            
            window.PORTFOLIO_TOTAL_COUNT = this.allProjects.length;
            window.dispatchEvent(new CustomEvent('portfolio-data-loaded', { 
                detail: { count: this.allProjects.length } 
            }));

        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            this.allProjects = [];
            this.filteredProjects = [];
        }
    }

    // === АНИМИРОВАННАЯ ФИЛЬТРАЦИЯ ===
    applyFilters() {
        
        this.filteredProjects = this.allProjects.filter(p => {
            const matchCategory = p.categories.includes(this.currentCategory);
            const matchMechanic = p.mechanics.includes(this.currentMechanic);
            const matchDimension = p.dimension === this.currentDimension;

            return matchCategory && matchMechanic && matchDimension;
        });

        const track = this.shadowRoot.querySelector('.slider-track');
        const cards = track ? track.querySelectorAll('.slider-card') : [];

        if (cards.length === 0) {
            this.renderCards();
            this.renderDots();
            this.currentIndex = 0;
            setTimeout(() => this.updateSlider(), 50);
            return;
        }

        cards.forEach(card => card.classList.add('fade-out'));

        setTimeout(() => {
            this.currentIndex = 0;
            this.renderCards();
            this.renderDots();

            const newCards = this.shadowRoot.querySelectorAll('.slider-card');
            newCards.forEach(card => {
                card.classList.add('fade-in');
                void card.offsetWidth; 
                card.classList.remove('fade-in');
            });

            this.updateSlider();
        }, 400);
    }

    renderCards() {
        const track = this.shadowRoot.querySelector('.slider-track');
        if (!track) return;

        if (this.filteredProjects.length === 0) {
            track.innerHTML = '<p style="color:#888; padding:40px; width:100%; text-align:center;">No projects match these filters.</p>';
            return;
        }

        track.innerHTML = this.filteredProjects.map((p, i) => `
            <div class="slider-card" data-index="${i}" data-link="${p.link}">
                <div class="card-image">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                </div>
                <div class="card-info">
                    <span class="card-title">${p.title}</span>
                    <!-- Показываем первую механику из массива для красоты на карточке -->
                    <span class="card-category">${p.dimension.toUpperCase()} • ${this.formatLabel(p.mechanics[0])}</span>
                </div>
            </div>
        `).join('');
    }

    renderDots() {
        const dotsContainer = this.shadowRoot.querySelector('.slider-dots');
        if (!dotsContainer) return;
        dotsContainer.innerHTML = this.generateDots();
    }

    formatLabel(id) {
        return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
    }

    renderSlider() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/portfolio/components/css/portfolioSlider.css">
            <section class="portfolio-slider-section">
                <div class="slider-header">
                    <div class="header-left"><h2>Portfolio & solutions</h2></div>
                    <div class="header-right"><p>Explore our playables, choose the right format for your campaign and find a solution that fits your needs</p></div>
                </div>
                <div class="filter-section">
                    <div class="filter-group">
                        <span class="filter-label">
                            <img src="assets/img/portfolio/categories.png" alt="Categories" class="filter-icon">
                            Categories
                        </span>
                        <div class="filter-buttons">
                            ${this.uniqueCategories.map(cat => `
                                <button class="filter-btn ${cat === this.currentCategory ? 'active' : ''}" data-type="category" data-value="${cat}">
                                    ${this.formatLabel(cat)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <hr class="line-after-categories"/>
                    <div class="filter-row">
                        <div class="filter-group mechanics-group">
                            <span class="filter-label">
                                <img src="assets/img/portfolio/mechanics.png" alt="Mechanics" class="filter-icon">
                                Mechanics
                            </span>
                            <div class="filter-buttons-mechanics">
                                ${this.uniqueMechanics.map(mech => `
                                    <button class="filter-btn-mechanics ${mech === this.currentMechanic ? 'active' : ''}" data-type="mechanic" data-value="${mech}">
                                        ${this.formatLabel(mech)}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="filter-group dimension-group">
                            <span class="filter-label">&ensp;</span>
                            <div class="filter-buttons dimension-buttons">
                                ${this.uniqueDimensions.map(dim => `
                                    <button class="filter-btn-mechanics dimension-btn ${dim === this.currentDimension ? 'active' : ''}" data-type="dimension" data-value="${dim}">
                                        ${dim.toUpperCase()}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slider-container">
                    <button class="slider-btn prev-btn" aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="slider-track-wrapper">
                        <div class="slider-track"></div>
                    </div>
                    <button class="slider-btn next-btn" aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div class="slider-dots"></div>
            </section>
        `;

        this.initEvents();
        this.renderCards();
        this.renderDots();
        setTimeout(() => this.updateSlider(), 50);
    }

    generateDots() {
        const totalPages = Math.ceil(this.filteredProjects.length / this.cardsPerView);
        if (totalPages <= 1) return '';
        let dots = '';
        for (let i = 0; i < totalPages; i++) {
            dots += `<span class="dot ${i === 0 ? 'active' : ''}" data-page="${i}"></span>`;
        }
        return dots;
    }

    initEvents() {
        // === ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ДЛЯ ВСЕХ КНОПОК ФИЛЬТРОВ ===
        const filterSection = this.shadowRoot.querySelector('.filter-section');
        if (filterSection) {
            filterSection.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-btn, .filter-btn-mechanics');
                if (!btn || btn.classList.contains('active')) return;
                
                const type = btn.dataset.type;
                const value = btn.dataset.value;
                const group = btn.closest('.filter-buttons, .filter-buttons-mechanics');
                
                group.querySelectorAll('.filter-btn, .filter-btn-mechanics').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (type === 'category') {
                    this.currentCategory = value;
                    this.updateAvailableFilters('category'); // Пересчитываем всё для новой категории
                    this.updateFilterButtons();
                } 
                else if (type === 'mechanic') {
                    this.currentMechanic = value;
                    this.updateAvailableFilters('mechanic'); // Пересчитывает типы, чтобы исключить пустоту
                    this.updateFilterButtons();
                } 
                else if (type === 'dimension') {
                    this.currentDimension = value;
                    this.updateAvailableFilters('dimension'); // Пересчитывает механики, чтобы исключить пустоту
                    this.updateFilterButtons();
                }

                this.applyFilters();
            });
        }

        // === ОСТАЛЬНЫЕ СОБЫТИЯ (слайдер, точки, ресайз) ===
        const prevBtn = this.shadowRoot.querySelector('.prev-btn');
        const nextBtn = this.shadowRoot.querySelector('.next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentIndex > 0) { this.currentIndex--; this.updateSlider(); }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIndex = Math.max(0, Math.ceil(this.filteredProjects.length / this.cardsPerView) - 1);
                if (this.currentIndex < maxIndex) { this.currentIndex++; this.updateSlider(); }
            });
        }

        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                this.currentIndex = parseInt(e.target.dataset.page);
                this.updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            this.updateCardsPerView();
            this.currentIndex = 0;
            this.renderSlider();
        });

        const track = this.shadowRoot.querySelector('.slider-track');
        if (track) {
            track.addEventListener('click', (e) => {
                const card = e.target.closest('.slider-card');
                if (card) {
                    const link = card.dataset.link;
                    if (link && link !== '#') {
                        window.open(link, '_blank');
                    }
                }
            });
        }
    }

    updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) this.cardsPerView = 2;
        else if (width <= 1024) this.cardsPerView = 3;
        else if (width <= 1440) this.cardsPerView = 4;
        else this.cardsPerView = 6;
    }

    updateSlider() {
        const track = this.shadowRoot.querySelector('.slider-track');
        const prevBtn = this.shadowRoot.querySelector('.prev-btn');
        const nextBtn = this.shadowRoot.querySelector('.next-btn');
        const dots = this.shadowRoot.querySelectorAll('.dot');

        if (!track || this.filteredProjects.length === 0) return;
        const card = track.querySelector('.slider-card');
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const gap = 24;
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        track.style.transform = `translateX(${offset}px)`;

        dots.forEach((dot, index) => dot.classList.toggle('active', index === this.currentIndex));

        const maxIndex = Math.max(0, Math.ceil(this.filteredProjects.length / this.cardsPerView) - 1);
        
        if (prevBtn) {
            prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto';
        }
    }

    // === ОБНОВЛЕНИЕ ДОСТУПНЫХ ФИЛЬТРОВ НА ОСНОВЕ КАТЕГОРИИ ===
    updateAvailableFilters(changedType = 'category') {
        
        let validProjects = this.allProjects.filter(p => 
            p.categories.includes(this.currentCategory)
        );

        
        if (changedType === 'mechanic') {
            validProjects = validProjects.filter(p => p.mechanics.includes(this.currentMechanic));
        }

        
        const availDims = [...new Set(validProjects.map(p => p.dimension))];
        this.uniqueDimensions = ['2d', ...availDims.filter(d => d !== '2d' && d !== '3d'), '3d'].filter(d => availDims.includes(d));

       
        if (!this.uniqueDimensions.includes(this.currentDimension)) {
            this.currentDimension = this.uniqueDimensions[0] || '';
        }

       
        validProjects = this.allProjects.filter(p => 
            p.categories.includes(this.currentCategory) && 
            p.dimension === this.currentDimension
        );
        this.uniqueMechanics = [...new Set(validProjects.flatMap(p => p.mechanics))].sort();

       
        if (changedType === 'category') {
            this.currentMechanic = this.uniqueMechanics[0] || '';
        } 
        
        else if (!this.uniqueMechanics.includes(this.currentMechanic)) {
            this.currentMechanic = this.uniqueMechanics[0] || '';
        }
    }

    // === ПЕРЕРИСОВКА КНОПОК МЕХАНИК И DIMENSIONS В DOM ===
    updateFilterButtons() {
        const mechContainer = this.shadowRoot.querySelector('.mechanics-group .filter-buttons-mechanics');
        const dimContainer = this.shadowRoot.querySelector('.dimension-group .dimension-buttons');
        
        if (mechContainer) {
            mechContainer.innerHTML = this.uniqueMechanics.map(mech => `
                <button class="filter-btn-mechanics ${mech === this.currentMechanic ? 'active' : ''}" data-type="mechanic" data-value="${mech}">
                    ${this.formatLabel(mech)}
                </button>
            `).join('');
        }
        
        if (dimContainer) {
            dimContainer.innerHTML = this.uniqueDimensions.map(dim => `
                <button class="filter-btn-mechanics dimension-btn ${dim === this.currentDimension ? 'active' : ''}" data-type="dimension" data-value="${dim}">
                    ${dim.toUpperCase()}
                </button>
            `).join('');
        }
    }
}

customElements.define('portfolio-slider', PortfolioSlider);