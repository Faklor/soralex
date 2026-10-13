class StatsGrid extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const stats = [
            { number: '3000+', label: 'Playable ads developed' },
            { number: '8+', label: 'Years of experience' },
            { number: '300+', label: 'Happy clients' },
            { number: 'Global', label: 'Top game studios & brands' },
            { number: 'Full-cycle', label: 'From concept to support' }
        ];

        this.innerHTML = `

            
            <div class="stats-grid">
                ${stats.map(stat => `
                    <div class="stat-item">
                        <span class="stat-number">${stat.number}</span>
                        <p class="stat-label">${stat.label}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('stats-grid', StatsGrid);