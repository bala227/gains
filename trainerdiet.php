<?php
   header("Content-Type: application/json; charset=UTF-8");
   header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
   header("Access-Control-Allow-Credentials: true"); // Allow credentials
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
   header("Access-Control-Allow-Headers: Content-Type, Authorization");

$conn = mysqli_connect('localhost', 'root', '', 'gym');

$sql = "
    SELECT u.username, b.weight, b.height, b.bmi 
    FROM user u 
    LEFT JOIN userbmi b ON u.username = b.username 
    WHERE u.category <> 'trainer'
";
$result = mysqli_query($conn, $sql);

$users = array();

if ($result->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = array(
            'name' => $row['username'],
            'weight' => $row['weight'],
            'height' => $row['height'],
            'bmi' => $row['bmi'],
        );
    }
}
echo json_encode($users);


if(isset($_POST['suggest'])){

    
$username = $_POST['username'];
$protein = $_POST['protein'];
$vitamins = $_POST['vitamins'];
$carbohydrates = $_POST['carbo'];
$fats = $_POST['fats'];

$check = "SELECT * FROM category WHERE username = '$username'";
$result = mysqli_query($conn, $check);

if ($result->num_rows == 0) {
    $sql = "INSERT INTO category (username,protein, vitamins, carbo, fats) VALUES ('$username','$protein', '$vitamins', '$carbohydrates', '$fats')";
}
else{
    $sql = "UPDATE category SET protein = '$protein',vitamins = '$vitamins',carbo='$carbohydrates',fats = '$fats' WHERE username = '$username'";
}
$conn->query($sql);

header("Location: http://localhost:3000/trainerdiet");
}
mysqli_close($conn);