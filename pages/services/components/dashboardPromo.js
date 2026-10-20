class DashboardPromo extends HTMLElement {
    constructor() {
        super();
        this.animationFrame = null;
    }

    connectedCallback() {
        this.render();
        this.initVideoControls();
        this.startIconAnimation();
    }

    disconnectedCallback() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    render() {
        this.innerHTML = `
            <section class="dashboard-promo">
                <div class="promo-content">
                    <div class="promo-text">
                        <div class="logo-wrapper">
                            <div class="animated-icon">
                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect id="rect-tl" x="4.5" y="4.5" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-tr" x="22.8333" y="4.5" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-bl" x="4.5" y="22.8333" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                    <rect id="rect-br" x="22.8333" y="22.8333" width="13.6667" height="13.6667" stroke="#FF0034" stroke-width="3" stroke-linejoin="round" fill="none" rx="2"/>
                                </svg>
                            </div>
                            <span class="logo-text">Soralex Studio Dashboard</span>
                        </div>
                        
                        <h2 class="promo-title">
                            Create banners in minutes<br>
                            with our editor
                        </h2>
                        
                        <p class="promo-description">
                            Our in-house editor allows you to create HTML5<br>
                            banners quickly and easily - no coding required.
                        </p>
                        
                        <a href="https://dashboard.mraid.io/" class="promo-cta-btn">
                            Go to Dashboard
                            <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div>

                    <div class="promo-video-wrapper">
                        <div class="video-container">
                            <video controls class="promo-video" playsinline>
                                <source src="assets/video/video5.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    initVideoControls() {
        const video = this.querySelector('.promo-video');
        if (!video) return;
        
        video.addEventListener('click', () => {
            video.paused ? video.play() : video.pause();
        });

        video.addEventListener('dblclick', () => {
            if (video.requestFullscreen) video.requestFullscreen();
            else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        });
    }

    startIconAnimation() {
        // ИСПРАВЛЕНО: используем querySelector вместо несуществующего getElementById
        const rectTL = this.querySelector('#rect-tl');
        const rectTR = this.querySelector('#rect-tr');
        const rectBL = this.querySelector('#rect-bl');
        const rectBR = this.querySelector('#rect-br');

        if (!rectTL || !rectTR || !rectBL || !rectBR) return;

        const bigHeight = 13.6667;
        const smallHeight = 6.8333;
        const fixedBottomY = 29.0; 

        let startTime = null;
        const duration = 3000;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;
            const t = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;

            const tlHeight = smallHeight + (bigHeight - smallHeight) * t;
            rectTL.setAttribute('y', 4.5);
            rectTL.setAttribute('height', tlHeight);

            const blHeight = bigHeight - (bigHeight - smallHeight) * t;
            rectBL.setAttribute('y', fixedBottomY - blHeight);
            rectBL.setAttribute('height', blHeight);

            const trHeight = bigHeight - (bigHeight - smallHeight) * t;
            rectTR.setAttribute('y', 4.5);
            rectTR.setAttribute('height', trHeight);

            const brHeight = smallHeight + (bigHeight - smallHeight) * t;
            rectBR.setAttribute('y', fixedBottomY - brHeight);
            rectBR.setAttribute('height', brHeight);

            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}
customElements.define('dashboard-promo', DashboardPromo);