<?php
require_once '../db/Database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

try {
    $database = new Database();
    $db = $database->getConnection();

    $an = isset($_GET['an']) ? (int)$_GET['an'] : null;
    $luna = isset($_GET['luna']) ? (int)$_GET['luna'] : null;
    $judet = isset($_GET['judet']) ? $_GET['judet'] : null;

    $query = "SELECT * FROM statistici_somaj WHERE 1=1";
    $params = [];

    if ($an) {
        $query .= " AND an = :an";
        $params[':an'] = $an;
    }
    if ($luna) {
        $query .= " AND luna = :luna";
        $params[':luna'] = $luna;
    }
    if ($judet) {
        $query .= " AND judet = :judet";
        $params[':judet'] = strtoupper($judet);
    }

    $query .= " ORDER BY an DESC, luna DESC, judet ASC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);

    $rezultate = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($rezultate),
        "data" => $rezultate
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Eroare DB: " . $e->getMessage()]);
}
?>