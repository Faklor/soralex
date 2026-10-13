class DashboardInfo extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const features = [
            {
                icon: 'assets/img/dashboard/info/time.png',
                title: 'Save time',
                description: 'Create multiple versions in minutes, not days'
            },
            {
                icon: 'assets/img/dashboard/info/dash.png',
                title: 'Scale campaigns',
                description: 'Quickly adapt playables for different markets and audiences'
            },
            {
                icon: 'assets/img/dashboard/info/roket.png',
                title: 'Boost performance',
                description: 'A/B test variations and find what works best'
            },
            {
                icon: 'assets/img/dashboard/info/group.png',
                title: 'Collaborate easily',
                description: 'Share access and manage projects with your team'
            }
        ];

        this.innerHTML = `
            <section class="di-section">
                <div class="di-container">
                    <h2 class="di-heading">Built for marketers and agencies</h2>
                    
                    <div class="di-features-grid">
                        ${features.map(feature => `
                            <div class="di-feature-box">
                                <div class="di-feature-icon">
                                    <img src="${feature.icon}" alt="${feature.title}">
                                </div>
                                <div class="di-feature-text">
                                    <h3 class="di-feature-title">${feature.title}</h3>
                                    <p class="di-feature-description">${feature.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="di-cta-banner">
                        <div class="di-banner-content">
                            <div class="di-banner-icon">
                                <img src="assets/img/dashboard/info/message.png" alt="Message">
                            </div>
                            <div class="di-banner-text">
                                <h3 class="di-banner-title">Get full access to the Dashboard</h3>
                                <p class="di-banner-description">
                                    Start customizing playables for free and export production-ready builds in just a few clicks.
                                </p>
                            </div>
                        </div>
                        <a href="https://dashboard.mraid.io/" class="di-banner-btn">
                            Login in Dashboard
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('dashboard-info', DashboardInfo);