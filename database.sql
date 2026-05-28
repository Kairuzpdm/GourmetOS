-- Script de creación de base de datos para el Sistema de Restaurante
CREATE DATABASE IF NOT EXISTS restaurante_db;
USE restaurante_db;

-- Tabla de Usuarios (Para el login y control de roles)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'mesero', 'cocina', 'cajero') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías de Productos
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla de Productos (Platos y Bebidas)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INT,
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Tabla de Mesas
CREATE TABLE IF NOT EXISTS mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_mesa VARCHAR(20) NOT NULL UNIQUE,
    estado ENUM('libre', 'ocupada') DEFAULT 'libre'
);

-- Tabla de Pedidos (Cabecera del ticket/cuenta)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT,
    usuario_id INT, -- Mesero que tomó el pedido
    estado ENUM('pendiente', 'preparacion', 'listo', 'entregado', 'pagado') DEFAULT 'pendiente',
    total DECIMAL(10, 2) DEFAULT 0.00,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de Detalle del Pedido (Los productos dentro del pedido)
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'preparacion', 'listo') DEFAULT 'pendiente',
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- INSERCIÓN DE DATOS DE PRUEBA REALISTAS
INSERT INTO usuarios (nombre, username, password, rol) VALUES 
('Juan Admin', 'admin', 'admin123', 'admin'),
('María Mesera', 'maria', 'mesera123', 'mesero'),
('Carlos Chef', 'carlos', 'cocina123', 'cocina'),
('Ana Cajera', 'ana', 'cajero123', 'cajero');

INSERT INTO categorias (nombre, descripcion) VALUES
('Entradas', 'Platos pequeños para empezar'),
('Platos Fuertes', 'Platos principales'),
('Bebidas', 'Refrescos y jugos naturales');

INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Tequeños', 5.50, 1),
('Sopa del Día', 4.00, 1),
('Hamburguesa Clásica', 8.50, 2),
('Parrilla Mixta', 15.00, 2),
('Jugo de Naranja', 2.50, 3),
('Refresco Cola', 2.00, 3);

INSERT INTO mesas (numero_mesa) VALUES ('Mesa 1'), ('Mesa 2'), ('Mesa 3'), ('Mesa 4'), ('Mesa 5');
