<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once $_SERVER['DOCUMENT_ROOT'] . '/API_Facebook_time_reels/config.php';
require_once BASE_PATH.'MODELO/ConexionBDD.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$conexion = ConexionBDD::getInstancia() -> getConexion();

$id = $data['participante_id'];

$consulta = $conexion->prepare("
	INSERT IGNORE INTO sujetos (id_sujeto) 
	VALUES (?)
");

$consulta -> bind_param("s", 
	$id
);

if ($consulta->execute()){
	$json_respuesta = [
		"exito" => true,
		"id" => $id,
		"mensaje" => "respuesta mensaje de exito"
	];
}else{
	$json_respuesta = [
		"exito" => false,
		"mensaje" => "no se pudo registrar el usuairo"
	];
	
}
header('Content-Type: application/json');
echo json_encode($json_respuesta);
exit;

?>