class ProcessPlatforms extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const platforms = [
            { name: 'Google Ads', logo: 'assets/img/process/platforms/google.png' },
            { name: 'Facebook Ads', logo: 'assets/img/process/platforms/facebook.png' },
            { name: 'TikTok', logo: 'assets/img/process/platforms/tiktok.png' },
            { name: 'WeChat', logo: 'assets/img/process/platforms/wechat.png' },
            { name: 'Liftoff', logo: 'assets/img/process/platforms/liftoff.png' },
            { name: 'Mopub', logo: 'assets/img/process/platforms/mopub.png' },
            { name: 'IronSource', logo: 'assets/img/process/platforms/ironsource.png' },
            { name: 'Chartboost', logo: 'assets/img/process/platforms/chartboost.png' },
            { name: 'Unity Ads', logo: 'assets/img/process/platforms/unity.png' },
            { name: 'Tapjoy', logo: 'assets/img/process/platforms/tapjoy.png' },
            { name: 'AdColony', logo: 'assets/img/process/platforms/colony.png' },
            { name: 'Aarki', logo: 'assets/img/process/platforms/arki.png' },
            { name: 'Vungle', logo: 'assets/img/process/platforms/vungle.png' },
            { name: 'Moloco', logo: 'assets/img/process/platforms/moloco.png' },
            { name: 'CrossInstall', logo: 'assets/img/process/platforms/crossinstall.png' },
            { name: 'Mintegral', logo: 'assets/img/process/platforms/mintegral.png' },
            { name: 'AppLovin', logo: 'assets/img/process/platforms/applovin.png' }
        ];
 
        this.innerHTML = `
            
            
            <section class="platforms-section">
            
                <div class="platforms-header">
                    <h2>Trusted by leading platforms and networks</h2>
                </div>
                
                <div class="platforms-grid">
                    ${platforms.map(platform => `
                        <div class="platform-item">
                            <img src="${platform.logo}" alt="${platform.name}" class="platform-logo">
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
}

customElements.define('process-platforms', ProcessPlatforms);