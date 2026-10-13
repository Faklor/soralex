class Banners extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }
 
    render() {
        this.innerHTML = `
            
            
            <section class="banners-hero">
                <!-- Блик в правом верхнем углу -->
                <img class="hero-blick" src="assets/img/blick.png" alt="">
                
                <div class="banners-content">
                    <div class="banners-text">
                        <h1 class="banners-title">
                            More than playables<br>
                            <span class="title-red">a full creative partner</span>
                        </h1>
                        <p class="banners-description">
                            We help game studios and brands create high-performing creative<br>
                            assets across all formats - from playables and HTML5 banners<br>
                            to video ads, 2D/3D graphics and animations.
                        </p>
                        <a href="#contact" class="banners-cta-btn">
                            Let's create together
                            <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div>

                    <div class="banners-visuals">
                        <div class="visuals-composition">
                            <div class="art-card art-top-left">
                                <img src="assets/img/services/banners/artTopLeft.png" alt="Video Ads">
                            </div>
                            
                            <div class="art-card art-top-right">
                                <img src="assets/img/services/banners/artTopRight.png" alt="2D/3D Art">
                            </div>
                            
                            <div class="art-card art-bottom-left">
                                <img src="assets/img/services/banners/artBottomLeft.png" alt="HTML5 Banners">
                            </div>
                            
                            <div class="art-card art-bottom-right">
                                <img src="assets/img/services/banners/artBottomRight.png" alt="Animations">
                            </div>
                            
                            <div class="phone-mockup">
                                <img src="assets/img/services/banners/phone.png" alt="Phone mockup">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('banners-section', Banners);