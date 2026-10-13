class AppLogo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/app-logo.css">
            
            <h1 class="logo-container" role="button" tabindex="0" aria-label="Go to Home page">
                <!-- Просто картинка логотипа. Замените src на актуальный путь к вашему файлу -->
                <img src="assets/img/logo.png" alt="MRAID.IO Logo" class="logo-image">
            </h1>
        `;

        const logoContainer = this.shadowRoot.querySelector('.logo-container');
        
        // Клик для перехода на главную
        logoContainer.addEventListener('click', () => {
            window.location.hash = '#home';
        });

        // Доступность: переход по Enter или пробелу
        logoContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.hash = '#home';
            }
        });
    }
}

customElements.define('app-logo', AppLogo);