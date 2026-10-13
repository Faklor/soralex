class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const linksData = JSON.parse(this.getAttribute('links') || '[]');
        const ctaText = this.getAttribute('cta-text') || 'Let\'s talk';
        const ctaHref = this.getAttribute('cta-href') || '#contact';
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/nav-bar.css">
            
            <!-- Кнопка гамбургер (она же крестик при открытии) -->
            <button class="hamburger" aria-label="Открыть меню">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav>
                ${linksData.map(link => `
                    <a href="${link.href}">${link.text}</a>
                `).join('')}
                
                <!-- Кнопка действия с текстом и SVG стрелкой -->
                <a href="${ctaHref}" class="nav-cta-btn">
                    <span>${ctaText}</span>
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </nav>
        `;

        const hamburger = this.shadowRoot.querySelector('.hamburger');

        // Открытие/закрытие меню
        hamburger.addEventListener('click', () => {
            this.classList.toggle('menu-open');
        });

        // Закрытие меню при клике на любую ссылку или кнопку внутри него
        const nav = this.shadowRoot.querySelector('nav');
        nav.addEventListener('click', (e) => {
            const targetLink = e.target.closest('a');
            if (targetLink) {
                this.classList.remove('menu-open');
            }
        });

        setTimeout(() => {
            this.setActiveLink();
            this.updateCTAVisibility();
        }, 0);

        window.addEventListener('hashchange', () => {
            this.setActiveLink();
            this.updateCTAVisibility();
        });
    }

    setActiveLink() {
        const links = this.shadowRoot.querySelectorAll('a');
        const currentHash = window.location.hash === '' ? '#home' : window.location.hash;
        
        links.forEach(link => {
            if (link.classList.contains('nav-cta-btn')) return;

            const href = link.getAttribute('href');
            if (href === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // === НОВЫЙ МЕТОД: Скрытие/показ кнопки CTA ===
    updateCTAVisibility() {
        const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
        if (!ctaBtn) return;

        const currentHash = window.location.hash === '' ? '#home' : window.location.hash;
        const ctaHref = ctaBtn.getAttribute('href');

        // Если текущая страница совпадает с href кнопки CTA — скрываем её
        if (currentHash === ctaHref) {
            ctaBtn.style.display = 'none';
        } else {
            ctaBtn.style.display = 'inline-flex';
        }
    }
}

customElements.define('nav-bar', NavBar);