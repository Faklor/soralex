class PriceCards extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
        this.plans = []; // Храним планы в экземпляре класса
        this.handlePlanCleared = this.handlePlanCleared.bind(this);
    }

    connectedCallback() {
        this.plans = [
            {
                title: 'Reskin from library',
                description: 'Replace assets, keep proven mechanics and layout',
                icon: 'assets/img/portfolio/price/price1.png',
                features: [
                    'Asset replacement (art, texts, characters)',
                    'Proven high-performing monetization & layout',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (create custom versions for free with AI asset generation)',
                    'Technical support'
                ],
                price: '$199',
                popular: false
            },
            {
                title: 'Unique 2D/3D Playable',
                description: 'Custom mechanics built around your game or product',
                icon: 'assets/img/portfolio/price/price2.png',
                features: [
                    'Custom unique mechanics',
                    '2 FREE iterations (adjust duration & difficulty)',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (create custom versions for free with AI asset generation)',
                    'Technical support'
                ],
                price: '$499',
                popular: false
            },
            {
                title: '3 Playables pack',
                description: 'Three different playables with different mechanics',
                icon: 'assets/img/portfolio/price/price3.png',
                features: [
                    '3 unique playables (different mechanics)',
                    '2 FREE iterations for each playable (adjust duration & difficulty)',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (create custom versions for free with AI asset generation)',
                    'Technical support'
                ],
                price: '$1,499',
                oldPrice: '$2,500',
                popular: true
            },
            {
                title: 'Growth scale plan',
                description: 'From 8 playables per month',
                subtitle: 'For continuous UA growth and scaling campaigns',
                icon: 'assets/img/portfolio/price/price4.png',
                features: [
                    'From 8 unique playables per month (different mechanics)',
                    '2 FREE iterations for each playable (adjust duration & difficulty)',
                    '5 customized versions for each playable created by our designers via Dashboard (different art, texts, themes)',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (with AI asset generation)',
                    'Technical support'
                ],
                price: '$3,499',
                popular: false
            }
        ];

        this.checkmarkSVG = `
            <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 12.5C1.5 12.5 8.34955 21.2355 10.0737 21.2355C11.7979 21.2355 23.5 1.5 23.5 1.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // Слушаем событие сброса выбора из другого компонента
        window.addEventListener('planCleared', this.handlePlanCleared);

        this.render();

        window.addEventListener('scroll-to-pricing', () => {
            const section = this.getElementById('pricing-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    disconnectedCallback() {
        window.removeEventListener('planCleared', this.handlePlanCleared);
    }

    render() {
        // Проверяем, есть ли уже выбранный план в localStorage
        const storedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        const selectedTitle = storedPlan ? storedPlan.title : null;

        this.innerHTML = `
            
            <section class="price-cards-row" id="pricing-section">
                ${this.plans.map((plan, index) => {
                    const isSelected = plan.title === selectedTitle;
                    return `
                        <div class="price-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected-card' : ''}">
                            ${plan.popular ? '<div class="popular-badge">Most popular</div>' : ''}
                            <div class="card-icon">
                                <img src="${plan.icon}" alt="${plan.title}">
                            </div>
                            <h3 class="card-title">${plan.title}</h3>
                            <p class="card-description">${plan.description}</p>
                            ${plan.subtitle ? `<p class="card-subtitle">${plan.subtitle}</p>` : ''}
                            <ul class="card-features">
                                ${plan.features.map(feature => `
                                    <li>
                                        <span class="feature-icon">${this.checkmarkSVG}</span>
                                        <span>${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                            <div class="card-price">
                                <span class="current-price">From ${plan.price}</span>
                                ${plan.oldPrice ? `<span class="old-price">${plan.oldPrice}</span>` : ''}
                            </div>
                            
                            ${isSelected ? `
                                <div class="selected-button">
                                    ${this.checkmarkSVG}
                                    <span>Selected</span>
                                </div>
                            ` : `
                                <a href="#contact" class="choose-button" data-plan="${index}">Choose</a>
                            `}
                        </div>
                    `;
                }).join('')}
            </section>
        `;

        // Навешиваем обработчики кликов только на кнопки "Choose"
        this.querySelectorAll('.choose-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                const planIndex = e.target.getAttribute('data-plan');
                this.selectPlan(planIndex);
            });
        });
    }

    handlePlanCleared() {
        // Перерисовываем компонент, чтобы вернуть кнопку "Choose"
        this.render();
    }

    selectPlan(planIndex) {
        const selectedPlan = this.plans[planIndex];
        localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));

        // Уведомляем другие компоненты (например, AboutContact)
        window.dispatchEvent(new CustomEvent('planChanged', { detail: selectedPlan, bubbles: true, composed: true }));

        // === ДОБАВЛЕННАЯ СТРОКА: Перерисовываем компонент, чтобы кнопка сменилась на "Selected" ===
        this.render();

        // Скролл к контактам (теперь работает с уже обновленным DOM)
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.hash = '#contact';
        }
    }
}

customElements.define('price-cards', PriceCards);