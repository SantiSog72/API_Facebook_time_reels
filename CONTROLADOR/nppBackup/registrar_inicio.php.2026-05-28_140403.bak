<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/sistema_web_venta_boletos/config.php';

require_once BASE_PATH.'MODELO/libreria_conexionesBD/ConexionBDD.class.php';

$conexion = ConexionBDD::getInstancia();
$lista_rutas_JSON = $conexion -> obtener_rutas();

header('Content-Type: application/json');
echo json_encode($lista_rutas_JSON);
exit;

?>