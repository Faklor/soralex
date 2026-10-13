class DashboardPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="pages/dashboard/dashboardPage.css">
            
            <div class="dashboard-page">
                <dashboard-showcase></dashboard-showcase>
                <dashboard-features></dashboard-features>
                <dashboard-info></dashboard-info>
            </div>
        `;
    }
}

customElements.define('page-dashboard', DashboardPage);