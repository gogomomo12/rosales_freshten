<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[3]) && $path[3] === 'access_levels') {
            // Fetch access levels
            $sql = "SELECT * FROM access_levels";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $accessLevels = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($accessLevels);
        } else {
            // Fetch employees
            $sql = "SELECT * FROM employees";
            if (isset($path[4]) && is_numeric($path[4])) {
                $sql .= " WHERE employee_id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $path[4]);
                $stmt->execute();
                $employees = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            echo json_encode($employees);
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['description'])) {
            // Insert into access_levels table
            $sql = "INSERT INTO access_levels (description) VALUES (:description)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':description', $data['description']);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Access level added successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to add access level.'];
            }
        } else {
            // Insert into employees table
            $sql = "INSERT INTO employees (firstname, lastname, age, birth_date, email, password, date_created, job_title, access_level_id, date_modified) VALUES (:firstname, :lastname, :age, :birth_date, :email, :password, :date_created, :job_title, :access_level_id, :date_modified)";
            $stmt = $conn->prepare($sql);
            $date_created = date('Y-m-d');
            $date_modified = date('Y-m-d');
            $stmt->bindParam(':firstname', $data['firstname']);
            $stmt->bindParam(':lastname', $data['lastname']);
            $stmt->bindParam(':age', $data['age']);
            $stmt->bindParam(':birth_date', $data['birth_date']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $data['password']);
            $stmt->bindParam(':date_created', $date_created);
            $stmt->bindParam(':job_title', $data['job_title']);
            $stmt->bindParam(':access_level_id', $data['access_level']);
            $stmt->bindParam(':date_modified', $date_modified);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record created successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
            }
        }

        echo json_encode($response);
        break;

    case "PUT":
        $employee = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE employees SET firstname= :firstname, lastname = :lastname, age = :age, birth_date = :birth_date, email = :email, password = :password, job_title = :job_title, access_level_id = :access_level_id, date_modified = :date_modified WHERE employee_id = :employee_id";
        $stmt = $conn->prepare($sql);
        $date_modified = date('Y-m-d');
        $stmt->bindParam(':employee_id', $employee->employee_id);
        $stmt->bindParam(':firstname', $employee->firstname);
        $stmt->bindParam(':lastname', $employee->lastname);
        $stmt->bindParam(':age', $employee->age);
        $stmt->bindParam(':birth_date', $employee->birth_date);
        $stmt->bindParam(':email', $employee->email);
        $stmt->bindParam(':password', $employee->password);
        $stmt->bindParam(':job_title', $employee->job_title);
        $stmt->bindParam(':access_level_id', $employee->access_level_id);
        $stmt->bindParam(':date_modified', $date_modified);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM employees WHERE employee_id = :employee_id";
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':employee_id', $path[4]);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}
