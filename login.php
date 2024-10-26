<?php
    header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
    header("Content-Type: application/json; charset=UTF-8");
    
    if(isset($_POST['signin'])){
        $username = $_POST['username'];    
        $password = $_POST['password'];

        $conn = mysqli_connect('localhost','root','','gym');

        $checksql = "SELECT * FROM user WHERE username = '$username' AND password = '$password'";

        $result = mysqli_query($conn, $checksql);

        $category = "SELECT category FROM user WHERE username = '$username' AND password = '$password'";

        $catcheck = $conn->query($category);
        $row = mysqli_fetch_assoc($catcheck);

        if($result->num_rows == 1){
            session_start();
            $_SESSION["username"] = $username;
            
            if($row['category'] == 'gymuser'){
                header("Location: http://localhost:3000/dashboard1");
            }
            else{
                header("Location: http://localhost:3000/trainerdashboard");
            }
            exit();
        }
        $conn->close();
    }
?>
