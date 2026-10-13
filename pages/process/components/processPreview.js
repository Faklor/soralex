class ProcessPreviews extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const previews = [
            'assets/img/process/preview/preview2.png',
            'assets/img/process/preview/preview3.png',
            'assets/img/process/preview/preview4.png',
            'assets/img/process/preview/preview5.png',
            'assets/img/process/preview/preview1.png',
            'assets/img/process/preview/preview6.png'
        ];

        this.innerHTML = `
           
            
            <section class="previews-row">
                ${previews.map((src, index) => `
                    <div class="preview-card">
                        <img src="${src}" alt="Process step ${index + 1} preview">
                    </div>
                `).join('')}
            </section>
        `;
    }
}

customElements.define('process-previews', ProcessPreviews);