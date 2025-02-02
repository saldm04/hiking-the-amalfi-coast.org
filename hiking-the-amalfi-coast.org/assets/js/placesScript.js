document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/json/places.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON');
            }
            return response.json();
        })
        .then(data => {
            const sidebarOffcanvas = document.getElementById('places-sidebar-offcanvas');
            const content = document.getElementById('places-content');

            data.luoghi.forEach(luogo => {
                // Crea il link per l'offcanvas
                const link = document.createElement('a');
                link.classList.add('list-group-item', 'list-group-item-action');
                link.href = `#${luogo.id}`;
                link.textContent = luogo.nome;

                // Chiudi l'offcanvas al click sul link
                link.addEventListener('click', () => {
                    const offcanvasEl = document.getElementById('offcanvasSidebar');
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide();
                    }
                });

                // Aggiungi il link all'offcanvas
                sidebarOffcanvas.appendChild(link);

                // Crea la sezione del luogo nel contenuto principale
                const section = document.createElement('section');
                section.id = luogo.id;
                section.classList.add('mb-5', 'scroll-section');

                // Titolo
                const titolo = document.createElement('h2');
                titolo.textContent = luogo.nome;

                // Descrizione
                const descrizione = document.createElement('p');
                descrizione.textContent = luogo.descrizione;

                // Crea il wrapper per la galleria
                const galleryWrapper = document.createElement('div');
                galleryWrapper.classList.add('d-flex', 'align-items-center', 'mb-3');

                // Pulsante per lo scroll a sinistra
                const btnPrev = document.createElement('button');
                btnPrev.classList.add('btn');
                btnPrev.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`;
                btnPrev.style.flexShrink = '0';
                btnPrev.style.backgroundColor = '#003366';
                btnPrev.style.width = '35px';
                btnPrev.style.height = '35px';
                btnPrev.style.padding = '0';

                // Container per le immagini
                const immaginiContainer = document.createElement('div');
                immaginiContainer.classList.add('d-flex', 'flex-row', 'overflow-auto', 'gap-2', 'no-scrollbar');
                immaginiContainer.style.scrollBehavior = 'smooth';
                immaginiContainer.style.flexGrow = '1';
                immaginiContainer.style.margin = '0 10px';
                immaginiContainer.style.msOverflowStyle = 'none';
                immaginiContainer.style.scrollbarWidth = 'none';

                // Pulsante per lo scroll a destra
                const btnNext = document.createElement('button');
                btnNext.classList.add('btn');
                btnNext.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>`;
                btnNext.style.flexShrink = '0';
                btnNext.style.backgroundColor = '#003366';
                btnNext.style.width = '35px';
                btnNext.style.height = '35px';
                btnNext.style.padding = '0';

                // Crea le immagini e aggiungi l'evento per la modal
                luogo.immagini.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.classList.add('img-fluid');
                    img.style.maxHeight = '200px';
                    img.alt = luogo.nome;
                    img.addEventListener('click', () => {
                        document.querySelector('#imageModalLabel').textContent = luogo.nome;
                        document.querySelector('#modalImage').src = src;
                        const myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                        myModal.show();
                    });
                    immaginiContainer.appendChild(img);
                });

                // Gestione degli eventi di scroll
                btnPrev.addEventListener('click', () => {
                    immaginiContainer.scrollBy({
                        left: -300,
                        behavior: 'smooth'
                    });
                });
                btnNext.addEventListener('click', () => {
                    immaginiContainer.scrollBy({
                        left: 300,
                        behavior: 'smooth'
                    });
                });

                // Assembla la galleria
                galleryWrapper.appendChild(btnPrev);
                galleryWrapper.appendChild(immaginiContainer);
                galleryWrapper.appendChild(btnNext);

                // Assembla la sezione
                section.appendChild(titolo);
                section.appendChild(descrizione);
                section.appendChild(galleryWrapper);

                // Aggiungi la sezione al contenuto principale
                content.appendChild(section);
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            const content = document.getElementById('places-content');
            content.innerHTML = '<p>Errore nel caricamento dei luoghi.</p>';
        });
});
