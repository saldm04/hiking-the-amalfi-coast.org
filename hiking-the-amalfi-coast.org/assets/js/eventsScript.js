// assets/js/eventsScript.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/json/events.json') // Assicurati che il percorso sia corretto
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
            oggi.setHours(0,0,0,0);

            data.eventi.forEach(evento => {
                // Crea l'oggetto Date per l'evento
                const dataEvento = new Date(evento.data);
                dataEvento.setHours(0,0,0,0); // Imposta l'ora a mezzanotte per il confronto

                // Determina se l'evento è futuro o passato
                const tipo = dataEvento >= oggi ? 'futuro' : 'passato';

                // Crea il contenitore dell'evento
                const timelineItem = document.createElement('div');
                timelineItem.classList.add('timeline-item');

                // Crea l'icona
                const timelineIcon = document.createElement('div');
                timelineIcon.classList.add('timeline-icon');
                timelineIcon.classList.add(tipo === 'futuro' ? 'bg-success' : 'bg-secondary');

                // Crea il contenuto
                const timelineContent = document.createElement('div');
                timelineContent.classList.add('timeline-content');

                // Formatta la data in italiano
                const dataFormattata = dataEvento.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

                // Titolo
                const titolo = document.createElement('h3');
                titolo.classList.add('fw-bold');
                titolo.textContent = `${dataFormattata} - ${evento.titolo}`;

                // Descrizione
                const descrizione = document.createElement('p');
                descrizione.textContent = evento.descrizione;

                // Immagini
                const row = document.createElement('div');
                row.classList.add('row');

                evento.immagini.forEach(src => {
                    const col = document.createElement('div');
                    col.classList.add('col-6', 'col-md-3');

                    const img = document.createElement('img');
                    img.src = src;
                    img.classList.add('img-fluid', 'mb-2');
                    img.alt = `Foto evento ${tipo}`;

                    col.appendChild(img);
                    row.appendChild(col);
                });

                // Assembla il contenuto
                timelineContent.appendChild(titolo);
                timelineContent.appendChild(descrizione);
                timelineContent.appendChild(row);

                // Assembla l'evento
                timelineItem.appendChild(timelineIcon);
                timelineItem.appendChild(timelineContent);

                // Aggiungi l'evento alla timeline
                timeline.appendChild(timelineItem);
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            const timeline = document.getElementById('timeline');
            timeline.innerHTML = '<p>Errore nel caricamento degli eventi.</p>';
        });
});
