<?php

require_once('../engine/Repository.php');
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

$login = $data['login'] ?? '';
$password = $data['password'] ?? '';

if (!empty($login) && !empty($password)) {
    $repository = new Repository('../database/users.json');
    $repository->loginVerification($login, $password);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Логин не указан'
    ]);
}

?>