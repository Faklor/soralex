class AboutStory extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const stats = [
            { icon: 'assets/img/about/story/icon1.png', number: '2018', label: 'founded' },
            { icon: 'assets/img/about/story/icon2.png', number: '3000+', label: 'playables delivered' },
            { icon: 'assets/img/about/story/icon3.png', number: 'Global', label: 'clients worldwide' }
        ];

        this.innerHTML = `
            <section class="as-section">
                <div class="as-container">
                    <h2 class="as-heading">Our story</h2>
                    
                    <div class="as-content">
                        <div class="as-text">
                            <h3 class="as-title">From games to playables</h3>
                            <p class="as-description">
                                In 2018, <span class="text-red">Soralex Studio</span> was officially founded with one simple goal: build playable ads that people actually want to play. Today, we're a full-cycle playable studio with 1,000+ playables delivered worldwide.
                            </p>
                        </div>

                        <div class="as-stats-grid">
                            ${stats.map(stat => `
                                <div class="as-stat-item">
                                    <div class="as-stat-icon">
                                        <img src="${stat.icon}" alt="${stat.label}" loading="lazy">
                                    </div>
                                    <div class="as-stat-number">${stat.number}</div>
                                    <div class="as-stat-label">${stat.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('about-story', AboutStory);