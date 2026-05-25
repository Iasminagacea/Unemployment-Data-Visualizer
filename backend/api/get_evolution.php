<?php
require_once '../db/Database.php';
require_once '../db/CacheManager.php';

header('Content-Type: application/json'); 

try {
    $judet = isset($_GET['judet']) ? $_GET['judet'] : null;

    $cache = new CacheManager(3600); 
    $cacheKey = $cache->getCacheKey('evolution_', ['judet' => $judet]);
    
    $rezultate = $cache->get($cacheKey);
    if ($rezultate !== null) {
        echo json_encode(["success" => true, "data" => $rezultate, "cached" => true]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

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

    $cache->set($cacheKey, $rezultate);

    echo json_encode(["success" => true, "data" => $rezultate, "cached" => false]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Eroare DB: " . $e->getMessage()]);
}
?>