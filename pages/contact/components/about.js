class AboutContact extends HTMLElement {
    constructor() {
        super();
        this.currentPlan = null;
        this.handlePlanChange = this.handlePlanChange.bind(this);
        
        this.captchaRequired = false;
        this.captchaWidgetId = null;
        this.hcaptchaLoading = null;
        this.captchaErrorCount = 0;

        this.onCaptchaSolved = this.onCaptchaSolved.bind(this);
        this.onCaptchaExpired = this.onCaptchaExpired.bind(this);
        this.onCaptchaError = this.onCaptchaError.bind(this);
    }

    connectedCallback() {
        window.addEventListener('planChanged', this.handlePlanChange);
        
        setTimeout(() => {
            // Модальное окно глобальное, оставляем его ID как есть
            const modal = document.getElementById('hcaptcha-modal');
            const closeBtn = modal?.querySelector('.hcaptcha-modal-close');
            
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target.classList.contains('hcaptcha-modal-backdrop')) {
                        this.closeCaptchaModal();
                    }
                });
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeCaptchaModal());
            }
        }, 100);
        
        this.render();
    }

    closeCaptchaModal() {
        const modal = document.getElementById('hcaptcha-modal');
        if (modal) {
            modal.style.display = 'none';
            this.captchaWidgetId = null;
        }
    }

    disconnectedCallback() {
        window.removeEventListener('planChanged', this.handlePlanChange);
    }

    handlePlanChange(event) {
        this.currentPlan = event.detail;
        this.updateSelectedPackage();
    }

    renderSelectedPackage(plan) {
        return `
            <div class="ac-selected-package">
                <div class="ac-package-header">
                    <div class="ac-package-icon">
                        ${plan.icon}
                    </div>
                    <div class="ac-package-info">
                        <span class="ac-package-label">Selected package</span>
                        <h3 class="ac-package-name">${plan.title}</h3>
                        <span class="ac-package-price">From ${plan.price}</span>
                    </div>
                    <div class="ac-package-actions">
                        <button class="ac-clear-btn" type="button">Clear</button>
                        <button class="ac-change-btn" type="button">Change</button>
                    </div>
                </div>
            </div>
        `;
    }

    initPackageActions() {
        const container = this.querySelector('#ac-selected-package-container');
        if (!container) return;

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('ac-clear-btn')) {
                e.preventDefault();
                const packageElement = container.querySelector('.ac-selected-package');
                
                if (packageElement) {
                    const animation = packageElement.animate([
                        { opacity: 1, transform: 'translateY(0)', marginBottom: '24px' },
                        { opacity: 0, transform: 'translateY(-20px)', marginBottom: '0' }
                    ], {
                        duration: 300,
                        easing: 'ease-out',
                        fill: 'forwards'
                    });

                    animation.finished.then(() => {
                        localStorage.removeItem('selectedPlan');
                        this.currentPlan = null;
                        container.innerHTML = '';
                        window.dispatchEvent(new CustomEvent('planCleared', { bubbles: true, composed: true }));
                    });
                }
            }

            if (e.target.classList.contains('ac-change-btn')) {
                e.preventDefault();
                window.location.hash = 'pricing';
                
                const priceCards = document.querySelector('price-cards');
                if (priceCards && typeof priceCards.render === 'function') {
                    priceCards.render();
                }
                
                setTimeout(() => {
                    const pricingSection = document.querySelector('#pricing');
                    if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 50);
            }
        });
    }

    updateSelectedPackage() {
        const container = this.querySelector('#ac-selected-package-container');
        if (!container) return;

        const storedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        this.currentPlan = storedPlan || null;
        const plan = this.currentPlan;

        if (plan) {
            container.innerHTML = this.renderSelectedPackage(plan);
        } else {
            container.innerHTML = '';
        }
    }

    render() {
        const storedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        this.currentPlan = this.currentPlan || storedPlan || null;

        this.innerHTML = `
            <section class="ac-section" id="contact">
                <div class="ac-container">
                    <div class="ac-left">
                        <h1 class="ac-title">
                            Let's build your next<br>
                            top-performing<br>
                            <span class="ac-title-red">playable</span>
                        </h1>
                        <p class="ac-subtitle">
                            Have a project in mind?<br>
                            Send us a message and we'll get back to you within 24 hours
                        </p>
                        <div class="ac-team-photo">
                            <img src="assets/img/about/team.png" alt="Our team">
                        </div>
                    </div>

                    <div class="ac-right">
                        <div class="ac-form-wrapper">
                            <h2 class="ac-form-title">Send us a message</h2>
                            
                            <div id="ac-selected-package-container"></div>
                            
                            <form class="ac-form" id="ac-contact-form">
                                <div class="ac-form-row">
                                    <div class="ac-form-group">
                                        <label class="ac-sr-only" for="ac-name">Name</label>
                                        <input type="text" id="ac-name" name="name" class="ac-input" placeholder="Name:" autocomplete="name" required>
                                    </div>
                                    <div class="ac-form-group">
                                        <label class="ac-sr-only" for="ac-email">Email</label>
                                        <input type="email" id="ac-email" name="email" class="ac-input" placeholder="Email:" autocomplete="email" inputmode="email" required>
                                    </div>
                                </div>
                                
                                <div class="ac-form-group ac-textarea-group">
                                    <label class="ac-sr-only" for="ac-message">Message</label>
                                    <textarea id="ac-message" name="message" class="ac-textarea" rows="6" placeholder="Tell us a few words about your project:" minlength="7" required></textarea>
                                    <span class="ac-char-counter">0/500</span>
                                    <small class="ac-message-hint"></small>
                                </div>
                                
                                <div class="ac-hp-field" style="display: none;" aria-hidden="true">
                                    <label for="ac-company-url">Company website</label>
                                    <input id="ac-company-url" name="company_url" type="text" class="ac-input" tabindex="-1" autocomplete="off">
                                </div>
                                
                                <div class="ac-form-error" role="alert"></div>
                                
                                <div id="ac-contact-captcha" style="display: none; margin-bottom: 15px;"></div>
                                <div class="ac-captcha-note" role="alert" style="color: #ff4444; font-size: 0.9rem; margin-bottom: 10px; min-height: 20px;"></div>
                                
                                <div class="ac-form-checkbox">
                                    <label class="ac-checkbox-label" for="ac-offer">
                                        <input type="checkbox" id="ac-offer" name="offer" checked required>
                                        <span class="ac-checkbox-custom"></span>
                                        <span class="ac-checkbox-text">Agree with <a href="#" class="ac-terms-link">the terms and conditions</a> *</span>
                                    </label>
                                </div>
                                
                                <button type="submit" id="ac-contact-button" class="ac-submit-btn">
                                    Send message
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </form>

                            <div class="ac-form-divider"></div>

                            <div class="ac-direct-contact">
                                <p class="ac-direct-title">Or reach us directly</p>
                                <a href="mailto:sales@mraid.io" class="ac-direct-link">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                    sales@mraid.io
                                </a>
                                <a href="https://linkedin.com/company/mraid-io/" class="ac-direct-link" target="_blank">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    linkedin.com/company/mraid-io/
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.initForm();
        this.initPackageActions();
        this.updateSelectedPackage();
    }

    initForm() {
        const form = this.querySelector('#ac-contact-form');
        const nameInput = this.querySelector('#ac-name');
        const emailInput = this.querySelector('#ac-email');
        const messageInput = this.querySelector('#ac-message');
        const offerInput = this.querySelector('#ac-offer');
        const honeypotInput = this.querySelector('#ac-company-url');
        const submitBtn = this.querySelector('#ac-contact-button');
        const errorEl = this.querySelector('.ac-form-error');
        const counter = this.querySelector('.ac-char-counter');

        if (messageInput && counter) {
            messageInput.addEventListener('input', () => {
                counter.textContent = `${messageInput.value.length}/500`;
            });
        }

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (honeypotInput && honeypotInput.value) {
                this.showThanks(form);
                return;
            }

            let invalidFields = [];
            if (!nameInput.value.trim()) invalidFields.push('Name');
            if (!emailInput.value.trim() || !emailInput.validity.valid) invalidFields.push('Email');
            if (!messageInput.value.trim() || messageInput.value.trim().length < 7) invalidFields.push('Message');
            if (!offerInput.checked) invalidFields.push('Terms and Conditions');

            if (invalidFields.length) {
                if (errorEl) errorEl.textContent = 'Please fill in correctly: ' + invalidFields.join(', ') + '.';
                return;
            }
            if (errorEl) errorEl.textContent = '';

            if (this.captchaRequired && window.hcaptcha) {
                if (this.captchaWidgetId === null) {
                    this.showCaptchaNote('Captcha widget blocked. Retrying... Please click "Send Message" again.');
                    this.renderCaptcha();
                    return; 
                }
                
                const token = window.hcaptcha.getResponse(this.captchaWidgetId);
                if (!token) {
                    this.showCaptchaNote('Please complete the captcha.');
                    return;
                }
                this.submitFormData(token);
            } else {
                this.submitFormData(null);
            }
        });
    }

    submitFormData(captchaToken) {
        const nameInput = this.querySelector('#ac-name');
        const emailInput = this.querySelector('#ac-email');
        const messageInput = this.querySelector('#ac-message');
        const honeypotInput = this.querySelector('#ac-company-url');
        const submitBtn = this.querySelector('#ac-contact-button');
        const errorEl = this.querySelector('.ac-form-error');

        const gclid = localStorage.getItem('mraid_gclid') || '';
        const planTitle = this.currentPlan ? this.currentPlan.title : '';
        
        const params = new URLSearchParams();
        params.append('name', nameInput.value.trim());
        params.append('email', emailInput.value.trim());
        params.append('message', messageInput.value.trim());
        params.append('company_url', honeypotInput ? honeypotInput.value : '');
        params.append('gclid', gclid);
        params.append('source', window.location.hostname);
        params.append('v', '2');
        if (planTitle) params.append('plan', planTitle);
        if (captchaToken) params.append('hcaptcha', captchaToken);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://dashboard.mraid.io/contact', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;

            if (xhr.status === 200) {
                this.showThanks(this.querySelector('#ac-contact-form'));
            } else if (xhr.status === 428 || (xhr.responseText && xhr.responseText.includes('captcha_required'))) {
                this.captchaRequired = true;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                this.showCaptchaNote('Please confirm you are not a robot.');
                
                this.loadHcaptcha().then(() => {
                    this.renderCaptcha();
                }).catch(() => {
                    this.showCaptchaNote('Captcha failed to load. Please reload the page or write to sales@mraid.io.');
                });
            } else if (xhr.status === 400) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                this.captchaWidgetId = null;
                this.captchaRequired = true;
                
                this.showCaptchaNote('Captcha check failed. Please try again.');
                setTimeout(() => {
                    this.renderCaptcha();
                }, 500);
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                if (errorEl) errorEl.textContent = 'Something went wrong. Please try again or write to sales@mraid.io.';
            }
        };

        xhr.onerror = () => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            if (errorEl) errorEl.textContent = 'Connection error. Please check your internet and try again.';
        };

        xhr.send(params.toString());
    }

    loadHcaptcha() {
        if (window.hcaptcha) return Promise.resolve();
        if (this.hcaptchaLoading) return this.hcaptchaLoading;
        
        this.hcaptchaLoading = new Promise((resolve, reject) => {
            window.onLoadCallback = () => {
                resolve();
            };
            
            const s = document.createElement('script');
            s.src = 'https://js.hcaptcha.com/1/api.js?onload=onLoadCallback&render=explicit';
            s.async = true;
            s.defer = true;
            s.onerror = () => {
                this.hcaptchaLoading = null;
                reject(new Error('hcaptcha load failed'));
            };
            document.head.appendChild(s);
        });
        return this.hcaptchaLoading;
    }

    renderCaptcha() {
        const modal = document.getElementById('hcaptcha-modal');
        const container = document.getElementById('hcaptcha-widget-container');
        
        if (!modal || !container) return;

        modal.style.display = 'flex';

        if (!window.hcaptcha) {
            this.loadHcaptcha().then(() => {
                this.renderCaptcha();
            });
            return;
        }

        container.innerHTML = '';
        this.captchaWidgetId = null;

        try {
            this.captchaWidgetId = window.hcaptcha.render(container, {
                sitekey: '519ea82c-d070-4543-909d-f76ff016bdfa',
                callback: this.onCaptchaSolved,
                'expired-callback': this.onCaptchaExpired,
                'error-callback': this.onCaptchaError,
                'theme': 'dark'
            });
        } catch (e) {
            console.error('[hCaptcha] Render error:', e);
        }
    }

    onCaptchaSolved(token) {
        this.captchaErrorCount = 0;
        this.showCaptchaNote('');
        
        const modal = document.getElementById('hcaptcha-modal');
        if (modal) modal.style.display = 'none';
        
        this.submitFormData(token);
    }

    onCaptchaExpired() {
        this.captchaWidgetId = null;
        this.showCaptchaNote('Captcha expired. Please try again.');
    }

    onCaptchaError(error) {
        this.captchaErrorCount++;
        this.captchaWidgetId = null;
        
        if (this.captchaErrorCount >= 2) {
            this.showCaptchaNote('Captcha failed. Please reload the page.');
        }
    }

    showCaptchaNote(html) {
        const noteEl = this.querySelector('.ac-captcha-note');
        if (noteEl) noteEl.innerHTML = html;
    }

    showThanks(form) {
        const modal = document.getElementById('hcaptcha-modal');
        if (modal) modal.style.display = 'none';
        
        const container = document.getElementById('hcaptcha-widget-container');
        if (container) container.innerHTML = '';
        
        form.style.display = 'none';
        const thanksMsg = document.createElement('div');
        thanksMsg.className = 'ac-form-thanks';
        thanksMsg.innerHTML = '<p>Thanks! Your message has been submitted.<br>We will contact you within 24 hours.</p>';
        form.parentElement.appendChild(thanksMsg);
        
        localStorage.removeItem('selectedPlan');
        this.currentPlan = null;
        this.captchaRequired = false;
        this.captchaWidgetId = null;
    }
}

customElements.define('about-contact', AboutContact);