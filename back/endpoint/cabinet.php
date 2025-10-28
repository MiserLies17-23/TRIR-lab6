<?php

require_once('../engine/Repository.php');
header("Content-Type: application/json");

$login = $_GET['login'] ?? '';

if (!empty($login)) {
    $repository = new Repository('../database/users.json');
    $repository->loadUserData($login);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Логин не указан или указан неверно'
    ]);
}

?>