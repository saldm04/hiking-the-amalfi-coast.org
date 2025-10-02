// script.js
document.addEventListener("DOMContentLoaded", () => {
    const pageLang = document.documentElement.lang || "it";
    const navbarFile = pageLang === "en" ? "navbar-en.html" : "navbar.html";
    const footerFile = pageLang === "en" ? "footer-en.html" : "footer.html";

    // Includi la navbar
    fetch(navbarFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            setupLanguageDropdown(pageLang);
            updateLogo();
        });

    // Includi il footer
    fetch(footerFile)
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
    const pageLang = document.documentElement.lang || "it";

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
                    feedbackDiv.textContent = pageLang === "en"
                        ? "There was an error processing your request."
                        : "C'è stato un errore nell'elaborazione della tua richiesta.";
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

// Esegui la funzione all'avvio e ad ogni ridimensionamento della finestra e cambio di pagina
window.addEventListener("load", updateLogo);
window.addEventListener("resize", updateLogo);
window.addEventListener("orientationchange", updateLogo);
document.addEventListener("DOMContentLoaded", updateLogo);

function setupLanguageDropdown(currentLang) {
    const langOptions = document.querySelectorAll(".lang-option");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const searchParams = new URLSearchParams(window.location.search);
    const routes = {
        "": { it: "index.html", en: "index-en.html" },
        "index.html": { it: "index.html", en: "index-en.html" },
        "index-en.html": { it: "index.html", en: "index-en.html" },
        "events.html": { it: "events.html", en: "events-en.html" },
        "events-en.html": { it: "events.html", en: "events-en.html" },
        "places.html": { it: "places.html", en: "places-en.html" },
        "places-en.html": { it: "places.html", en: "places-en.html" },
        "statuto.html": { it: "statuto.html", en: "statute.html" },
        "statute.html": { it: "statuto.html", en: "statute.html" },
        "galleria.php": { it: "galleria.php", en: "galleria.php?lang=en" },
        "404.html": { it: "404.html", en: "404-en.html" },
        "404-en.html": { it: "404.html", en: "404-en.html" }
    };

    const currentRoute = routes[currentPath] || {
        it: "index.html",
        en: "index-en.html"
    };

    if (currentPath === "galleria.php" && searchParams.get("lang") === "en") {
        currentLang = "en";
    }

    const dropdownButton = document.getElementById("languageDropdown");
    if (dropdownButton) {
        dropdownButton.textContent = currentLang === "en" ? "EN" : "IT";
    }

    langOptions.forEach(option => {
        const lang = option.dataset.lang;
        const target = currentRoute[lang] || (lang === "en" ? "index-en.html" : "index.html");
        option.setAttribute("href", target);
        const isActive = lang === currentLang;
        option.classList.toggle("active", isActive);
        if (isActive) {
            option.setAttribute("aria-current", "true");
        } else {
            option.removeAttribute("aria-current");
        }
    });
}
