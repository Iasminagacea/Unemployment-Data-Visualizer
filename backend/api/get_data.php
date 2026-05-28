<?php
require_once '../db/Database.php';

header('Content-Type: application/json');

try {
    $an = isset($_GET['an']) ? (int)$_GET['an'] : null;
    $luna = isset($_GET['luna']) ? (int)$_GET['luna'] : null;
    $judet = isset($_GET['judet']) ? trim($_GET['judet']) : '';

    if (!$an || !$luna) {
        echo json_encode([
            "success" => false,
            "message" => "Anul și luna sunt parametri obligatorii!",
            "debug" => ["an" => $an, "luna" => $luna]
        ]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT * FROM statistici_somaj WHERE an = :an AND luna = :luna";
    $params = [':an' => $an, ':luna' => $luna];

    if ($judet && $judet !== "") {
        $query .= " AND judet = :judet";
        $params[':judet'] = strtoupper($judet);
    }

    $query .= " ORDER BY judet ASC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rezultate = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($rezultate) === 0) {
        error_log("WARNING: Query returned 0 results for an=$an, luna=$luna, judet='$judet'");
        error_log("Query was: $query");
    }

    echo json_encode([
        "success" => true,
        "count" => count($rezultate),
        "data" => $rezultate,
        "cached" => false
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Eroare DB: " . $e->getMessage()]);
}
?>