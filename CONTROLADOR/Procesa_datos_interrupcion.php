<?php
// Recibir el JSON enviado por el fetch
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    // Aquí guardas los datos en tu base de datos o en un .csv
    $linea = $data['fecha'] . "," . $data['publicaciones_vistas'] . "," . $data['tiempo_reaccion_ms'] . "\n";
    file_put_contents('sesiones_usuario.csv', $linea, FILE_APPEND);
    echo "Guardado";
}
?>