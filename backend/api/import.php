<?php
session_start();
require_once '../db/Database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo json_encode(["success" => false, "message" => "Acces interzis!"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $an = $_POST['an'] ?? null;
    $luna = $_POST['luna'] ?? null;

    if (!$an || !$luna) {
        echo json_encode(["success" => false, "message" => "Anul și luna sunt obligatorii!"]);
        exit;
    }

    if (!isset($_FILES['csv_general'], $_FILES['csv_mediu'], $_FILES['csv_varsta'], $_FILES['csv_educatie'])) {
        echo json_encode(["success" => false, "message" => "Te rugăm să încarci TOATE cele 4 fișiere!"]);
        exit;
    }

    function parse_number($str) {
        return (int) preg_replace('/[^0-9]/', '', $str);
    }

    function normalize_judet($judet) {
        $j = strtoupper(trim($judet));
        if (strpos($j, 'BUC') !== false) return 'BUCURESTI';
        if (strpos($j, 'BISTRITA') !== false) return 'BISTRITA-NASAUD';
        if (strpos($j, 'CARA') !== false) return 'CARAS-SEVERIN';
        return $j;
    }

    try {
        $database = new Database();
        $db = $database->getConnection();

        $date_combinate = [];

        $f1 = fopen($_FILES['csv_general']['tmp_name'], 'r');
        fgetcsv($f1, 1000, ";"); 
        while (($row = fgetcsv($f1, 1000, ";")) !== FALSE) {
            $judet = normalize_judet($row[0]);
            if (empty($judet) || $judet === 'TOTAL' || $judet === 'TOTAL TARA') continue;

            $date_combinate[$judet] = [
                'total' => parse_number($row[1]), 'femei' => parse_number($row[2]), 'barbati' => parse_number($row[3]),
                'urban' => 0, 'rural' => 0,
                'sub_25' => 0, 'i_25_29' => 0, 'i_30_39' => 0, 'i_40_49' => 0, 'i_50_55' => 0, 'peste_55' => 0,
                'fara_studii' => 0, 'primar' => 0, 'gimnazial' => 0, 'liceal' => 0, 'postliceal' => 0, 'profesional' => 0, 'universitar' => 0
            ];
        }
        fclose($f1);

        $f2 = fopen($_FILES['csv_mediu']['tmp_name'], 'r');
        fgetcsv($f2, 1000, ";");
        while (($row = fgetcsv($f2, 1000, ";")) !== FALSE) {
            $judet = normalize_judet($row[0]);
            if (isset($date_combinate[$judet])) {
                $date_combinate[$judet]['urban'] = parse_number($row[4]);
                $date_combinate[$judet]['rural'] = parse_number($row[7]);
            }
        }
        fclose($f2);

        $f3 = fopen($_FILES['csv_varsta']['tmp_name'], 'r');
        fgetcsv($f3, 1000, ";");
        while (($row = fgetcsv($f3, 1000, ";")) !== FALSE) {
            $judet = normalize_judet($row[0]);
            if (isset($date_combinate[$judet])) {
                $date_combinate[$judet]['sub_25'] = parse_number($row[2]);
                $date_combinate[$judet]['i_25_29'] = parse_number($row[3]);
                $date_combinate[$judet]['i_30_39'] = parse_number($row[4]);
                $date_combinate[$judet]['i_40_49'] = parse_number($row[5]);
                $date_combinate[$judet]['i_50_55'] = parse_number($row[6]);
                $date_combinate[$judet]['peste_55'] = parse_number($row[7]);
            }
        }
        fclose($f3);

        $f4 = fopen($_FILES['csv_educatie']['tmp_name'], 'r');
        fgetcsv($f4, 1000, ";");
        while (($row = fgetcsv($f4, 1000, ";")) !== FALSE) {
            $judet = normalize_judet($row[0]);
            if (isset($date_combinate[$judet])) {
                $date_combinate[$judet]['fara_studii'] = parse_number($row[2]);
                $date_combinate[$judet]['primar'] = parse_number($row[3]);
                $date_combinate[$judet]['gimnazial'] = parse_number($row[4]);
                $date_combinate[$judet]['liceal'] = parse_number($row[5]);
                $date_combinate[$judet]['postliceal'] = parse_number($row[6]);
                $date_combinate[$judet]['profesional'] = parse_number($row[7]);
                $date_combinate[$judet]['universitar'] = parse_number($row[8]);
            }
        }
        fclose($f4);

        $query = "INSERT INTO statistici_somaj 
                  (an, luna, judet, total_someri, femei, barbati, urban, rural, 
                   sub_25, intre_25_29, intre_30_39, intre_40_49, intre_50_55, peste_55,
                   fara_studii, primar, gimnazial, liceal, postliceal, profesional, universitar) 
                  VALUES 
                  (:an, :luna, :judet, :total, :femei, :barbati, :urban, :rural, 
                   :sub_25, :i_25_29, :i_30_39, :i_40_49, :i_50_55, :peste_55,
                   :fara_studii, :primar, :gimnazial, :liceal, :postliceal, :profesional, :universitar)
                  ON CONFLICT (an, luna, judet) DO UPDATE SET 
                  total_someri = EXCLUDED.total_someri, femei = EXCLUDED.femei, barbati = EXCLUDED.barbati,
                  urban = EXCLUDED.urban, rural = EXCLUDED.rural,
                  sub_25 = EXCLUDED.sub_25, intre_25_29 = EXCLUDED.intre_25_29, intre_30_39 = EXCLUDED.intre_30_39, 
                  intre_40_49 = EXCLUDED.intre_40_49, intre_50_55 = EXCLUDED.intre_50_55, peste_55 = EXCLUDED.peste_55,
                  fara_studii = EXCLUDED.fara_studii, primar = EXCLUDED.primar, gimnazial = EXCLUDED.gimnazial, 
                  liceal = EXCLUDED.liceal, postliceal = EXCLUDED.postliceal, profesional = EXCLUDED.profesional, universitar = EXCLUDED.universitar";
                  
        $stmt = $db->prepare($query);
        $inserari = 0;

        foreach ($date_combinate as $nume_judet => $date) {
            $date['an'] = $an;
            $date['luna'] = $luna;
            $date['judet'] = $nume_judet;
            
            $stmt->execute($date);
            $inserari++;
        }

        echo json_encode(["success" => true, "message" => "Import complet! S-au procesat și combinat $inserari județe pentru luna $luna/$an."]);

    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Eroare baza de date: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Metodă invalidă."]);
}
?>