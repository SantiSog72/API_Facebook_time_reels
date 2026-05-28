<?php
// guardar_sesion.php

// 1. Permitir peticiones desde la extensión de Chrome (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 2. Capturar el JSON enviado por el fetch
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if ($data) {
    // 3. Conexión a la base de datos local
    $conexion = new mysqli("localhost", "root", "", "db_scroll_research") or die ("no es posible conectarse con el motor de BD");

    // 4. Sanitizar variables para la consulta
    $id_sujeto = $conexion->real_escape_string($data['id_sujeto']);
    $tiempo_total = $conexion->real_escape_string($data['tiempo_total_segundos']);
    $publicaciones = $conexion->real_escape_string($data['total_publicaciones_vistas']);
    // Convertir booleano a entero para MySQL (1 o 0)
    $estado_int = $data['estado_interrupcion'] ? 1 : 0; 
    $abandono = $data['abandono_sitio'] ? 1 : 0;

    // 5. Insertar en la tabla 'sesiones'
    $sql = "INSERT INTO sesiones (id_sujeto, fecha, hora_inicio, hora_fin, estado_interrupcion, tiempo_total_segundos, total_publicaciones_vistas, abandono_sitio) 
            VALUES ('$id_sujeto', CURDATE(), NOW() - INTERVAL $tiempo_total SECOND, NOW(), '$estado_int', '$tiempo_total', '$publicaciones', '$abandono')";

    if ($conexion->query($sql) === TRUE) {
        // Enviar respuesta exitosa (aunque la pestaña ya esté cerrada, es buena práctica)
        echo json_encode(["status" => "success", "id_sesion" => $conexion->insert_id]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => $conexion->error]);
    }

    $conexion->close();
} else {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos"]);
}
?>