class AppPreloader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="components/css/app-preloader.css">
            
            <div class="preloader-container">

                <svg class="loader-svg" width="128" height="95" viewBox="0 0 128 95" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
                    <path class="logo-part" d="M24 71H36V83H24V71Z" fill="#FF0036"/>
                    <path class="logo-part" d="M24 59H36V71H24V59Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 1H24V13H12V1Z" fill="#FF0036"/>
                    <path class="logo-part" d="M24 1H36V13H24V1Z" fill="#FF0036"/>
                    <path class="logo-part" d="M24 13H36V25H24V13Z" fill="#FF0036"/>
                    <path class="logo-part" d="M36 13H48V25H36V13Z" fill="#FF0036"/>
                    <path class="logo-part" d="M35 25H47V37H35V25Z" fill="#FF0036"/>
                    <path class="logo-part" d="M59 36H71V48H59V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M71 36H83V48H71V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M83 36H93V48H83V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 84H128V95H116V84Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 84H116V95H104V84Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 72H116V84H104V72Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 72H104V84H92V72Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 60H116V72H104V60Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 60H104V72H92V60Z" fill="#FF0036"/>
                    <path class="logo-part" d="M80 60H92V72H80V60Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 48H116V60H104V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 48H104V60H92V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M80 48H92V60H80V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M68 48H80V60H68V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M105 36H116V48H105V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M80 24H92V36H80V24Z" fill="#FF0036"/>
                    <path class="logo-part" d="M68 24H80V36H68V24Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 12H116V24H104V12Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 12H104V24H92V12Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 24H104V36H92V24Z" fill="#FF0036"/>
                    <path class="logo-part" d="M80 12H92V24H80V12Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 24H116V36H104V24Z" fill="#FF0036"/>
                    <path class="logo-part" d="M104 0H116V12H104V0Z" fill="#FF0036"/>
                    <path class="logo-part" d="M92 0H104V12H92V0Z" fill="#FF0036"/>
                    <path class="logo-part" d="M47 36H59V48H47V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 13H24V25H12V13Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 25H24V37H12V25Z" fill="#FF0036"/>
                    <path class="logo-part" d="M36 59H48V71H36V59Z" fill="#FF0036"/>
                    <path class="logo-part" d="M35 47H47V59H35V47Z" fill="#FF0036"/>
                    <path class="logo-part" d="M47 48H59V59H47V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 71H24V83H12V71Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 83H24V95H12V83Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 83H12V95H0V83Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 71H12V83H0V71Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 59H24V71H12V59Z" fill="#FF0036"/>
                    <path class="logo-part" d="M12 47H24V59H12V47Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 59H12V71H0V59Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 47H12V59H0V47Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 35H12V47H0V35Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 23H12V35H0V23Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 11H12V23H0V11Z" fill="#FF0036"/>
                    <path class="logo-part" d="M0 1H12V11H0V1Z" fill="#FF0036"/>
                    <path class="logo-part" d="M47 25H59V36H47V25Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 72H128V84H116V72Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 60H128V72H116V60Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 48H128V60H116V48Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 36H128V48H116V36Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 24H128V36H116V24Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 12H128V24H116V12Z" fill="#FF0036"/>
                    <path class="logo-part" d="M116 0H128V12H116V0Z" fill="#FF0036"/>
                </svg>

            </div>
        `;
        

        // Запускаем анимацию
        requestAnimationFrame(() => {
            const parts = this.shadowRoot.querySelectorAll('.logo-part');
            const animationDuration = 2500; // 2.5 секунды на весь цикл

            parts.forEach((part) => {
                // 1. Откуда прилетают (сборка)
                const startX = (Math.random() - 0.5) * 600;
                const startY = (Math.random() - 0.5) * 600;
                
                // 2. Куда улетают (разлёт - делаем разброс чуть больше для эффекта взрыва)
                const endX = (Math.random() - 0.5) * 800;
                const endY = (Math.random() - 0.5) * 800;

                part.style.setProperty('--tx-start', `${startX}px`);
                part.style.setProperty('--ty-start', `${startY}px`);
                part.style.setProperty('--tx-end', `${endX}px`);
                part.style.setProperty('--ty-end', `${endY}px`);
                
                // cubic-bezier(0.4, 0, 0.2, 1) - это стандартная плавная кривая Material Design
                part.style.animation = `assembleAndScatter ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            });

            // CALLBACK: Когда анимация заканчивается
            setTimeout(() => {
                this.finishPreloading();
            }, animationDuration);
        });
    }

    // Метод завершения: скрывает прелоадер и сообщает главному файлу
    finishPreloading() {
        // 1. Скрываем сам прелоадер (срабатывает CSS transition на opacity)
        this.classList.add('hidden');
        
        // 2. Отправляем событие (Callback) вовне, чтобы index.html знал, что можно показывать контент
        this.dispatchEvent(new CustomEvent('preloader-complete', { bubbles: true, composed: true }));

        // 3. Полностью удаляем из DOM после завершения fade-out (0.8s)
        setTimeout(() => {
            this.style.display = 'none';
            // this.remove(); // Можно раскомментировать, чтобы полностью удалить из памяти
        }, 800);
    }
}

customElements.define('app-preloader', AppPreloader);