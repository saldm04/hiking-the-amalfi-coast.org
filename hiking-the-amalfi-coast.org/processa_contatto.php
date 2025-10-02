<?php
// processa_contatto.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Includi i file di PHPMailer
require 'assets/php/PHPMailer/src/Exception.php';
require 'assets/php/PHPMailer/src/PHPMailer.php';
require 'assets/php/PHPMailer/src/SMTP.php';

// Includi la configurazione SMTP
require_once $_SERVER['DOCUMENT_ROOT'] . '/cgi-bin/config.php';

header('Content-Type: application/json');

// Configurazione dell'email destinataria
$destinatario = "hikingtheamalficoast@gmail.com"; // Sostituisci con il tuo indirizzo email
$oggetto_predefinito = "Nuovo Messaggio dal Sito Web";

$lang = 'it';
$messages = [
    'it' => [
        'unauthorized' => 'Accesso non autorizzato.',
        'missing_fields' => 'Tutti i campi sono obbligatori.',
        'invalid_email' => 'Indirizzo email non valido.',
        'success' => 'Il tuo messaggio è stato inviato con successo!',
        'error' => "C'è stato un errore nell'invio del tuo messaggio. Riprova più tardi."
    ],
    'en' => [
        'unauthorized' => 'Unauthorized access.',
        'missing_fields' => 'All fields are required.',
        'invalid_email' => 'Invalid email address.',
        'success' => 'Your message was sent successfully!',
        'error' => 'There was an error sending your message. Please try again later.'
    ]
];

// Funzione per sanificare i dati in input
function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Funzione per validare l'email
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Verifica che il form sia stato inviato tramite POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST["lang"]) && strtolower($_POST["lang"]) === 'en') {
        $lang = 'en';
    }

    // Verifica campo honeypot
    if (!empty($_POST["website"])) {
        // Possibile spammer, ignora o registra l'evento
        echo json_encode(["status" => "error", "message" => $messages[$lang]['unauthorized']]);
        exit;
    }
    // Recupera e sanifica i dati
    $nome = sanitize_input($_POST["nome"]);
    $email = sanitize_input($_POST["email"]);
    $oggetto = sanitize_input($_POST["oggetto"]);
    $messaggio = sanitize_input($_POST["messaggio"]);

    // Validazione dei dati
    if (empty($nome) || empty($email) || empty($oggetto) || empty($messaggio)) {
        echo json_encode(["status" => "error", "message" => $messages[$lang]['missing_fields']]);
        exit;
    }

    if (!is_valid_email($email)) {
        echo json_encode(["status" => "error", "message" => $messages[$lang]['invalid_email']]);
        exit;
    }

    // Crea un'istanza di PHPMailer
    $mail = new PHPMailer(true);

    //$mail->SMTPDebug = 2; // Livello di debug: 0 = nessuno, 1 = client messages, 2 = client and server messages
    //$mail->Debugoutput = 'error_log'; // Log degli errori nel file di log PHP

    try {
        // Configurazione del server SMTP
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;

        // Destinatari
        $mail->setFrom(SMTP_USERNAME, "Hiking The Amalfi Coast");
        $mail->addAddress($destinatario);
        $mail->addReplyTo($email, $nome);

        // Contenuto
        $mail->isHTML(false);
        $mail->Subject = $oggetto; // Usa l'oggetto fornito dall'utente
        $mail->Body    = "Hai ricevuto un nuovo messaggio dal tuo sito web.\n\nNome: $nome\nEmail: $email\nOggetto: $oggetto\n\nMessaggio:\n$messaggio";

        $mail->send();
        echo json_encode(["status" => "success", "message" => $messages[$lang]['success']]);
    } catch (Exception $e) {
        // Log degli errori (opzionale)
        // error_log("Errore invio email: " . $mail->ErrorInfo);

        echo json_encode(["status" => "error", "message" => $messages[$lang]['error']]);
    }
} else {
    // Accesso diretto allo script senza invio del form
    echo json_encode(["status" => "error", "message" => $messages[$lang]['unauthorized']]);
}
?>
