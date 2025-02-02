// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Includi la navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        });

    // Includi il footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll("#sidebar .list-group-item");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Previene il comportamento predefinito del link

            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 156;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Gestisci l'invio del modulo di contatto
    const contactForm = document.getElementById("contactForm");
    const feedbackDiv = document.getElementById("feedback");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Previene l'invio tradizionale del form

            const formData = new FormData(contactForm);

            fetch("processa_contatto.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        feedbackDiv.className = "mt-3 success";
                    } else {
                        feedbackDiv.className = "mt-3 error";
                    }
                    feedbackDiv.textContent = data.message;

                    if (data.status === "success") {
                        contactForm.reset(); // Resetta il modulo in caso di successo
                    }
                })
                .catch(error => {
                    feedbackDiv.className = "mt-3 error";
                    feedbackDiv.textContent = "C'è stato un errore nell'elaborazione della tua richiesta.";
                    console.error("Errore:", error);
                });
        });
    }
});

function updateLogo() {
    const logo = document.getElementById("navbar-logo");
    if (window.innerWidth < 768) {
        logo.src = "images/logoConScritta2.jpg";
    } else {
        logo.src = "images/logoConScritta3.jpg";
    }
}

// Esegui la funzione all'avvio e ad ogni ridimensionamento della finestra
window.addEventListener("load", updateLogo);
window.addEventListener("resize", updateLogo);
