<?php
session_start();

$env = parse_ini_file(__DIR__ . '/../db/env.ini');

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    if ($user === $env['ADMIN_USER'] && $pass === $env['ADMIN_PASS']) {
        $_SESSION['is_admin'] = true; 
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
?>