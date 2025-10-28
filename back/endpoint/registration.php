<?php

require_once('../engine/Repository.php');
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка в данных запроса!'
    ]);
    exit;
}

$repository = new Repository('../database/users.json');
$repository->addManager($data);

?>
