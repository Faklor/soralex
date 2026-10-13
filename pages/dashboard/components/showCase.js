class DashboardShowcase extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const features = [
            {
                icon: 'assets/img/dashboard/icons/icon1.png',
                title: 'Customize',
                description: 'Edit text, images, colors, characters and more'
            },
            {
                icon: 'assets/img/dashboard/icons/icon2.png',
                title: 'Save & manage',
                description: 'Create and save multiple versions of your playable'
            },
            {
                icon: 'assets/img/dashboard/icons/icon3.png',
                title: 'Real-time preview',
                description: 'See changes instantly across devices'
            },
            {
                icon: 'assets/img/dashboard/icons/icon4.png',
                title: 'AI-powered',
                description: 'Generate assets, backgrounds and variations with AI'
            },
            {
                icon: 'assets/img/dashboard/icons/icon5.png',
                title: 'Export anywhere',
                description: 'Build and export to all major ad platforms in one click'
            }
        ];

        this.innerHTML = `
            <section class="ds-section">
                <div class="ds-bg-wrapper">
                    <img src="assets/img/looper.png" alt="Network Background" class="ds-looper-image">
                </div>

                <div class="ds-content">
                    <div class="ds-header">
                        <h1 class="ds-title">
                            Creative<br>
                            <span class="ds-title-red">Dashboard</span>
                        </h1>
                        <p class="ds-subtitle">
                            Build. Customize. Launch. Your playables, your way.
                        </p>
                        <p class="ds-description">
                            All the tools you need to customize playables, preview in real time, 
                            and export production-ready builds for all major ad networks
                        </p>
                        <div class="ds-buttons">
                            <a href="https://dashboard.mraid.io/" class="ds-btn-primary">
                                Login in Dashboard
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                            <button class="ds-btn-secondary">See how it works</button>
                        </div>
                    </div>

                    <div class="ds-image">
                        <img src="assets/img/dashboard/main.png" alt="Dashboard on laptop">
                    </div>
                </div>

                <div class="ds-features-section">
                    <h2 class="ds-features-title">Everything you need in one place</h2>
                    <div class="ds-features-grid">
                        ${features.map(feature => `
                            <div class="ds-feature-card">
                                <div class="ds-feature-icon">
                                    <img src="${feature.icon}" alt="${feature.title}">
                                </div>
                                <h3 class="ds-feature-title">${feature.title}</h3>
                                <p class="ds-feature-description">${feature.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('dashboard-showcase', DashboardShowcase);