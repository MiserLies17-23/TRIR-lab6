<?php

require_once('../engine/Repository.php');
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data)) {
    $repository = new Repository('../database/users.json');
    $repository->editApplication($data); 
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Данные не распознаны!'
    ]);
}

?>
