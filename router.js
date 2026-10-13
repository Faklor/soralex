// router.js

// Карта соответствия: Хэш URL -> Имя тега компонента страницы
const routes = {
    '#home': 'page-home',
    '#process': 'page-process',
    '#pricing': 'page-pricing',
    '#portfolio': 'page-portfolio',
    '#dashboard': 'page-dashboard',
    '#contact': 'page-contact'
};

function renderPage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 1. Получаем текущий хэш или ставим #home по умолчанию
    const currentHash = window.location.hash || '#home';
    
    // 2. Находим имя компонента для этого хэша
    const componentName = routes[currentHash] || 'page-home';
    
    // 3. Очищаем текущий контент в <main>
    mainContent.innerHTML = '';
    
    // 4. Создаем и вставляем новый компонент-страницу
    const pageElement = document.createElement(componentName);
    mainContent.appendChild(pageElement);
    
    // 5. Скролл наверх при смене страницы (плавно)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Слушаем изменение хэша (клики по ссылкам)
window.addEventListener('hashchange', renderPage);

// Рендерим страницу при первой загрузке
window.addEventListener('DOMContentLoaded', renderPage);