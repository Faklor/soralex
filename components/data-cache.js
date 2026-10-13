// data-cache.js
window.PortfolioDataCache = (function() {
    let dataPromise = null;
    let cachedData = null;

    return {
        getData: function() {
            // Если данные уже загружены, возвращаем их мгновенно
            if (cachedData) return Promise.resolve(cachedData);
            
            // Если запрос уже идет, все компоненты дождутся этого же промиса
            if (!dataPromise) {
                dataPromise = fetch('https://dashboard.mraid.io/portfolio.json')
                    .then(res => {
                        if (!res.ok) throw new Error('Network error: ' + res.status);
                        return res.json();
                    })
                    .then(data => {
                        cachedData = data;
                        return data;
                    })
                    .catch(err => {
                        console.error('PortfolioDataCache fetch failed:', err);
                        dataPromise = null; // Сбрасываем при ошибке, чтобы следующая попытка могла сработать
                        throw err;
                    });
            }
            return dataPromise;
        }
    };
})();


// data-cache.js
// window.PortfolioDataCache = (function() {
//     let dataPromise = null;

//     return {
//         getData: function() {
            
//             if (dataPromise) return dataPromise;

            
//             const placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            
            
//             const mockPreviews = [];
//             const categories = ["Action", "Puzzle", "Strategy", "Arcade", "Hypercasual"];
//             const genres = ["Shooter", "Match-3", "RPG", "Runner", "Puzzle"];
//             const formats = ["2d", "3d"];

//             for (let i = 1; i <= 15; i++) {
//                 mockPreviews.push({
//                     project: `Test Project ${i}`,
//                     categories: [categories[i % categories.length]],
//                     genres: [genres[i % genres.length]],
//                     formats: [formats[i % formats.length]],
//                     screenshot: placeholderImage, 
//                     url: "#",
//                     favorite: i % 3 === 0 ? 1 : 0 
//                 });
//             }

//             const mockData = {
//                 previews: mockPreviews
//             };

            
//             dataPromise = Promise.resolve(mockData);
//             return dataPromise;
//         }
//     };
// })();