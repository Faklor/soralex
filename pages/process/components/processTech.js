class ProcessTech extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const technologies = [
            { name: 'HTML5', logo: 'assets/img/process/tech/html.png' },
            { name: '', logo: 'assets/img/process/tech/pxi.png' },
            { name: 'JavaScript', logo: 'assets/img/process/tech/js.png' },
            { name: 'TypeScript', logo: 'assets/img/process/tech/ts.png' },
            { name: 'Three.js', logo: 'assets/img/process/tech/three.png' },
            { name: 'Cocos', logo: 'assets/img/process/tech/cocos.png' },
            { name: '', logo: 'assets/img/process/tech/gsap.png' }
        ];

        const aiTools = [
            { name: 'ChatGPT', logo: 'assets/img/process/tech/ai1.png' },
            { name: 'Claude', logo: 'assets/img/process/tech/ai2.png' },
            { name: 'Midjourney', logo: 'assets/img/process/tech/ai3.png' },
            { name: 'Stable Diffusion', logo: 'assets/img/process/tech/ai4.png' },
            { name: 'GitHub Copilot', logo: 'assets/img/process/tech/ai5.png' }
        ];

        this.innerHTML = `
           
            
            <section class="tech-section">
                <div class="tech-container">
                    <!-- Левая часть: Технологии -->
                    <div class="tech-left">
                        <div class="tech-header">
                            <h3>Technology we rely on</h3>
                            <div class="tech-subtitle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFFFFF"/>
                                </svg>
                                <span>AI is at the core of workflow</span>
                            </div>
                        </div>
                        
                        <div class="tech-logos">
                            ${technologies.map(tech => `
                                <div class="tech-item">
                                    <img src="${tech.logo}" alt="${tech.name}" class="tech-logo">
                                    <span class="tech-name">${tech.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Вертикальный разделитель -->
                    <div class="tech-divider"></div>

                    <!-- Правая часть: AI-инструменты -->
                    <div class="tech-right">
                        <h3 class="ai-title">AI-Powered Tools</h3>
                        
                        <div class="ai-tools">
                            ${aiTools.map(tool => `
                                <div class="ai-tool-item">
                                    <img src="${tool.logo}" alt="${tool.name}" class="ai-tool-logo">
                                    <span class="ai-tool-name">${tool.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('process-tech', ProcessTech);