<?php
    header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
    header("Content-Type: application/json; charset=UTF-8");

    if(isset($_POST['register'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $category = $_POST['category'];

        $conn = mysqli_connect('localhost','root','','gym');

        $checksql = "SELECT * FROM user WHERE username = '$username' AND password = '$password'";
        $result = mysqli_query($conn,$checksql);

        if($result->num_rows <= 0){
            $sql = "INSERT INTO user (username,password,category) VALUES ('$username','$password','$category')";
            $conn->query($sql);

            if($category == "gymuser"){
            
            $tablename = preg_replace('/[^a-zA-Z0-9_]/', '', $username);

            $sq = "CREATE TABLE `$tablename`(
                proteins INT,
                vitamins INT,
                carbo INT,
                fats INT
            )";
            $conn->query($sq);
            }

            header("Location: http://localhost:3000/SignIn");
        }
        $conn->close();
    }
?>
