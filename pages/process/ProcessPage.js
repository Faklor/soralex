class ProcessPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/process/ProcessPage.css">
            
            <div class="process-page" data-reveal >
              
                <!-- Заголовок страницы -->
                <section class="process-header">
                    <div class="process-title">
                        <h1><span>AI</span> isn't our shortcut<br>It's our production <span>advantage</span></h1>
                    </div>
                    <div class="process-description">
                        <p>From the first idea to the final build, AI is integrated into our workflow—helping our team move faster, explore more creative directions and deliver better playables</p>
                    </div>
                </section>

                <!-- Ряд 1: Карточки с иконками -->
                <process-steps></process-steps>

               

                <!-- Ряд 3: Картинки-превью -->
                <process-previews></process-previews>

                 <!-- Ряд 2: Текст про AI -->
                <process-ai></process-ai>

                <process-contact></process-contact>

                <process-platforms></process-platforms>

                <process-tech></process-tech>
            </div>
        `;
    }
}

customElements.define('page-process', ProcessPage);