<?php
require_once '../db/Database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

try {
    $database = new Database();
    $db = $database->getConnection();

    $judet = isset($_GET['judet']) ? $_GET['judet'] : null;

    if ($judet) {
        $query = "SELECT an, luna, total_someri as total 
                  FROM statistici_somaj 
                  WHERE judet = :judet 
                  ORDER BY an ASC, luna ASC";
        $stmt = $db->prepare($query);
        $stmt->execute([':judet' => strtoupper($judet)]);
    } else {
        $query = "SELECT an, luna, SUM(total_someri) as total 
                  FROM statistici_somaj 
                  GROUP BY an, luna 
                  ORDER BY an ASC, luna ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();
    }

    $rezultate = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $rezultate]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Eroare DB: " . $e->getMessage()]);
}
?>