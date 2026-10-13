class ClientsSlider extends HTMLElement {
    constructor() {
        super();
        this.currentSlide = 0;
    }

    connectedCallback() {
        const testimonials = [
            { text: "Looks amazing! Thanks for the speedy work. I've shared with the client and we're waiting for approval.", name: '', position: '', logo: 'assets/img/clients/venatus.png' },
            { text: "Oh my word! I loved that. You guys did a spectacular job! Round 3 is genuinely scary haha.", name: '', position: '', logo: 'assets/img/clients/venatus.png' },
            { text: "Thanks for your help! I've got a chance to check it and thank you for updating a lot of things the way we wanted.", name: '', position: '', logo: 'assets/img/clients/yallaplay.png' },
            { text: "Thanks for this. We're now making a few variations. Overall this video looks great. We would like to use this process going forward.", name: '', position: '', logo: 'assets/img/clients/fusebox.png' },
            { text: "Thank you for your effort. It's turned out to be a really nice playable. The assets are clear, the movement and gameplay are good.", name: '', position: '', logo: 'assets/img/clients/yallaplay.png' },
            { text: "Looks great and the client loves it, so thank you for that.", name: '', position: '', logo: 'assets/img/clients/venatus.png' },
            { text: "First of all thanks for the storyboard, it's really good for understanding the flow", name: '', position: '', logo: 'assets/img/clients/yallaplay.png' },
            { text: "Thank you very much. We can proceed with the builds now. I want to keep working with you since we've already set the core mechanics. :)", name: '', position: '', logo: 'assets/img/clients/tale-monster.png' },
            { text: "Thanks for the version! It's already really fun to play!", name: '', position: '', logo: 'assets/img/clients/kefir.png' },
            { text: "That's great. The animations add a lot! Nice work! Approved.", name: '', position: '', logo: 'assets/img/clients/game-story.png' }
        ];

        this.testimonials = testimonials;
        this.renderSlider();
    }

    renderSlider() {
        this.innerHTML = `
            <section class="cs-section">
                <h2 class="cs-heading">What our clients say</h2>
                
                <div class="cs-wrapper">
                    <button class="cs-nav cs-prev" aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <div class="cs-track-wrapper">
                        <div class="cs-track">
                           ${this.testimonials.map((testimonial, index) => `
                                <div class="cs-card ${index === this.currentSlide ? 'active' : ''}">
                                    <div class="cs-content">
                                        <div class="cs-quote-icon">
                                            <img src="assets/img/about/clients-icon.png" alt="Quote" loading="lazy">
                                        </div>
                                        <p class="cs-text">${testimonial.text}</p>
                                    </div>
                                    <div class="cs-author">
                                        <div class="cs-author-info">
                                            <div class="cs-author-name">${testimonial.name}</div>
                                            <div class="cs-author-position">${testimonial.position}</div>
                                        </div>
                                        <div class="cs-author-logo">
                                            <img src="${testimonial.logo}" alt="Client Logo" loading="lazy">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <button class="cs-nav cs-next" aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div class="cs-dots">
                    ${this.testimonials.map((_, index) => `
                        <span class="cs-dot ${index === this.currentSlide ? 'active' : ''}" data-index="${index}"></span>
                    `).join('')}
                </div>
            </section>
        `;

        this.initSlider();
    }

    initSlider() {
        // ИСПРАВЛЕНО: this вместо this.shadowRoot
        const prevBtn = this.querySelector('.cs-prev');
        const nextBtn = this.querySelector('.cs-next');
        const dots = this.querySelectorAll('.cs-dot');
        const track = this.querySelector('.cs-track');

        const updateSlider = () => {
            const cards = this.querySelectorAll('.cs-card');
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === this.currentSlide);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });

            if (track && cards.length > 0) {
                const cardWidth = cards[0].offsetWidth;
                const gap = 24; // Должно совпадать с gap в CSS .cs-track
                track.style.transform = `translateX(-${this.currentSlide * (cardWidth + gap)}px)`;
            }
        };

        prevBtn?.addEventListener('click', () => {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                updateSlider();
            }
        });

        nextBtn?.addEventListener('click', () => {
            if (this.currentSlide < this.testimonials.length - 1) {
                this.currentSlide++;
            } else {
                this.currentSlide = 0; // Зацикливание
            }
            updateSlider();
        });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                this.currentSlide = parseInt(dot.dataset.index);
                updateSlider();
            });
        });
        
        // Обновляем при изменении размера окна, чтобы слайдер не ломался
        window.addEventListener('resize', updateSlider);
    }
}

customElements.define('clients-slider', ClientsSlider);