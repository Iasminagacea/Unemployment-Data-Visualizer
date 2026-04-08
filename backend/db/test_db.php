<?php

require_once 'Database.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "<h1>Conexiune reușită la PostgreSQL! </h1>";
} else {
    echo "<h1>Eroare de conexiune.</h1>";
}
?>