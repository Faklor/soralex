class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

        connectedCallback() {
        this.renderBase();

        window.addEventListener('portfolio-data-loaded', (e) => {
            this.updatePortfolioCount(e.detail.count);
        });

        const hamburger = this.shadowRoot.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                const isOpen = !this.classList.contains('menu-open');
                this.classList.toggle('menu-open', isOpen);
                
                // === НОВОЕ: Блокируем скролл body при открытии меню ===
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        }

        const nav = this.shadowRoot.querySelector('nav');
        if (nav) {
            nav.addEventListener('click', (e) => {
                const targetLink = e.target.closest('a');
                if (targetLink) {
                    const href = targetLink.getAttribute('href');
                    const isPortfolio = href === '#portfolio' || targetLink.textContent.toLowerCase().includes('portfolio');

                    if (isPortfolio) {
                        this.resetPortfolioBadge();
                    }

                    if (href === '#pricing' || href === '#pricing-section' || targetLink.textContent.toLowerCase().includes('pricing')) {
                        e.preventDefault();
                        
                        // === НОВОЕ: Разблокируем скролл при закрытии меню ===
                        this.classList.remove('menu-open');
                        document.body.style.overflow = '';
                        
                        const priceCards = document.querySelector('price-cards');
                        if (priceCards && typeof priceCards.render === 'function') {
                            priceCards.render();
                        }

                        setTimeout(() => {
                            const pricingSection = document.querySelector('#pricing') || document.querySelector('.price-header')?.parentElement;
                            if (pricingSection) {
                                pricingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 50);
                    } else {
                        // === НОВОЕ: Разблокируем скролл при закрытии меню ===
                        this.classList.remove('menu-open');
                        document.body.style.overflow = '';
                    }
                }
            });
        }

        this.updateCTAVisibility();
        
        const initialHash = window.location.hash.replace('#', '') || 'home';
        this.setActiveLink(initialHash);

        window.addEventListener('hashchange', () => {
            this.updateCTAVisibility();
            const currentHash = window.location.hash.replace('#', '') || 'home';
            this.setActiveLink(currentHash);
        });

        this.setupScrollSpy();
    }

    disconnectedCallback() {
        window.removeEventListener('portfolio-data-loaded', this.updatePortfolioCount);
    }

    renderBase() {
        const linksData = JSON.parse(this.getAttribute('links') || '[]');
        const ctaText = this.getAttribute('cta-text') || 'Let\'s talk';
        const ctaHref = this.getAttribute('cta-href') || '#contact';
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/nav-bar.css">
            
            <button class="hamburger" aria-label="Открыть меню">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav>
                ${linksData.map(link => {
                    const isPortfolio = link.href === '#portfolio' || link.text.toLowerCase().includes('portfolio');
                    return `
                        <a href="${link.href}" class="nav-link">
                            ${link.text}
                            ${isPortfolio ? '<span class="nav-count"></span>' : ''}
                        </a>
                    `;
                }).join('')}
                
                <a href="${ctaHref}" class="nav-cta-btn">
                    <span>${ctaText}</span>
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </nav>
        `;
    }

    updatePortfolioCount(currentTotal) {
        window.PORTFOLIO_TOTAL_COUNT = currentTotal;
        const lastSeenCount = localStorage.getItem('lastSeenPortfolioCount');

        if (lastSeenCount === null) {
            localStorage.setItem('lastSeenPortfolioCount', currentTotal);
            this.hideBadge();
            return;
        }

        const newProjectsCount = currentTotal - parseInt(lastSeenCount, 10);

        if (newProjectsCount > 0) {
            this.showBadge(newProjectsCount);
        } else {
            this.hideBadge();
        }
    }

    showBadge(count) {
        const countEl = this.shadowRoot.querySelector('.nav-count');
        if (countEl) {
            countEl.textContent = count > 99 ? '99+' : count;
            setTimeout(() => {
                countEl.classList.add('visible');
            }, 100);
        }
    }

    hideBadge() {
        const countEl = this.shadowRoot.querySelector('.nav-count');
        if (countEl) {
            countEl.classList.remove('visible');
        }
    }

    resetPortfolioBadge() {
        const currentTotal = window.PORTFOLIO_TOTAL_COUNT || 0;
        localStorage.setItem('lastSeenPortfolioCount', currentTotal);
        this.hideBadge();
    }

    updateCTAVisibility() {
        const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
        if (!ctaBtn) return;

        const currentHash = window.location.hash || '#home';
        const ctaHref = ctaBtn.getAttribute('href');

        if (currentHash === ctaHref) {
            ctaBtn.classList.add('is-hidden');
        } else {
            ctaBtn.classList.remove('is-hidden');
        }
    }

    setActiveLink(activeId) {
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
        const ctaHref = ctaBtn ? ctaBtn.getAttribute('href') : '#contact';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });

        if (ctaBtn) {
            if (`#${activeId}` === ctaHref) {
                ctaBtn.classList.add('is-hidden');
            } else {
                ctaBtn.classList.remove('is-hidden');
            }
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('.landing-section');
        
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -85% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            const activeEntry = entries.find(entry => entry.isIntersecting);
            let newActiveId = '';

            if (activeEntry) {
                newActiveId = activeEntry.target.getAttribute('id');
            } else {
                
                let closestSection = null;
                let minDistance = Infinity;

                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150) {
                        const distance = Math.abs(rect.top);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestSection = section;
                        }
                    }
                });

                if (closestSection) {
                    newActiveId = closestSection.getAttribute('id');
                } else {
                    newActiveId = 'home';
                }
            }

            
            const currentHash = window.location.hash.replace('#', '') || 'home';
            if (newActiveId && newActiveId !== currentHash) {
                
                
                this.setActiveLink(newActiveId);

                
                history.replaceState(null, null, '#' + newActiveId);

               
                if (newActiveId === 'portfolio') {
                    this.resetPortfolioBadge();
                }
            }
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
}

customElements.define('nav-bar', NavBar);


// // class NavBar extends HTMLElement {
// //     constructor() {
// //         super();
// //         this.attachShadow({ mode: 'open' });
// //     }

// //     connectedCallback() {
// //         this.renderBase();

// //         // Слушаем событие от PortfolioSlider с общим количеством проектов
// //         window.addEventListener('portfolio-data-loaded', (e) => {
// //             this.updatePortfolioCount(e.detail.count);
// //         });

// //         const hamburger = this.shadowRoot.querySelector('.hamburger');
// //         hamburger.addEventListener('click', () => {
// //             this.classList.toggle('menu-open');
// //         });

// //         const nav = this.shadowRoot.querySelector('nav');
// //         nav.addEventListener('click', (e) => {
// //             const targetLink = e.target.closest('a');
// //             if (targetLink) {
// //                 this.classList.remove('menu-open');
// //             }
// //         });

// //         this.updateCTAVisibility();
// //         window.addEventListener('hashchange', () => {
// //             this.updateCTAVisibility();
// //         });

// //         this.setupScrollSpy();
// //     }

// //     disconnectedCallback() {
// //         window.removeEventListener('portfolio-data-loaded', this.updatePortfolioCount);
// //     }

// //     renderBase() {
// //         const linksData = JSON.parse(this.getAttribute('links') || '[]');
// //         const ctaText = this.getAttribute('cta-text') || 'Let\'s talk';
// //         const ctaHref = this.getAttribute('cta-href') || '#contact';
        
// //         this.shadowRoot.innerHTML = `
// //             <link rel="stylesheet" href="components/css/nav-bar.css">
            
// //             <button class="hamburger" aria-label="Открыть меню">
// //                 <span></span>
// //                 <span></span>
// //                 <span></span>
// //             </button>

// //             <nav>
// //                 ${linksData.map(link => {
// //                     const isPortfolio = link.href === '#portfolio' || link.text.toLowerCase().includes('portfolio');
                    
// //                     return `
// //                         <a href="${link.href}" class="nav-link">
// //                             ${link.text}
// //                             ${isPortfolio ? '<span class="nav-count"></span>' : ''}
// //                         </a>
// //                     `;
// //                 }).join('')}
                
// //                 <a href="${ctaHref}" class="nav-cta-btn">
// //                     <span>${ctaText}</span>
// //                     <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                         <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
// //                     </svg>
// //                 </a>
// //             </nav>
// //         `;
// //     }

// //     updatePortfolioCount(count) {
// //         window.PORTFOLIO_TOTAL_COUNT = count;
// //         const countEl = this.shadowRoot.querySelector('.nav-count');
// //         if (countEl && count > 0) {
// //             countEl.textContent = count;
// //             // Добавляем класс visible с небольшой задержкой для анимации
// //             setTimeout(() => {
// //                 countEl.classList.add('visible');
// //             }, 100);
// //         }
// //     }

// //     updateCTAVisibility() {
// //         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
// //         if (!ctaBtn) return;

// //         const currentHash = window.location.hash || '#home';
// //         const ctaHref = ctaBtn.getAttribute('href');

// //         if (currentHash === ctaHref) {
// //             ctaBtn.classList.add('is-hidden');
// //         } else {
// //             ctaBtn.classList.remove('is-hidden');
// //         }
// //     }

// //     setupScrollSpy() {
// //         const sections = document.querySelectorAll('.landing-section');
// //         const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
// //         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
// //         const ctaHref = ctaBtn ? ctaBtn.getAttribute('href') : '#contact';

// //         const observerOptions = {
// //             root: null,
// //             rootMargin: '-80px 0px -60% 0px',
// //             threshold: 0
// //         };

// //         const observer = new IntersectionObserver((entries) => {
// //             const activeEntry = entries.find(entry => entry.isIntersecting);

// //             if (activeEntry) {
// //                 const activeId = activeEntry.target.getAttribute('id');

// //                 navLinks.forEach(link => {
// //                     link.classList.remove('active');
// //                     if (link.getAttribute('href') === `#${activeId}`) {
// //                         link.classList.add('active');
// //                     }
// //                 });

// //                 if (ctaBtn) {
// //                     if (`#${activeId}` === ctaHref) {
// //                         ctaBtn.classList.add('is-hidden');
// //                     } else {
// //                         ctaBtn.classList.remove('is-hidden');
// //                     }
// //                 }
// //             }
// //         }, observerOptions);

// //         sections.forEach(section => observer.observe(section));
// //     }
// // }

// // customElements.define('nav-bar', NavBar);


// // class NavBar extends HTMLElement {
// //     constructor() {
// //         super();
// //         this.attachShadow({ mode: 'open' });
// //     }

// //     connectedCallback() {
// //         this.renderBase();

// //         window.addEventListener('portfolio-data-loaded', (e) => {
// //             this.updatePortfolioCount(e.detail.count);
// //         });

// //         const hamburger = this.shadowRoot.querySelector('.hamburger');
// //         if (hamburger) {
// //             hamburger.addEventListener('click', () => {
// //                 this.classList.toggle('menu-open');
// //             });
// //         }

// //         const nav = this.shadowRoot.querySelector('nav');
// //         if (nav) {
// //             nav.addEventListener('click', (e) => {
// //                 const targetLink = e.target.closest('a');
// //                 if (targetLink) {
// //                     const href = targetLink.getAttribute('href');

// //                     // Обработка клика по Pricing для корректного скролла внутри SPA
// //                     if (href === '#pricing' || href === '#pricing-section' || targetLink.textContent.toLowerCase().includes('pricing')) {
// //                         e.preventDefault();
// //                         this.classList.remove('menu-open');
// //                         window.location.hash = 'pricing';
                        
// //                         const priceCards = document.querySelector('price-cards');
// //                         if (priceCards && typeof priceCards.render === 'function') {
// //                             priceCards.render();
// //                         }

// //                         setTimeout(() => {
// //                             const pricingSection = document.querySelector('#pricing') || document.querySelector('.price-header')?.parentElement;
// //                             if (pricingSection) {
// //                                 pricingSection.scrollIntoView({ behavior: 'smooth' });
// //                             }
// //                         }, 50);
// //                     } else {
// //                         this.classList.remove('menu-open');
// //                     }
// //                 }
// //             });
// //         }

// //         this.updateCTAVisibility();
        
// //         window.addEventListener('hashchange', () => {
// //             this.updateCTAVisibility();
// //             // Принудительно обновляем активный пункт при смене хэша
// //             const currentHash = window.location.hash.replace('#', '') || 'home';
// //             this.setActiveLink(currentHash);
// //         });

// //         this.setupScrollSpy();
// //     }

// //     disconnectedCallback() {
// //         window.removeEventListener('portfolio-data-loaded', this.updatePortfolioCount);
// //     }

// //     renderBase() {
// //         const linksData = JSON.parse(this.getAttribute('links') || '[]');
// //         const ctaText = this.getAttribute('cta-text') || 'Let\'s talk';
// //         const ctaHref = this.getAttribute('cta-href') || '#contact';
        
// //         this.shadowRoot.innerHTML = `
// //             <link rel="stylesheet" href="components/css/nav-bar.css">
            
// //             <button class="hamburger" aria-label="Открыть меню">
// //                 <span></span>
// //                 <span></span>
// //                 <span></span>
// //             </button>

// //             <nav>
// //                 ${linksData.map(link => {
// //                     const isPortfolio = link.href === '#portfolio' || link.text.toLowerCase().includes('portfolio');
// //                     return `
// //                         <a href="${link.href}" class="nav-link">
// //                             ${link.text}
// //                             ${isPortfolio ? '<span class="nav-count"></span>' : ''}
// //                         </a>
// //                     `;
// //                 }).join('')}
                
// //                 <a href="${ctaHref}" class="nav-cta-btn">
// //                     <span>${ctaText}</span>
// //                     <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                         <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
// //                     </svg>
// //                 </a>
// //             </nav>
// //         `;
// //     }

// //     updatePortfolioCount(count) {
// //         window.PORTFOLIO_TOTAL_COUNT = count;
// //         const countEl = this.shadowRoot.querySelector('.nav-count');
// //         if (countEl && count > 0) {
// //             countEl.textContent = count;
// //             setTimeout(() => {
// //                 countEl.classList.add('visible');
// //             }, 100);
// //         }
// //     }

// //     updateCTAVisibility() {
// //         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
// //         if (!ctaBtn) return;

// //         const currentHash = window.location.hash || '#home';
// //         const ctaHref = ctaBtn.getAttribute('href');

// //         if (currentHash === ctaHref) {
// //             ctaBtn.classList.add('is-hidden');
// //         } else {
// //             ctaBtn.classList.remove('is-hidden');
// //         }
// //     }

// //     // Вспомогательный метод для установки активного класса
// //     setActiveLink(activeId) {
// //         const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
// //         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
// //         const ctaHref = ctaBtn ? ctaBtn.getAttribute('href') : '#contact';

// //         navLinks.forEach(link => {
// //             link.classList.remove('active');
// //             if (link.getAttribute('href') === `#${activeId}`) {
// //                 link.classList.add('active');
// //             }
// //         });

// //         if (ctaBtn) {
// //             if (`#${activeId}` === ctaHref) {
// //                 ctaBtn.classList.add('is-hidden');
// //             } else {
// //                 ctaBtn.classList.remove('is-hidden');
// //             }
// //         }
// //     }

// //     setupScrollSpy() {
// //         const sections = document.querySelectorAll('.landing-section');
        
// //         // === ИСПРАВЛЕНИЕ 1: Более точная линия срабатывания ===
// //         // -10% сверху и -85% снизу означают, что "триггер" находится на 15% от верха экрана.
// //         // Это гораздо надежнее при больших отступах, чем -60%.
// //         const observerOptions = {
// //             root: null,
// //             rootMargin: '-10% 0px -85% 0px',
// //             threshold: 0
// //         };

// //         const observer = new IntersectionObserver((entries) => {
// //             // Ищем секцию, которая прямо сейчас пересекает нашу линию триггера
// //             const activeEntry = entries.find(entry => entry.isIntersecting);

// //             if (activeEntry) {
// //                 // Если секция пересекает линию, всё отлично, делаем её активной
// //                 this.setActiveLink(activeEntry.target.getAttribute('id'));
// //             } else {
// //                 // === ИСПРАВЛЕНИЕ 2: Fallback для огромных отступов ===
// //                 // Если мы в гигантском margin и НИ ОДНА секция не пересекает линию,
// //                 // мы вручную находим ту секцию, верх которой находится ближе всего к верху экрана.
// //                 let closestSection = null;
// //                 let minDistance = Infinity;

// //                 sections.forEach(section => {
// //                     const rect = section.getBoundingClientRect();
// //                     // Проверяем секции, верх которых уже ушел за пределы ~150px от верха экрана
// //                     if (rect.top <= 150) {
// //                         const distance = Math.abs(rect.top);
// //                         if (distance < minDistance) {
// //                             minDistance = distance;
// //                             closestSection = section;
// //                         }
// //                     }
// //                 });

// //                 if (closestSection) {
// //                     this.setActiveLink(closestSection.getAttribute('id'));
// //                 } else {
// //                     // Если вообще ничего не найдено (например, мы в самом верху страницы до первой секции)
// //                     const currentHash = window.location.hash.replace('#', '') || 'home';
// //                     this.setActiveLink(currentHash);
// //                 }
// //             }
// //         }, observerOptions);

// //         sections.forEach(section => observer.observe(section));
// //     }
// // }

// // customElements.define('nav-bar', NavBar);


// class NavBar extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//     }

//     connectedCallback() {
//         this.renderBase();

//         // Слушаем событие загрузки данных портфолио
//         window.addEventListener('portfolio-data-loaded', (e) => {
//             this.updatePortfolioCount(e.detail.count);
//         });

//         const hamburger = this.shadowRoot.querySelector('.hamburger');
//         if (hamburger) {
//             hamburger.addEventListener('click', () => {
//                 this.classList.toggle('menu-open');
//             });
//         }

//         const nav = this.shadowRoot.querySelector('nav');
//         if (nav) {
//             nav.addEventListener('click', (e) => {
//                 const targetLink = e.target.closest('a');
//                 if (targetLink) {
//                     const href = targetLink.getAttribute('href');
//                     const isPortfolio = href === '#portfolio' || targetLink.textContent.toLowerCase().includes('portfolio');

//                     // === НОВАЯ ЛОГИКА: Сбрасываем бейдж при переходе в портфолио ===
//                     if (isPortfolio) {
//                         this.resetPortfolioBadge();
//                     }

//                     // Обработка клика по Pricing (твой старый код)
//                     if (href === '#pricing' || href === '#pricing-section' || targetLink.textContent.toLowerCase().includes('pricing')) {
//                         e.preventDefault();
//                         this.classList.remove('menu-open');
//                         window.location.hash = 'pricing';
                        
//                         const priceCards = document.querySelector('price-cards');
//                         if (priceCards && typeof priceCards.render === 'function') {
//                             priceCards.render();
//                         }

//                         setTimeout(() => {
//                             const pricingSection = document.querySelector('#pricing') || document.querySelector('.price-header')?.parentElement;
//                             if (pricingSection) {
//                                 pricingSection.scrollIntoView({ behavior: 'smooth' });
//                             }
//                         }, 50);
//                     } else {
//                         this.classList.remove('menu-open');
//                     }
//                 }
//             });
//         }

//         this.updateCTAVisibility();
        
//         window.addEventListener('hashchange', () => {
//             this.updateCTAVisibility();
//             const currentHash = window.location.hash.replace('#', '') || 'home';
//             this.setActiveLink(currentHash);
//         });

//         this.setupScrollSpy();
//     }

//     disconnectedCallback() {
//         window.removeEventListener('portfolio-data-loaded', this.updatePortfolioCount);
//     }

//     renderBase() {
//         const linksData = JSON.parse(this.getAttribute('links') || '[]');
//         const ctaText = this.getAttribute('cta-text') || 'Let\'s talk';
//         const ctaHref = this.getAttribute('cta-href') || '#contact';
        
//         this.shadowRoot.innerHTML = `
//             <link rel="stylesheet" href="components/css/nav-bar.css">
            
//             <button class="hamburger" aria-label="Открыть меню">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//             </button>

//             <nav>
//                 ${linksData.map(link => {
//                     const isPortfolio = link.href === '#portfolio' || link.text.toLowerCase().includes('portfolio');
//                     return `
//                         <a href="${link.href}" class="nav-link">
//                             ${link.text}
//                             ${isPortfolio ? '<span class="nav-count"></span>' : ''}
//                         </a>
//                     `;
//                 }).join('')}
                
//                 <a href="${ctaHref}" class="nav-cta-btn">
//                     <span>${ctaText}</span>
//                     <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M11.3609 13.542L19.543 7.04199L11.3609 0.541992M19.543 7.04199H0.542968" stroke="white" stroke-width="1.08428" stroke-linecap="round" stroke-linejoin="round"/>
//                     </svg>
//                 </a>
//             </nav>
//         `;
//     }

//     // === ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ===
//     updatePortfolioCount(currentTotal) {
//         window.PORTFOLIO_TOTAL_COUNT = currentTotal;
        
//         // 1. Получаем количество, которое пользователь видел в прошлый раз
//         const lastSeenCount = localStorage.getItem('lastSeenPortfolioCount');

//         // 2. Если это первый визит (в localStorage ничего нет)
//         if (lastSeenCount === null) {
//             // Просто запоминаем текущее количество и скрываем бейдж
//             localStorage.setItem('lastSeenPortfolioCount', currentTotal);
//             this.hideBadge();
//             return;
//         }

//         // 3. Если визит не первый, считаем разницу
//         const newProjectsCount = currentTotal - parseInt(lastSeenCount, 10);

//         // 4. Логика отображения
//         if (newProjectsCount > 0) {
//             this.showBadge(newProjectsCount);
//         } else {
//             this.hideBadge();
//         }
//     }

//     showBadge(count) {
//         const countEl = this.shadowRoot.querySelector('.nav-count');
//         if (countEl) {
//             // Защита от огромных чисел (если больше 99, покажем 99+)
//             countEl.textContent = count > 99 ? '99+' : count;
            
//             // Небольшая задержка для красивого появления анимации
//             setTimeout(() => {
//                 countEl.classList.add('visible');
//             }, 100);
//         }
//     }

//     hideBadge() {
//         const countEl = this.shadowRoot.querySelector('.nav-count');
//         if (countEl) {
//             countEl.classList.remove('visible');
//         }
//     }

//     // Вызываем это, когда пользователь реально перешел в портфолио
//     resetPortfolioBadge() {
//         const currentTotal = window.PORTFOLIO_TOTAL_COUNT || 0;
//         localStorage.setItem('lastSeenPortfolioCount', currentTotal);
//         this.hideBadge();
//     }

//     // ... остальной твой код (updateCTAVisibility, setActiveLink, setupScrollSpy) остается без изменений ...
//     updateCTAVisibility() {
//         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
//         if (!ctaBtn) return;

//         const currentHash = window.location.hash || '#home';
//         const ctaHref = ctaBtn.getAttribute('href');

//         if (currentHash === ctaHref) {
//             ctaBtn.classList.add('is-hidden');
//         } else {
//             ctaBtn.classList.remove('is-hidden');
//         }
//     }

//     setActiveLink(activeId) {
//         const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
//         const ctaBtn = this.shadowRoot.querySelector('.nav-cta-btn');
//         const ctaHref = ctaBtn ? ctaBtn.getAttribute('href') : '#contact';

//         navLinks.forEach(link => {
//             link.classList.remove('active');
//             if (link.getAttribute('href') === `#${activeId}`) {
//                 link.classList.add('active');
//             }
//         });

//         if (ctaBtn) {
//             if (`#${activeId}` === ctaHref) {
//                 ctaBtn.classList.add('is-hidden');
//             } else {
//                 ctaBtn.classList.remove('is-hidden');
//             }
//         }
//     }

//     setupScrollSpy() {
//         const sections = document.querySelectorAll('.landing-section');
        
//         const observerOptions = {
//             root: null,
//             rootMargin: '-10% 0px -85% 0px',
//             threshold: 0
//         };

//         const observer = new IntersectionObserver((entries) => {
//             const activeEntry = entries.find(entry => entry.isIntersecting);

//             if (activeEntry) {
//                 this.setActiveLink(activeEntry.target.getAttribute('id'));
//             } else {
//                 let closestSection = null;
//                 let minDistance = Infinity;

//                 sections.forEach(section => {
//                     const rect = section.getBoundingClientRect();
//                     if (rect.top <= 150) {
//                         const distance = Math.abs(rect.top);
//                         if (distance < minDistance) {
//                             minDistance = distance;
//                             closestSection = section;
//                         }
//                     }
//                 });

//                 if (closestSection) {
//                     this.setActiveLink(closestSection.getAttribute('id'));
//                 } else {
//                     const currentHash = window.location.hash.replace('#', '') || 'home';
//                     this.setActiveLink(currentHash);
//                 }
//             }
//         }, observerOptions);

//         sections.forEach(section => observer.observe(section));
//     }
// }

// customElements.define('nav-bar', NavBar);

