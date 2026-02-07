<?php

header("Content-Type: application/json");

require_once "../config/database.php";

$db = (new Database())->connect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    /**
     * GET /posts
     * Returns all blog posts
     */
    case 'GET':

        $stmt = $db->prepare("SELECT * FROM posts ORDER BY created_at DESC");
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll()
        ]);
        break;

    /**
     * POST /posts
     * Create new post
     */
    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['title']) || empty($data['body'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Title and body are required"
            ]);
            exit;
        }

        if (strlen($data['body']) < 10) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Body must be at least 10 characters"
            ]);
            exit;
        }

        $stmt = $db->prepare(
            "INSERT INTO posts (title, body) VALUES (:title, :body)"
        );

        $stmt->execute([
            ":title" => htmlspecialchars($data['title']),
            ":body" => htmlspecialchars($data['body'])
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Post created successfully"
        ]);
        break;

    /**
     * DELETE /posts?id=1
     * Delete post by ID
     */
    case 'DELETE':

        parse_str($_SERVER['QUERY_STRING'], $params);

        if (empty($params['id']) || !is_numeric($params['id'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Valid post ID is required"
            ]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM posts WHERE id = :id");
        $stmt->execute([
            ":id" => $params['id']
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Post deleted successfully"
        ]);
        break;

    /**
     * Invalid method
     */
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
}
