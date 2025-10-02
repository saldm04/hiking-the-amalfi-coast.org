<?php
// Funzione per scansionare ricorsivamente la cartella delle immagini
function getImagesFromDir($dir, $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']) {
    $files = [];
    // Usa RecursiveDirectoryIterator per esplorare la cartella e le sottocartelle
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach($iterator as $file) {
        if ($file->isFile()){
            $ext = strtolower(pathinfo($file->getFilename(), PATHINFO_EXTENSION));
            if (in_array($ext, $extensions)) {
                $path = $file->getPathname();
                // Includi solo le immagini che si trovano nelle sottocartelle "carousel", "events" o "places"
                if (preg_match('/images\/(carousel|events|places)\//i', $path)) {
                    $files[] = $path;
                }
            }
        }
    }
    return $files;
}

$lang = 'it';
if (isset($_GET['lang']) && strtolower($_GET['lang']) === 'en') {
    $lang = 'en';
}

$pageTitle = $lang === 'en' ? 'Hiking The Amalfi Coast - Gallery' : 'Hiking The Amalfi Coast - Galleria';
$metaDescription = $lang === 'en'
    ? 'Photo gallery of Hiking The Amalfi Coast activities, hikes and treks on the Amalfi Coast.'
    : 'Galleria di immagini delle attività di Hiking The Amalfi Coast, escursioni e trekking in Costiera Amalfitana';
$heading = $lang === 'en' ? 'Gallery' : 'Galleria';
$modalCloseText = $lang === 'en' ? 'Close' : 'Chiudi';
$modalImageAlt = $lang === 'en' ? 'Enlarged image' : 'Immagine ingrandita';

$images = getImagesFromDir("images");
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <title><?php echo $pageTitle; ?></title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Foglio di stile personalizzato -->
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Stili personalizzati per la galleria -->
    <meta name="viewport" content="initial-scale=1, width=device-width">
    <meta name="description" content="<?php echo $metaDescription; ?>">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <style>
        .gallery-item img {
            width: 100%;
            height: auto;
            border-radius: 5px;
            cursor: pointer;
        }
        .gallery-item {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

<!-- Include navbar (se la gestisci tramite include o placeholder) -->
<div id="navbar-placeholder"></div>

<div class="container my-5">
    <h1 class="mb-4"><?php echo $heading; ?></h1>
    <div class="row">
        <?php foreach ($images as $img): ?>
            <div class="col-6 col-md-4 col-lg-3 gallery-item">
                <!-- Il link, invece di target="_blank", ha un attributo custom per il modale -->
                <a href="#" data-image="<?php echo $img; ?>">
                    <img src="<?php echo $img; ?>" alt="Immagine della galleria" class="img-fluid">
                </a>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Modal Bootstrap per visualizzare l'immagine ingrandita -->
<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-body p-0">
                <img src="" id="modalImage" class="img-fluid w-100" alt="<?php echo $modalImageAlt; ?>">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php echo $modalCloseText; ?></button>
            </div>
        </div>
    </div>
</div>

<!-- Include footer se presente -->
<div id="footer-placeholder"></div>

<!-- Bootstrap JS + Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Script personalizzato -->
<script src="assets/js/script.js"></script>
<!-- Script per il modale -->
<script>
    document.addEventListener("DOMContentLoaded", function() {
        var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        var modalImage = document.getElementById('modalImage');

        // Aggiunge l'evento click su ogni link della galleria
        document.querySelectorAll('.gallery-item a').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var imgSrc = this.getAttribute('data-image');
                modalImage.src = imgSrc;
                imageModal.show();
            });
        });
    });
</script>
</body>
</html>
