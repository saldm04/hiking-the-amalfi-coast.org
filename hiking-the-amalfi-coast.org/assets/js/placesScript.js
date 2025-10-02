document.addEventListener('DOMContentLoaded', () => {
    const pageLang = document.documentElement.lang || 'it';
    const placesPath = pageLang === 'en' ? 'assets/json/places-en.json' : 'assets/json/places.json';
    const areasPath = pageLang === 'en' ? 'assets/json/protected-areas-en.json' : 'assets/json/aree-protette.json';
    const errorMessage = pageLang === 'en'
        ? 'Error loading places.'
        : 'Errore nel caricamento dei luoghi.';
    const protectedAreasLabel = pageLang === 'en' ? 'Protected Areas' : 'Aree Protette';
    const regionalParkDescription = pageLang === 'en'
        ? 'The Monti Lattari Regional Park is a protected natural area in the Campania region. Covering about 16,000 hectares, it encompasses the entire Sorrento-Amalfi peninsula. Its territory is rich in natural beauty that makes it unique from both a tourism and heritage perspective, dotted with important historic centers that testify to a deeply rooted human presence as well as environmental features that blend two seemingly contrasting elements: the mountains and the sea.'
        : "Il parco regionale dei Monti Lattari è un'area naturale protetta della regione Campania. Il parco copre una superficie di circa 16.000 ettari e abbraccia l’intera penisola sorrentino-amalfitana. Il suo territorio è ricco di bellezze naturalistiche che lo caratterizzano dal punto di vista turistico patrimoniale ed è disseminato di importantissimi centri storici, testimoni di una presenza fortemente radicata dell’uomo, ma anche di peculiarità ambientali che si esplicitano in un’intima unione tra due elementi apparentemente in contraddizione: la montagna e il mare.";

    // Caricamento dei luoghi
    fetch(placesPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON dei luoghi');
            }
            return response.json();
        })
        .then(data => {
            const sidebarOffcanvas = document.getElementById('places-sidebar-offcanvas');
            const content = document.getElementById('places-content');

            const places = pageLang === 'en' ? data.places : data.luoghi;

            // Popola il sidebar e il contenuto principale per i luoghi
            places.forEach(luogo => {
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

            // Alla fine dell'elenco dei luoghi, aggiungi l'header per le Aree Protette
            const headerAree = document.createElement('h5');
            headerAree.classList.add('mt-3', 'mb-2', 'offcanvas-header');

            // Crea il link all'interno dell'h5
            const linkHeader = document.createElement('a');
            linkHeader.href = "#header-aree-protette"; // Assicurati che l'elemento target abbia questo id nella pagina
            linkHeader.textContent = protectedAreasLabel;

            // Chiudi l'offcanvas al click
            linkHeader.addEventListener('click', () => {
                const offcanvasEl = document.getElementById('offcanvasSidebar');
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            });

            // Applica lo stile inline per renderlo sempre bianco e senza sottolineatura
            linkHeader.style.color = "white";
            linkHeader.style.textDecoration = "none";

            // Inserisci il link nell'h5 e poi l'h5 nel sidebar
            headerAree.appendChild(linkHeader);
            sidebarOffcanvas.appendChild(headerAree);

            // Crea la sezione per l'area protetta nel contenuto principale
            const sectionArea = document.createElement('section');
            sectionArea.id = 'header-aree-protette';
            sectionArea.classList.add('mb-5', 'scroll-section');

            const titoloArea = document.createElement('h2');
            titoloArea.textContent = protectedAreasLabel;

            const descrizioneArea = document.createElement('p');
            descrizioneArea.textContent = regionalParkDescription;

            sectionArea.appendChild(titoloArea);
            sectionArea.appendChild(descrizioneArea);

            content.appendChild(sectionArea);

            // Ora carica le aree protette
            fetch(areasPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nel caricamento del file JSON delle aree protette');
                    }
                    return response.json();
                })
                .then(dataAree => {

                    // Popola il sidebar per le aree protette
                    const areas = pageLang === 'en' ? dataAree.protectedAreas : dataAree.aree;

                    areas.forEach(area => {
                        const linkArea = document.createElement('a');
                        linkArea.classList.add('list-group-item', 'list-group-item-action');
                        linkArea.href = `#${area.id}`;
                        linkArea.textContent = area.nome;

                        // Chiudi l'offcanvas al click
                        linkArea.addEventListener('click', () => {
                            const offcanvasEl = document.getElementById('offcanvasSidebar');
                            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                            if (offcanvasInstance) {
                                offcanvasInstance.hide();
                            }
                        });

                        sidebarOffcanvas.appendChild(linkArea);

                        // Crea la sezione per l'area protetta nel contenuto principale
                        const sectionArea = document.createElement('section');
                        sectionArea.id = area.id;
                        sectionArea.classList.add('mb-5', 'scroll-section');

                        const titoloArea = document.createElement('h2');
                        titoloArea.textContent = area.nome;

                        const descrizioneArea = document.createElement('p');
                        descrizioneArea.textContent = area.descrizione;

                        // Se desideri aggiungere anche una gallery per le aree protette:
                        const galleryWrapperArea = document.createElement('div');
                        galleryWrapperArea.classList.add('d-flex', 'align-items-center', 'mb-3');

                        const btnPrevArea = document.createElement('button');
                        btnPrevArea.classList.add('btn');
                        btnPrevArea.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`;
                        btnPrevArea.style.flexShrink = '0';
                        btnPrevArea.style.backgroundColor = '#003366';
                        btnPrevArea.style.width = '35px';
                        btnPrevArea.style.height = '35px';
                        btnPrevArea.style.padding = '0';

                        const immaginiContainerArea = document.createElement('div');
                        immaginiContainerArea.classList.add('d-flex', 'flex-row', 'overflow-auto', 'gap-2', 'no-scrollbar');
                        immaginiContainerArea.style.scrollBehavior = 'smooth';
                        immaginiContainerArea.style.flexGrow = '1';
                        immaginiContainerArea.style.margin = '0 10px';
                        immaginiContainerArea.style.msOverflowStyle = 'none';
                        immaginiContainerArea.style.scrollbarWidth = 'none';

                        const btnNextArea = document.createElement('button');
                        btnNextArea.classList.add('btn');
                        btnNextArea.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>`;
                        btnNextArea.style.flexShrink = '0';
                        btnNextArea.style.backgroundColor = '#003366';
                        btnNextArea.style.width = '35px';
                        btnNextArea.style.height = '35px';
                        btnNextArea.style.padding = '0';

                        // Aggiungi le immagini della gallery dell'area protetta
                        area.immagini.forEach(src => {
                            const imgArea = document.createElement('img');
                            imgArea.src = src;
                            imgArea.classList.add('img-fluid');
                            imgArea.style.maxHeight = '200px';
                            imgArea.alt = area.nome;
                            imgArea.addEventListener('click', () => {
                                document.querySelector('#imageModalLabel').textContent = area.nome;
                                document.querySelector('#modalImage').src = src;
                                const myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                                myModal.show();
                            });
                            immaginiContainerArea.appendChild(imgArea);
                        });

                        btnPrevArea.addEventListener('click', () => {
                            immaginiContainerArea.scrollBy({
                                left: -300,
                                behavior: 'smooth'
                            });
                        });
                        btnNextArea.addEventListener('click', () => {
                            immaginiContainerArea.scrollBy({
                                left: 300,
                                behavior: 'smooth'
                            });
                        });

                        galleryWrapperArea.appendChild(btnPrevArea);
                        galleryWrapperArea.appendChild(immaginiContainerArea);
                        galleryWrapperArea.appendChild(btnNextArea);

                        sectionArea.appendChild(titoloArea);
                        sectionArea.appendChild(descrizioneArea);
                        sectionArea.appendChild(galleryWrapperArea);

                        content.appendChild(sectionArea);
                    });
                })
                .catch(error => {
                    console.error('Errore nel caricamento delle aree protette:', error);
                });
        })
        .catch(error => {
            console.error('Errore:', error);
            const content = document.getElementById('places-content');
            content.innerHTML = `<p>${errorMessage}</p>`;
        });
});

