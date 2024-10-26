<?php 
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

session_start();
$conn = mysqli_connect('localhost','root','','gym');


if(isset($_POST['feedbutton'])){

    $username = $_SESSION['username'];
    $feedback = $_POST['feedback'];

    $sql = "INSERT INTO feedback (username,feedback) VALUES ('$username','$feedback')";
    $conn->query($sql);
    header("Location:http://localhost:3000/feedback");
}

$query = "SELECT * FROM feedback";
$result = mysqli_query($conn, $query);


$feedbackData = [];
while ($row = mysqli_fetch_assoc($result)) {
    $feedbackData[] = [
        'username' => $row['username'],
        'feedback' => $row['feedback']
    ];
}

echo json_encode($feedbackData);
mysqli_close($conn);