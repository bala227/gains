<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers

$conn = mysqli_connect("localhost", "root", "", "gym");

session_start();
$username = $_SESSION['username'];

$query = "SELECT category, exercise_name, reps FROM exercises WHERE username='$username'";
$result = mysqli_query($conn, $query);


$progressData = [];
while ($row = mysqli_fetch_assoc($result)) {
    $category = strtolower($row['category']);
    $progressData[$category][] = [
        'exercise' => $row['exercise_name'],
        'reps' => $row['reps']
    ];
}

echo json_encode($progressData);
mysqli_close($conn);

