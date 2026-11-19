<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function contactResponse(int $code, string $status, string $message = ''): void
{
    http_response_code($code);
    $response = ['status' => $status];
    if ($message !== '') {
        $response['msg'] = $message;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    contactResponse(405, 'error', 'Please submit the contact form.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    contactResponse(413, 'error', 'Your message is too long.');
}

$fields = [];
foreach (['name' => 200, 'email' => 254, 'message' => 10000] as $field => $limit) {
    $value = $_POST[$field] ?? null;
    if (!is_string($value) || strlen($value) > $limit || preg_match('//u', $value) !== 1) {
        contactResponse(400, 'error', 'Please enter a valid name, email address and message.');
    }
    $value = trim($value);
    if ($value === '' || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
        contactResponse(400, 'error', 'Please enter a valid name, email address and message.');
    }
    $fields[$field] = $value;
}

if (preg_match('/[\r\n\t]/', $fields['name'] . $fields['email'])
    || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    contactResponse(400, 'error', 'Please enter a valid name and email address.');
}

$messagePlain = "Name: {$fields['name']}\nEmail: {$fields['email']}\n\n{$fields['message']}\n";

// Keep a private copy before attempting delivery, including when SMTP is down.
$messageDirectory = '/var/lib/1-ad/contact-messages';
$temporaryFile = false;
try {
    if (!is_dir($messageDirectory) || !is_writable($messageDirectory)) {
        throw new RuntimeException('Message storage is unavailable.');
    }
    $temporaryFile = @tempnam($messageDirectory, '.pending-');
    if ($temporaryFile === false || dirname($temporaryFile) !== $messageDirectory
        || !chmod($temporaryFile, 0600)) {
        throw new RuntimeException('Could not create a private message file.');
    }
    $archive = 'Received (UTC): ' . gmdate('Y-m-d\TH:i:s\Z') . "\n" . $messagePlain;
    if (@file_put_contents($temporaryFile, $archive, LOCK_EX) !== strlen($archive)) {
        throw new RuntimeException('Could not save the complete message.');
    }
    $messageFile = $messageDirectory . '/' . gmdate('Ymd\THis\Z')
        . '-' . bin2hex(random_bytes(16)) . '.txt';
    if (!@rename($temporaryFile, $messageFile)) {
        throw new RuntimeException('Could not finish saving the message.');
    }
    $temporaryFile = false;
} catch (Throwable $error) {
    if ($temporaryFile !== false) {
        @unlink($temporaryFile);
    }
    error_log('Contact form: private message storage failed (' . get_class($error) . ').');
    contactResponse(503, 'error', 'We could not save your message. Please email justin@1-ad.com directly.');
}

// Credentials live outside the website and are readable only by root and PHP.
$configPath = '/etc/1-ad/contact-mail.ini';
$config = is_readable($configPath) ? @parse_ini_file($configPath, false, INI_SCANNER_RAW) : false;
if (!is_array($config) || empty($config['username']) || empty($config['password'])
    || !filter_var($config['username'], FILTER_VALIDATE_EMAIL)) {
    error_log('Contact form: Gmail SMTP credentials are not configured.');
    contactResponse(503, 'error', 'Email is temporarily unavailable. Please email justin@1-ad.com directly.');
}

try {
    require_once '/opt/1-ad/contact-mail/vendor/autoload.php';
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->Timeout = 15;
    $mail->Timelimit = 15;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($config['username'], '1-ad.com Contact Form');
    $mail->addAddress('justin@1-ad.com', 'Justin');
    $mail->addReplyTo($fields['email'], $fields['name']);
    $mail->Subject = '1-ad.com Contact Form';
    $mail->isHTML(false);
    $mail->Body = $messagePlain;
    if (!$mail->send()) {
        throw new RuntimeException('SMTP did not accept the message.');
    }
} catch (Throwable $error) {
    // Never include credentials or the visitor's message in public responses/logs.
    error_log('Contact form: SMTP delivery failed (' . get_class($error) . ').');
    contactResponse(502, 'error', 'We could not send your message. Please email justin@1-ad.com directly.');
}

contactResponse(200, 'success');
