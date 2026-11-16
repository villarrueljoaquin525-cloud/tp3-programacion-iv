CREATE DATABASE IF NOT EXISTS gestion_transporte;
USE gestion_transporte;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    patente VARCHAR(20) NOT NULL UNIQUE,
    anio YEAR NOT NULL,
    capacidad_carga DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS conductores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    numero_licencia VARCHAR(50) NOT NULL UNIQUE,
    fecha_alta_licencia DATE NOT NULL,
    fecha_vencimiento_licencia DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    conductor_id INT NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada DATETIME,
    origen VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    kilometros DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
    FOREIGN KEY (conductor_id) REFERENCES conductores(id)
);
