<?php

header("Content-Type: application/json");

$current_date = date('H:i:s');
echo json_encode([
    'success' => true, 
    'currentTime' => $current_date
]);

?>