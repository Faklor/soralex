class ProcessContact extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const features = [
            {
                icon: 'assets/img/process/contact/con1.png',
                title: 'Experienced team'
            },
            {
                icon: 'assets/img/process/contact/con2.png',
                title: '3000+ playables delivered'
            },
            {
                icon: 'assets/img/process/contact/con3.png',
                title: 'Focused on performance & quality'
            }
        ];

        this.innerHTML = `
            <link rel="stylesheet" href="pages/process/components/css/processContact.css">
            
            <section class="contact-cta">
            
                <!-- Левая часть: текст + кнопка -->
                <div class="contact-content">
                    <h2>Have a project?</h2>
                    <p>Let's create your next top-performing playable</p>
                    <a href="#contact" class="contact-btn">Contact us</a>
                </div>

                <!-- Правая часть: 3 иконки с текстом -->
                <div class="contact-features">
                    ${features.map((feature, index) => `
                        <div class="contact-feature">
                            <img src="${feature.icon}" alt="${feature.title}" class="feature-icon">
                            <p>${feature.title}</p>
                            ${index < features.length - 1 ? '<div class="feature-divider"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
}

customElements.define('process-contact', ProcessContact);