class PageServices extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/services/PageServices.css">
            
            <div class="services-wrapper">
                
                <banners-section></banners-section>
                
                <services-cards></services-cards>

                <dashboard-promo></dashboard-promo>

                <features-section></features-section>
            </div>
        `;
    }
}

customElements.define('page-services', PageServices);