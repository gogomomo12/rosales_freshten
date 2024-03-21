<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Database connection parameters
$servername = "localhost"; // Change to your MySQL server hostname
$username = "root"; // Change to your MySQL username
$password = ""; // Change to your MySQL password
$dbname = "employeelist"; // Change to your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the email, password, and access level ID from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $password = $data['password'];
    $accessLevelId = $data['access_level_id'];

    // Query to check if the user exists and the password matches
    $sql = "SELECT * FROM employees WHERE email = ? AND password = ? AND access_level_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $email, $password, $accessLevelId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // User authentication successful
        // You can generate and return a token or session identifier here
        // For demonstration, let's return a success message
        $response = ['status' => 1, 'message' => 'Login successful'];
        echo json_encode($response);
    } else {
        // User authentication failed
        $response = ['status' => 0, 'message' => 'Invalid email, password, or access level'];
        echo json_encode($response);
    }
} else {
    // Request method other than POST is not allowed
    $response = ['status' => 0, 'message' => 'Method not allowed'];
    echo json_encode($response);
}

// Close connection
$conn->close();
?>
