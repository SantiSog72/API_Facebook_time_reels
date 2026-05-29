<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once $_SERVER['DOCUMENT_ROOT'] . '/API_Facebook_time_reels/config.php';
require_once BASE_PATH.'MODELO/ConexionBDD.class.php';
$conn = ConexionBDD::getInstancia() -> getConexion();

$id_sesion = $_POST['id_sesion'];
$uuid = $_POST['uuid'];

// Actualizamos la fila que creamos al inicio
$sql = "UPDATE sesiones_investigacion 
        SET fin_timestamp = NOW() 
        WHERE id_sesion = '$id_sesion' AND participante_uuid = '$uuid'";

$conn->query($sql);
?>