document.addEventListener('DOMContentLoaded', () => {
    const pageLang = document.documentElement.lang || 'it';
    const dataPath = pageLang === 'en' ? 'assets/json/events-en.json' : 'assets/json/events.json';
    const errorMessage = pageLang === 'en'
        ? 'Error loading events.'
        : 'Errore nel caricamento degli eventi.';

    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON');
            }
            return response.json();
        })
        .then(data => {
            const timeline = document.getElementById('timeline');

            // Ordina gli eventi per data (futuri in alto, passati in basso)
            data.eventi.sort((a, b) => new Date(b.data) - new Date(a.data));

            // Ottieni la data corrente senza l'ora per il confronto
            const oggi = new Date();
            oggi.setHours(0, 0, 0, 0);

            data.eventi.forEach(evento => {
                // Crea l'oggetto Date per l'evento
                const dataEvento = new Date(evento.data);
                dataEvento.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per il confronto

                // Determina se l'evento è futuro o passato
                const isFuture = dataEvento >= oggi;

                // Crea il contenitore dell'evento
                const timelineItem = document.createElement('div');
                timelineItem.classList.add('timeline-item');

                // Crea l'icona
                const timelineIcon = document.createElement('div');
                timelineIcon.classList.add('timeline-icon');
                timelineIcon.classList.add(isFuture ? 'bg-success' : 'bg-secondary');

                // Crea il contenuto
                const timelineContent = document.createElement('div');
                timelineContent.classList.add('timeline-content');

                // Formatta la data in italiano
                const dataFormattata = dataEvento.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

                // Titolo
                const titolo = document.createElement('h3');
                titolo.classList.add('fw-bold');
                titolo.textContent = `${evento.periodo} - ${evento.titolo}`;

                // Descrizione
                const descrizione = document.createElement('p');
                descrizione.textContent = evento.descrizione;

                // Galleria immagini con frecce e modale
                const galleryWrapper = document.createElement('div');
                galleryWrapper.classList.add('d-flex', 'align-items-center', 'mb-3');

                const btnPrev = document.createElement('button');
                btnPrev.classList.add('btn');
                btnPrev.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`;
                btnPrev.style.flexShrink = '0';
                btnPrev.style.backgroundColor = '#003366';
                btnPrev.style.width = '35px';
                btnPrev.style.height = '35px';
                btnPrev.style.padding = '0';

                const immaginiContainer = document.createElement('div');
                immaginiContainer.classList.add('d-flex', 'flex-row', 'overflow-auto', 'gap-2', 'no-scrollbar');
                immaginiContainer.style.scrollBehavior = 'smooth';
                immaginiContainer.style.flexGrow = '1';
                immaginiContainer.style.margin = '0 10px';
                immaginiContainer.style.msOverflowStyle = 'none';
                immaginiContainer.style.scrollbarWidth = 'none';

                const btnNext = document.createElement('button');
                btnNext.classList.add('btn');
                btnNext.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>`;
                btnNext.style.flexShrink = '0';
                btnNext.style.backgroundColor = '#003366';
                btnNext.style.width = '35px';
                btnNext.style.height = '35px';
                btnNext.style.padding = '0';

                evento.immagini.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.classList.add('img-fluid');
                    img.style.maxHeight = '200px';
                    img.alt = pageLang === 'en'
                        ? `Event photo (${isFuture ? 'upcoming' : 'past'})`
                        : `Foto evento ${isFuture ? 'in arrivo' : 'passato'}`;
                    // Al click, apri il modale impostando titolo e immagine
                    img.addEventListener('click', () => {
                        document.querySelector('#imageModalLabel').textContent = `${evento.periodo} - ${evento.titolo}`;
                        document.querySelector('#modalImage').src = src;
                        const myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                        myModal.show();
                    });
                    immaginiContainer.appendChild(img);
                });

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

                galleryWrapper.appendChild(btnPrev);
                galleryWrapper.appendChild(immaginiContainer);
                galleryWrapper.appendChild(btnNext);

                // Assembla il contenuto dell'evento
                timelineContent.appendChild(titolo);
                timelineContent.appendChild(descrizione);
                timelineContent.appendChild(galleryWrapper);

                // Assembla l'evento completo
                timelineItem.appendChild(timelineIcon);
                timelineItem.appendChild(timelineContent);

                // Aggiungi l'evento alla timeline
                timeline.appendChild(timelineItem);
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            const timeline = document.getElementById('timeline');
            timeline.innerHTML = `<p>${errorMessage}</p>`;
        });
});
