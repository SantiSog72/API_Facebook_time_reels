-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2026 a las 19:59:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_scroll_infinito`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interrupciones_log`
--

CREATE TABLE `interrupciones_log` (
  `id_log` int(11) NOT NULL,
  `id_sesion` int(11) DEFAULT NULL,
  `tiempo_transcurrido_segundos` int(11) DEFAULT NULL,
  `publicaciones_vistas_momento` int(11) DEFAULT NULL,
  `accion_usuario` enum('continuar','abandonar_pagina','ignorado') DEFAULT NULL,
  `tiempo_respuesta_ms` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id_sesion` int(11) NOT NULL,
  `id_sujeto` varchar(60) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` datetime DEFAULT NULL,
  `hora_fin` datetime DEFAULT NULL,
  `estado_interrupcion` tinyint(1) DEFAULT NULL,
  `tiempo_total_segundos` int(11) DEFAULT NULL,
  `total_publicaciones_vistas` int(11) DEFAULT NULL,
  `abandono_sitio` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sujetos`
--

CREATE TABLE `sujetos` (
  `id_sujeto` varchar(60) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `interrupciones_log`
--
ALTER TABLE `interrupciones_log`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_sesion` (`id_sesion`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `sujeto_sesion` (`id_sujeto`);

--
-- Indices de la tabla `sujetos`
--
ALTER TABLE `sujetos`
  ADD PRIMARY KEY (`id_sujeto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `interrupciones_log`
--
ALTER TABLE `interrupciones_log`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `interrupciones_log`
--
ALTER TABLE `interrupciones_log`
  ADD CONSTRAINT `interrupciones_log_ibfk_1` FOREIGN KEY (`id_sesion`) REFERENCES `sesiones` (`id_sesion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sujeto_sesion` FOREIGN KEY (`id_sujeto`) REFERENCES `sujetos` (`id_sujeto`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
