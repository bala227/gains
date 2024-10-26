<?php
// Allow CORS requests from your frontend
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = mysqli_connect("localhost", "root", "", "gym");
if (!$conn) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . mysqli_connect_error()
    ]));
}

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

// Helper function to insert or update exercises
function insertOrUpdateExercises($conn, $username, $category, $exercises) {
    foreach ($exercises as $exercise) {
        $exercise_name = $exercise['exercise'];
        $reps = $exercise['reps'];

        // Check if the exercise already exists for the user in the same category
        $checkQuery = "SELECT * FROM exercises 
                       WHERE username = '$username' 
                       AND category = '$category' 
                       AND exercise_name = '$exercise_name'";

        $result = mysqli_query($conn, $checkQuery);

        if (mysqli_num_rows($result) > 0) {
            // Exercise exists, perform an update
            $updateQuery = "UPDATE exercises 
                            SET reps = '$reps' 
                            WHERE username = '$username' 
                            AND category = '$category' 
                            AND exercise_name = '$exercise_name'";
            if (!mysqli_query($conn, $updateQuery)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update data: ' . mysqli_error($conn)
                ]);
                exit();
            }
        } else {
            // Exercise doesn't exist, perform an insert
            $insertQuery = "INSERT INTO exercises (username, category, exercise_name, reps) 
                            VALUES ('$username', '$category', '$exercise_name', '$reps')";
            if (!mysqli_query($conn, $insertQuery)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to insert data: ' . mysqli_error($conn)
                ]);
                exit();
            }
        }
    }
}

// Insert or update data for each category
insertOrUpdateExercises($conn, $username, 'shoulderlegs', $data['shoulderlegs']);
insertOrUpdateExercises($conn, $username, 'chesttriceps', $data['chesttriceps']);
insertOrUpdateExercises($conn, $username, 'backbiceps', $data['backbiceps']);

// Close the database connection
mysqli_close($conn);

// Send success response
echo json_encode([
    'status' => 'success',
    'message' => 'Data inserted/updated successfully'
]);
?>
