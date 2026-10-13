class PortfolioPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/portfolio/PortfolioPage.css">
            
            <div class="portfolio-page">

                <!-- Слайдер с фильтрами -->
                <portfolio-slider></portfolio-slider>

                <!-- Buildinfo -->
                <portfolio-build></portfolio-build>

              
                

                <!-- Ряд 2: Информационные карточки (используем price-info) -->
                <price-info></price-info>
            </div>
        `;
    }
}

customElements.define('page-portfolio', PortfolioPage);