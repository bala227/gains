<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

 $conn = mysqli_connect('localhost', 'root', '', 'gym');

 if(isset($_POST['session'])){

    $username = $_POST['username'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $title = $_POST['title'];
    $meeting_link = $_POST['meeting_link'];

    $sql = "INSERT INTO session (username,date,time,title,meeting_link) VALUES ('$username','$date','$time','$title','$meeting_link')";

    $conn->query($sql);
    header( "Location:http://localhost:3000/trainersession");
 }

 if(isset($_POST["cancel"])){
    $username = $_POST["username"];
    $date = $_POST["date"];
    $title = $_POST["title"];
    $sql = "DELETE FROM session WHERE username = '$username' AND date = '$date' AND title = '$title'";
    $conn->query($sql);
    header( "Location:http://localhost:3000/trainersession");
 }

 $sql = "SELECT username FROM user WHERE category ='gymuser'";

 $result = mysqli_query($conn, $sql);

 $users = array();

if ($result->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = array(
            'username' => $row['username'],
        );
    }
}
echo json_encode($users);

