<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Conexión a tu BD (db_usuarios o la que prefieras)
require_once $_SERVER['DOCUMENT_ROOT'] . '/API_Facebook_time_reels/config.php';
require_once BASE_PATH.'MODELO/ConexionBDD.class.php';
$conn = ConexionBDD::getInstancia() -> getConexion();

$data = json_decode(file_get_contents('php://input'), true);
$uuid = $data['uuid'];
$url = $data['url'];

$sql = "INSERT INTO sesiones_investigacion (participante_uuid, inicio_timestamp, pagina_origen) 
        VALUES ('$uuid', NOW(), '$url')";

if ($conn->query($sql)) {
    echo json_encode(['id_sesion' => $conn->insert_id]);
}
?>