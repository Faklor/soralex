class ProcessAI extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const aiFeatures = [
            'AI explores multiple concepts and creative directions in minutes',
            'AI helps generate, test and balance gameplay ideas and user flows',
            'AI accelerates asset creation, style exploration and animation variations',
            'AI assists with code generation, optimization and debugging',
            'AI accelerates QA by detecting issues and edge cases early',
            'AI analyzes performance data to help improve future results'
        ];

        this.innerHTML = `
            
            
            <section class="ai-features-row">
            
                ${aiFeatures.map(text => `
                    <div class="ai-feature">
                        <span class="ai-diamond">✦</span>
                        <p>${text}</p>
                    </div>
                `).join('')}
            </section>
        `;
    }
}

customElements.define('process-ai', ProcessAI);