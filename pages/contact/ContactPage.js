class AboutPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/contact/ContactPage.css">
            
            <div class="contact-page">
                <about-contact></about-contact>
                <about-story></about-story>
                <clients-slider></clients-slider>
            </div>
        `;
    }
}

customElements.define('page-contact', AboutPage);