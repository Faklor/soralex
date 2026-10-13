class PriceInfo extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Пути к картинкам
        const icons = {
            idea: 'assets/img/portfolio/info/cube.png',
            game: 'assets/img/portfolio/info/game.png',
            art: 'assets/img/portfolio/info/art.png',
            dev: 'assets/img/portfolio/info/panel.png',
            testing: 'assets/img/portfolio/info/time.png',
            support: 'assets/img/portfolio/info/cube-time.png'
        };

        const infoCards = [
            {
                title: 'What affects the price?',
                items: [
                    { icon: icons.idea, text: '2D/3D' },
                    { icon: icons.game, text: 'Ad networks' },
                    { icon: icons.art, text: 'Game complexity' },
                    { icon: icons.dev, text: 'Timeline' },
                    { icon: icons.testing, text: 'Custom art & animation' },
                    { icon: icons.support, text: 'Number of variations' }
                ]
            },
            {
                title: 'We use AI to build better playables',
                description: 'AI tools help us speed up production, generate assets, and test more variations so you get better results, faster',
                aiIcon: true
            },
            {
                title: 'Not sure what solution fits your needs?',
                description: 'Tell us about your game or campaign. We\'ll suggest the right playable format and production approach',
                cta: true
            }
        ];

        this.innerHTML = `
            
            
            <section class="price-info-row">
                ${infoCards.map(card => `
                    <div class="info-card ${card.cta ? 'cta-card' : ''}">
                        <h3 class="info-title">${card.title}</h3>
                        
                        ${card.items ? `
                            <div class="info-grid">
                                ${card.items.map(item => `
                                    <div class="info-item">
                                        <img src="${item.icon}" alt="${item.text}" class="info-icon">
                                        <span>${item.text}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${card.description ? `<p class="info-description">${card.description}</p>` : ''}
                        
                        ${card.aiIcon ? '<img src="assets/img/portfolio/ai.png" alt="AI" class="ai-logo">' : ''}
                        
                        ${card.cta ? '<a href="#contact" class="info-btn">Contact us</a>' : ''}
                    </div>
                `).join('')}
            </section>
        `;
    }
}

customElements.define('price-info', PriceInfo);