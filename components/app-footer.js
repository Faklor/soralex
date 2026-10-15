class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-content">
                    <!-- Левая часть: Логотип + текст + email -->
                    <div class="footer-left">
                        <div class="footer-logo-wrapper">
                            <!-- ЗАМЕНА: Просто картинка логотипа -->
                            <img src="assets/img/logo.png" alt="MRAID.IO Logo" class="footer-logo-image">
                        </div>
                        <p class="footer-greeting">We'd love to hear your wishes and answer any questions you may have!</p>
                        
                        <div class="footer-contact-info">
                            <h4>Get in touch</h4>
                            <a href="mailto:contact@soralexgames.com" class="footer-email">contact@soralexgames.com</a>
                        </div>
                    </div>

                    <!-- Правая часть: Навигация + кнопка вверх -->
                    <div class="footer-right">
                        <div class="footer-nav">
                            <h4>Navigation</h4>
                            <ul>
                                <li><a href="#home">Home</a></li>
                                <li><a href="#process">Process & Technology</a></li>
                                <li><a href="#portfolio">Portfolio & Solutions</a></li>
                                <li><a href="#dashboard">Dashboard</a></li>
                                <li><a href="#services">Creative Services</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <button class="scroll-top" aria-label="Scroll to top">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 15L12 9L6 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Красная линия и копирайт -->
                <div class="footer-bottom">
                    <div class="footer-line"></div>
                    <p>&copy; 2024 Soralex Studio All rights reserved.</p>
                </div>
            </footer>
        `;

        // Обработчик кнопки "Вверх" с проверкой на существование
        const scrollTopBtn = this.querySelector('.scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
}

customElements.define('app-footer', AppFooter);