class PriceCards extends HTMLElement {
    constructor() {
        super();
        this.plans = [];
        this.handlePlanCleared = this.handlePlanCleared.bind(this);
    }

    connectedCallback() {
        this.plans = [
            {
                title: 'Reskin from library',
                description: 'Replace assets, keep proven mechanics and layout',
                icon: `<svg class="pc-svg-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="pc-icon-draw" x="2" y="2" width="41" height="41" rx="2" stroke="#FF0034" stroke-width="4"/></svg>`,
                features: [
                    'Asset replacement (art, texts, characters)',
                    'Proven high-performing monetization & layout',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (AI asset generation)',
                    'Technical support'
                ],
                price: '$290',
                popular: false
            },
            {
                title: 'Unique 2D/3D playable',
                description: 'Custom mechanics built around your game or product',
                icon: `<svg class="pc-svg-icon" width="53" height="62" viewBox="0 0 53 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="pc-icon-flow" d="M50.4434 15.3939V43.8543C50.4434 44.807 49.9351 45.6873 49.11 46.1637L26.4434 59.2503L3.77669 46.1637C2.95162 45.6873 2.44336 44.807 2.44336 43.8543V15.3939L25.1483 2.78002C25.9537 2.33258 26.933 2.33258 27.7384 2.78002L50.4434 15.3939ZM2.44336 15.3939L26.4434 29.2503M26.4434 59.2503V29.2503M50.4434 15.3939L26.4434 29.2503" stroke="#FF0034" stroke-width="4.88745" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                features: [
                    'Custom unique mechanics',
                    '2 FREE iterations (adjust duration & difficulty)',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (AI asset generation)',
                    'Technical support'
                ],
                price: '$590',
                popular: false
            },
            {
                title: '3 Playables pack',
                description: 'Three different playables with different mechanics',
                icon: `<svg class="pc-svg-icon" width="67" height="69" viewBox="0 0 67 69" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="pc-icon-flow-delay-1" d="M32.5781 38.9412V57.3219C32.5781 57.9372 32.2499 58.5057 31.717 58.8134L17.0781 67.2651L2.43924 58.8134C1.90638 58.5057 1.57812 57.9372 1.57812 57.3219V38.9412L16.2417 30.7947C16.7619 30.5058 17.3944 30.5058 17.9145 30.7947L32.5781 38.9412ZM1.57812 38.9412L17.0781 47.8901M17.0781 67.2651V47.8901M32.5781 38.9412L17.0781 47.8901" stroke="#FF0034" stroke-width="3.15648" stroke-linecap="round" stroke-linejoin="round"/><path class="pc-icon-flow-delay-2" d="M64.5781 38.9412V57.3219C64.5781 57.9372 64.2499 58.5057 63.717 58.8134L49.0781 67.2651L34.4392 58.8134C33.9064 58.5057 33.5781 57.9372 33.5781 57.3219V38.9412L48.2417 30.7947C48.7619 30.5058 49.3944 30.5058 49.9145 30.7947L64.5781 38.9412ZM33.5781 38.9412L49.0781 47.8901M49.0781 67.2651V47.8901M64.5781 38.9412L49.0781 47.8901" stroke="#FF0034" stroke-width="3.15648" stroke-linecap="round" stroke-linejoin="round"/><path class="pc-icon-flow-delay-3" d="M48.5781 9.94119V28.3219C48.5781 28.9372 48.2499 29.5057 47.717 29.8134L33.0781 38.2651L18.4392 29.8134C17.9064 29.5057 17.5781 28.9372 17.5781 28.3219V9.94119L32.2417 1.79474C32.7619 1.50576 33.3944 1.50576 33.9145 1.79474L48.5781 9.94119ZM17.5781 9.94119L33.0781 18.8901M33.0781 38.2651V18.8901M48.5781 9.94119L33.0781 18.8901" stroke="#FF0034" stroke-width="3.15648" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                features: [
                    '3 unique playables (different mechanics)',
                    '2 FREE iterations for each playable',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (AI asset generation)',
                    'Technical support'
                ],
                price: '$1,490',
                oldPrice: '$2,500',
                popular: true
            },
            {
                title: 'Growth scale plan (8+/mo)',
                description: 'For continuous UA growth and scaling campaigns',
                icon: `<svg class="pc-svg-icon" width="57" height="58" viewBox="0 0 57 58" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="pc-icon-bar-3" x="43.8219" y="2.57778" width="10.3111" height="52.8444" rx="2.57778" stroke="#FF0034" stroke-width="5.15556"/><rect class="pc-icon-bar-2" x="23.2008" y="23.2008" width="10.3111" height="32.2222" rx="2.57778" stroke="#FF0034" stroke-width="5.15556"/><rect class="pc-icon-bar-1" x="2.57778" y="38.6676" width="10.3111" height="16.7556" rx="2.57778" stroke="#FF0034" stroke-width="5.15556"/></svg>`,
                features: [
                    'From 8 unique playables per month',
                    '2 FREE iterations for each playable',
                    '5 customized versions via Dashboard',
                    'Builds for all major ad networks',
                    'Free access to Dashboard (AI asset generation)',
                    'Technical support'
                ],
                price: '$3,490',
                popular: false
            }
        ];

        this.checkmarkSVG = `
            <svg width="16" height="16" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 12.5C1.5 12.5 8.34955 21.2355 10.0737 21.2355C11.7979 21.2355 23.5 1.5 23.5 1.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        window.addEventListener('planCleared', this.handlePlanCleared);
        this.render();

        if (window.location.hash === '#pricing') {
            setTimeout(() => {
                const section = this.querySelector('#pc-pricing-section');
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    disconnectedCallback() {
        window.removeEventListener('planCleared', this.handlePlanCleared);
    }

    render() {
        const storedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        const selectedTitle = storedPlan ? storedPlan.title : null;
        const isAnyPlanSelected = !!storedPlan;

        this.innerHTML = `
            <section class="pc-wrapper" id="pc-pricing-section">
                <div class="pc-header">
                    <h2 class="pc-title">Packages & pricing</h2>
                    <p class="pc-description">Choose a package that fits your needs. All playables are ad network ready and customizable.</p>
                </div>

                <div class="pc-cards-row">
                    ${this.plans.map((plan, index) => {
                        const isSelected = plan.title === selectedTitle;
                        return `
                            <div class="pc-card ${plan.popular && !isAnyPlanSelected ? 'pc-popular' : ''} ${isSelected ? 'pc-selected-card' : ''}">
                                ${plan.popular && !isAnyPlanSelected ? '<div class="pc-popular-badge">Most popular</div>' : ''}
                                
                                <div class="pc-card-icon">
                                    ${plan.icon}
                                </div>
                                <h3 class="pc-card-title">${plan.title}</h3>
                                <p class="pc-card-description">${plan.description}</p>
                                ${plan.subtitle ? `<p class="pc-card-subtitle">${plan.subtitle}</p>` : ''}
                                <ul class="pc-card-features">
                                    ${plan.features.map(feature => `
                                        <li>
                                            <span class="pc-feature-icon">${this.checkmarkSVG}</span>
                                            <span>${feature}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                                <div class="pc-card-price">
                                    <span class="pc-current-price">From ${plan.price}</span>
                                    ${plan.oldPrice ? `<span class="pc-old-price">${plan.oldPrice}</span>` : ''}
                                </div>
                                
                                ${isSelected ? `
                                    <div class="pc-selected-button">
                                        ${this.checkmarkSVG}
                                        <span>Selected</span>
                                    </div>
                                ` : `
                                    <button class="pc-choose-button" data-plan="${index}">Choose</button>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;

        this.querySelectorAll('.pc-choose-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                const planIndex = e.target.getAttribute('data-plan');
                this.selectPlan(planIndex);
            });
        });
    }

    handlePlanCleared() {
        const cards = this.querySelectorAll('.pc-card');
        
        cards.forEach((card, index) => {
            const plan = this.plans[index];
            
            card.classList.remove('pc-selected-card', 'pc-animate-selection');
            
            if (plan.popular) {
                card.classList.add('pc-popular');
                if (!card.querySelector('.pc-popular-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'pc-popular-badge';
                    badge.textContent = 'Most popular';
                    card.insertBefore(badge, card.firstChild);
                }
            }
            
            const selectedBtn = card.querySelector('.pc-selected-button');
            if (selectedBtn) {
                selectedBtn.outerHTML = `<button class="pc-choose-button" data-plan="${index}">Choose</button>`;
            }
        });
        
        this.querySelectorAll('.pc-choose-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const planIndex = e.target.getAttribute('data-plan');
                this.selectPlan(planIndex);
            });
        });
    }

    selectPlan(planIndex) {
        const selectedPlan = this.plans[planIndex];
        localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));

        const cards = this.querySelectorAll('.pc-card');
        const storedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        
        cards.forEach((card, index) => {
            const plan = this.plans[index];
            const isSelected = plan.title === storedPlan.title;
            
            card.classList.remove('pc-popular');
            const badge = card.querySelector('.pc-popular-badge');
            if (badge) badge.remove();
            
            if (isSelected) {
                card.classList.add('pc-selected-card');
                
                const button = card.querySelector('.pc-choose-button');
                if (button) {
                    button.outerHTML = `
                        <div class="pc-selected-button">
                            ${this.checkmarkSVG}
                            <span>Selected</span>
                        </div>
                    `;
                }
                
                setTimeout(() => {
                    card.classList.add('pc-animate-selection');
                }, 50);
            } else {
                card.classList.remove('pc-selected-card');
                
                const selectedBtn = card.querySelector('.pc-selected-button');
                if (selectedBtn) {
                    selectedBtn.outerHTML = `<button class="pc-choose-button" data-plan="${index}">Choose</button>`;
                }
            }
        });

        window.dispatchEvent(new CustomEvent('planChanged', { detail: selectedPlan, bubbles: true, composed: true }));

        setTimeout(() => {
            window.location.hash = 'contact';
            setTimeout(() => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }, 800);
    }
}

customElements.define('price-cards', PriceCards);