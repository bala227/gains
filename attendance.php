<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");
session_start();
// Database connection
$conn = mysqli_connect('localhost', 'root', '', 'gym');
// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}
$curruser = $_SESSION['username'];
// Fetch attendance data
$sql = "SELECT status,date FROM attendance where username = '$curruser'"; // Your table name
$result = $conn->query($sql);

// Prepare response array
$attendanceData = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $attendanceData[] = [
            'date' => $row['date'],
            'attended' => (bool)$row['status'], // Convert to boolean
        ];
    }
}

// Return JSON response
echo json_encode($attendanceData);

// Close the database connection
$conn->close();

