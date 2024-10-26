<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$conn = mysqli_connect('localhost', 'root', '', 'gym');

// Check connection
if (!$conn) {
    echo json_encode(['error' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit();
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = date('Y-m-d');

    // Users who have not marked attendance today
    $sql = "SELECT username FROM user u WHERE u.category = 'gymuser'
            AND NOT EXISTS (
                SELECT 1 FROM attendance a 
                WHERE a.username = u.username AND a.date = '$date'
            )";
    $result = mysqli_query($conn, $sql);

    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }

    // Fetch attendance counts for today
    $todaySql = "SELECT COUNT(*) as count FROM attendance WHERE date = '$date' AND status = 'yes'";
    $todayResult = mysqli_query($conn, $todaySql);
    $todayAttendance = mysqli_fetch_assoc($todayResult);

    // Prepare the total users count
    $totalUsersQuery = "SELECT COUNT(*) as total FROM user WHERE category = 'gymuser'";
    $totalUsersResult = mysqli_query($conn, $totalUsersQuery);
    $totalUsersRow = mysqli_fetch_assoc($totalUsersResult);
    $totalUsers = $totalUsersRow['total'];

    // Prepare attendance summary
    $attendanceSummary = [
        'total_attended' => $todayAttendance['count'] ?? 0,
        'total_absent' => $totalUsers - ($todayAttendance['count'] ?? 0),
        'total_users' => $totalUsers,
    ];

    // Fetch attendance data for the last 7 days
    $attendanceData = [];
    $attendanceSql = "SELECT date, COUNT(*) as count FROM attendance 
                      WHERE status = 'yes' AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                      GROUP BY date
                      ORDER BY date ASC";
    $attendanceResult = mysqli_query($conn, $attendanceSql);
    
    while ($row = mysqli_fetch_assoc($attendanceResult)) {
        $attendanceData[] = $row;
    }

    echo json_encode(['users' => $users, 'attendance' => $attendanceData, 'summary' => $attendanceSummary]);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $status = $_POST['status'];
    $date = $_POST['date']; // Expecting date string from React

    // Insert attendance using username
    $sql = "INSERT INTO attendance (username, status, date) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $status, $date);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Attendance updated successfully';
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }

    echo json_encode($response);
    $stmt->close();
}

// Close the database connection
$conn->close();
