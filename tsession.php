<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

 $conn = mysqli_connect('localhost', 'root', '', 'gym');
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT * FROM session";

    $result = mysqli_query($conn, $sql);
   
    $sessions = array();
   
   if ($result->num_rows > 0) {
       while ($row = mysqli_fetch_assoc($result)) {
           $sessions[] = array(
               'username' => $row['username'],
               'date' => $row['date'],
               'time'=> $row['time'],
               'title'=> $row['title'],
           );
       }
   }
   echo json_encode($sessions);
}

$conn->close();