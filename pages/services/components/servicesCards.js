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
    }

    connectedCallback() { this.render(); }

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
            </section>
        `;
    }
}
customElements.define('services-cards', ServicesCards);