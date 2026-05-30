<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once $_SERVER['DOCUMENT_ROOT'] . '/API_Facebook_time_reels/config.php';
require_once BASE_PATH.'MODELO/ConexionBDD.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$conexion = ConexionBDD::getInstancia() -> getConexion();

$stmt = $conexion->prepare("UPDATE sesiones SET 
    hora_fin = NOW(),
    tiempo_total_segundos = ?,
    total_publicaciones_vistas = ?,
    abandono_sitio = ?
    WHERE id_sesion = ?");

$abandono = $data['abandono_sitio'] ? 1 : 0;
$stmt->bind_param("iiii",
    $data['tiempo_total_segundos'],
    $data['total_publicaciones_vistas'],
    $abandono,
    $data['id_sesion']
);

if ($stmt->execute()) {
    echo json_encode(['exito' => true]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => $conexion->error]);
}
exit;
?>