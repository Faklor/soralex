class HeroBlock extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.innerHTML = `
           
            
            <div class="hero-block">
                <h1>Developing playables that people <span>want to play</span></h1>
                <p>We create high-perfoming playable ads for game studios and brands. From concept to launch - on every platform and ad network.</p>
                
                <div class="buttons">
                    <a href="#contact" class="btn btn-primary">
                        Contact us
                        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg> 
                    </a>
                    <a href="#portfolio" class="btn btn-secondary">View our works</a>
                </div>
            </div>
        `;
    }
}

customElements.define('hero-block', HeroBlock);