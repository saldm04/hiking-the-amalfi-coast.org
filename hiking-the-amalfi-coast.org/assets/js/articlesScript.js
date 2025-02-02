// assets/js/articlesScript.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/json/articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON');
            }
            return response.json();
        })
        .then(articles => {
            const articlesRow = document.getElementById('articlesRow');

            articles.forEach(article => {
                // Creazione della colonna
                const col = document.createElement('div');
                col.className = 'col-md-4';

                // Creazione della card
                const card = document.createElement('div');
                card.className = 'card mb-3';

                // Creazione del link con immagine
                const link = document.createElement('a');
                link.href = article.link;
                link.target = '_blank';
                link.className = 'hover-opacity';
                link.setAttribute('aria-label', article.title);

                const img = document.createElement('img');
                img.src = article.image;
                img.className = 'card-img-top';
                img.alt = article.alt;

                link.appendChild(img);
                card.appendChild(link);

                // Creazione del body della card
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = article.title;

                const cardText = document.createElement('p');
                cardText.className = 'card-text';
                cardText.textContent = article.description;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                card.appendChild(cardBody);

                col.appendChild(card);
                articlesRow.appendChild(col);
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            const articlesRow = document.getElementById('articlesRow');
            articlesRow.innerHTML = '<p class="text-danger">Errore nel caricamento degli articoli.</p>';
        });
});
