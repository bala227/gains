<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['username'])) {
    echo json_encode(['username' => $_SESSION['username']]);
} else {
    echo json_encode(['error' => 'No user logged in']);
}

