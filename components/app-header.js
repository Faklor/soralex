class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.handleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/app-header.css">
            
            <header>
                <!-- Логотип слева -->
                <div class="logo-wrapper">
                    <slot name="logo"></slot>
                </div>
                
                <!-- Группируем навигацию и кнопку справа -->
                <div class="header-actions">
                    <nav>
                        <slot name="nav"></slot>
                    </nav>
                </div>
            </header>
        `;

        
        this.handleScroll();

        
        window.addEventListener('scroll', this.handleScroll);
    }

    
    handleScroll() {
        const header = this.shadowRoot.querySelector('header');
       
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    
    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}

customElements.define('app-header', AppHeader);