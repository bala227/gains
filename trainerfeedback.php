<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

// Establish connection to the database
$conn = new mysqli("localhost", "root", "", "gym");

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Function to determine sentiment based on keywords
function analyzeSentiment($feedback) {
    // Define keywords for sentiment analysis
    $positiveKeywords = ['good', 'great', 'excellent', 'love', 'fantastic', 'amazing'];
    $negativeKeywords = ['bad', 'terrible', 'hate', 'awful', 'poor', 'worst'];

    $feedbackLower = strtolower($feedback);
    $positiveCount = 0;
    $negativeCount = 0;

    foreach ($positiveKeywords as $word) {
        if (strpos($feedbackLower, $word) !== false) {
            $positiveCount++;
        }
    }

    foreach ($negativeKeywords as $word) {
        if (strpos($feedbackLower, $word) !== false) {
            $negativeCount++;
        }
    }

    // Determine overall sentiment
    if ($positiveCount > $negativeCount) {
        return 'Positive';
    } elseif ($negativeCount > $positiveCount) {
        return 'Negative';
    } else {
        return 'Neutral';
    }
}

// SQL query to fetch feedback data
$sql = "SELECT feedback, username FROM feedback"; // Adjust the table name as needed
$result = $conn->query($sql);

// Check if query was successful
if ($result === false) {
    die(json_encode(['error' => 'Query failed: ' . $conn->error]));
}

// Fetch the feedback data and analyze sentiment
$feedbacks = [];
while ($row = $result->fetch_assoc()) {
    $sentiment = analyzeSentiment($row['feedback']); // Analyze sentiment
    $feedbacks[] = [
        'feedback' => $row['feedback'],
        'username' => $row['username'],
        'sentiment' => $sentiment // Add sentiment to the response
    ];
}

// Close the database connection
$conn->close();

// Return feedback data as JSON
header('Content-Type: application/json');
echo json_encode($feedbacks);
?>