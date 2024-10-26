<?php
   header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
   header("Access-Control-Allow-Credentials: true"); // Allow credentials
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
   header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
    
    $conn = mysqli_connect('localhost', 'root', '', 'gym');
    
    session_start();
    $curruser = $_SESSION['username'];

    $sql = "SELECT protein,vitamins,carbo,fats FROM category WHERE username = '$curruser'";
    $result = mysqli_query($conn, $sql);
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);

    mysqli_close($conn);

