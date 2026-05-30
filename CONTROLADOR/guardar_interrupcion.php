<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// header('Content-Type: application/json');

require_once $_SERVER['DOCUMENT_ROOT'] . '/API_Facebook_time_reels/config.php';
require_once BASE_PATH . 'MODELO/ConexionBDD.class.php';
$conn = ConexionBDD::getInstancia()->getConexion();

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("INSERT INTO interrupciones_log 
    (id_sesion, tiempo_transcurrido_segundos, publicaciones_vistas_momento, accion_usuario, tiempo_respuesta_ms) 
    VALUES (?, ?, ?, ?, ?)");

$tiempo_segundos = (int) round($data['tiempo_total'] / 1000);

$stmt->bind_param("iiisi",
    $data['id_sesion'],
    $tiempo_segundos,
    $data['publicaciones'],
    $data['accion_usuario'],
    $data['tiempo_reaccion']
);

if ($stmt->execute()) {
    echo json_encode(['exito' => true, 'id_log' => $conn->insert_id]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => $conn->error]);
}
exit;
?>