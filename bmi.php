<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

session_start();
$conn = mysqli_connect('localhost', 'root', '', 'gym');
$username = $_SESSION['username'];


if (isset($_POST['bmibutton'])) {

        $weight = $_POST['weight'];
        $height = $_POST['height'];
        $bmi = $_POST['bmi'];
        $date = date("Y-m-d H:i:s");

        $sql = "INSERT INTO userbmi (username, weight, height, bmi, date) VALUES ('$username', '$weight', '$height', '$bmi', '$date')"; 
        $conn->query($sql); 
        
        header("Location:http://localhost:3000/diet");
}

$sql = "SELECT * FROM userbmi WHERE username = '$username'";
$result = $conn->query($sql);

$users = array();
while ($row = $result->fetch_assoc()) {
    $users[] = array(
        "weight"=> $row["weight"],
        "height" => $row["height"],
        "date"=> $row["date"],
        "bmi"=> $row["bmi"],
    );
}
echo json_encode($users);

$conn->close();

