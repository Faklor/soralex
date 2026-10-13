class TrustedBy extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

   
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    connectedCallback() {
        const studios = [
            { name: 'Jam City', file: 'jam-city.png' },
            { name: 'Kabam', file: 'kabam.png' },
            { name: 'Paramount', file: 'paramount.png' },
            { name: 'Scopely', file: 'scopely.png' },
            { name: 'Good Job', file: 'goodjob.png' },
            { name: 'Disney', file: 'disney.png' },
            { name: 'Marvel', file: 'marvel.png' },
            { name: 'BBC', file: 'bbc.png' },
            { name: 'Ubisoft', file: 'ubisoft.png' },
            { name: 'Lionsgate', file: 'lionsgate.png' },
            { name: 'Kama Games', file: 'kama-games.png' },
            { name: 'Fusebox', file: 'fusebox.png' },
            { name: 'Game story', file: 'game-story.png' },
            { name: 'Tale monster', file: 'tale-monster.png' },
            { name: 'Venatus', file: 'venatus.png' },
            { name: 'Yallaplay', file: 'yallaplay.png' },
            { name: 'Kefir', file: 'kefir.png' },
        ];

        
        const shuffledStudios = this.shuffleArray(studios);

        this.innerHTML = `
            
            
            <h2>Trusted by leading game studios & brands</h2>
            <div class="marquee-container">
                <div class="marquee-track" id="track"></div>
            </div>
           
        `;

        requestAnimationFrame(() => {
            this.renderFittingLogos(shuffledStudios);
        });
    }

    async renderFittingLogos(studios) {
        
        const container = this.querySelector('.marquee-container');
        const track = this.querySelector('#track');
        
        const gap = 10; 
        const maxLogos = 14; 

        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute; 
            visibility: hidden; 
            top: -9999px; 
            left: -9999px; 
            display: flex; 
            gap: ${gap}px;
        `;
        this.appendChild(tempContainer);

        const loadPromises = studios.map(s => {
            return new Promise(resolve => {
                const div = document.createElement('div');
                div.className = 'logo-item';
                const img = document.createElement('img');
                img.src = `assets/img/clients/${s.file}`;
                img.alt = s.name;
                
                img.onload = () => {
                    div.appendChild(img);
                    tempContainer.appendChild(div);
                    
                    const width = div.offsetWidth; 
                    resolve({ studio: s, width: width });
                };
                
                img.onerror = () => {
                    resolve({ studio: s, width: 100 }); 
                };
            });
        });

        const results = await Promise.all(loadPromises);
        
        const containerWidth = container.offsetWidth || window.innerWidth;
        let currentWidth = 0;
        let fittedCount = 0;

        for (let i = 0; i < results.length; i++) {
            if (fittedCount >= maxLogos) {
                break; 
            }

            const itemWidth = results[i].width;
            const spaceNeeded = itemWidth + (i === 0 ? 0 : gap);
            
            if (currentWidth + spaceNeeded <= containerWidth) {
                currentWidth += spaceNeeded;
                fittedCount++;
            } else {
                break;
            }
        }

        tempContainer.remove();

        const countToRender = Math.min(maxLogos, Math.max(2, fittedCount));
        const studiosToRender = results.slice(0, countToRender).map(r => r.studio);

        // Теперь track найден корректно, и innerHTML сработает
        track.innerHTML = studiosToRender.map(s => `
            <div class="logo-item">
                <img src="assets/img/clients/${s.file}" alt="${s.name}" loading="lazy">
            </div>
        `).join('');
    }
}

customElements.define('trusted-by', TrustedBy);