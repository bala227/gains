<?php

// Set CORS headers to allow your React app to communicate with the PHP backend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();

// Connect to the database
$conn = mysqli_connect('localhost', 'root', '', 'gym');
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$username = isset($_SESSION['username']) ? $_SESSION['username'] : null;

if (!$username) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Use a prepared statement to prevent SQL injection
$stmt = $conn->prepare("SELECT weight FROM userbmi WHERE username = ? ORDER BY date DESC LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$weight = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $weight[] = array(
            "weight" => $row["weight"],
        );
    }
}

// Send JSON response back to the client
echo json_encode($weight);

// Close the statement and the connection
$stmt->close();
$conn->close();
