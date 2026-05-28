<?php
// ruta del servidor (PHP)
//__DIR__ es una constante que devuelve la ruta absoluta en la que se esta ejecutando el archivo actual
// DIRECTORY_SEPARATOR devuelve el tipo de separador que usa el SO (linux "\"; windows "/")
if (!defined('BASE_PATH')) {
    define('BASE_PATH', __DIR__ . DIRECTORY_SEPARATOR);
}

// 2. RUTA WEB (Para el navegador: JS, CSS, Imágenes)
// identifica si es con hhtps o http
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
// devuelve de forma dinamica el host (si es local el localhost, si es en lina el dominio de la pagina)
$host = $_SERVER['HTTP_HOST'];

// Detectamos la carpeta del proyecto dinámicamente
// Esto convertirá "C:\xampp\htdocs\sistema_web_venta_boletos" en "/sistema_web_venta_boletos/"
$folder = str_replace($_SERVER['DOCUMENT_ROOT'], '', str_replace('\\', '/', __DIR__));
$folder = '/' . trim($folder, '/') . '/';

if (!defined('WEB_ROOT')) {
    // Usamos rawurldecode para asegurar que los espacios se traten correctamente si es necesario
    define('WEB_ROOT', $protocol . $host . $folder);
}
?>