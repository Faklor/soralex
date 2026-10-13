// class HomePage extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//     }

//     connectedCallback() {
//         this.shadowRoot.innerHTML = `
//             <link rel="stylesheet" href="pages/home/HomePage.css">
            
//             <div class="home-page">
                
                
//                 <div class="bg-looper-wrapper">
//                     <!-- Теперь здесь просто наш новый компонент -->
//                     <network-background></network-background>
//                 </div>
                
//                 <section class="hero-section">
//                     <div class="hero-content"><hero-block></hero-block></div>
//                     <div></div>
//                      <!-- <div class="phone-showcase"><phone-showcase></phone-showcase></div> -->
//                     <div class="features-list"><features-list></features-list></div>
//                 </section>
                
//                 <section class="trusted-section"><trusted-by></trusted-by></section>
//                 <section class="stats-section"><stats-grid></stats-grid></section>
//                 <section class="slider-section"><top-playables-slider></top-playables-slider></section>
//             </div>
//         `;
//     }
// }

// customElements.define('page-home', HomePage);

