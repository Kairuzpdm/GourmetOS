-- Script de creación de base de datos para el Sistema de Restaurante en PostgreSQL (Supabase)

-- En Supabase la base de datos ya está creada, así que nos saltamos el CREATE DATABASE.

-- Tabla de Usuarios (Para el login y control de roles)
-- PostgreSQL soporta ENUMs usando CREATE TYPE, o podemos usar CHECK
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'mesero', 'cocina', 'cajero')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías de Productos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla de Productos (Platos y Bebidas)
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INT,
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Tabla de Mesas
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero_mesa VARCHAR(20) NOT NULL UNIQUE,
    estado VARCHAR(20) DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada'))
);

-- Tabla de Pedidos (Cabecera del ticket/cuenta)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    mesa_id INT,
    usuario_id INT, -- Mesero que tomó el pedido
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparacion', 'listo', 'entregado', 'pagado', 'cancelado')),
    total DECIMAL(10, 2) DEFAULT 0.00,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Función y Trigger para simular ON UPDATE CURRENT_TIMESTAMP en PostgreSQL
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pedidos_modtime ON pedidos;
CREATE TRIGGER update_pedidos_modtime
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Tabla de Detalle del Pedido (Los productos dentro del pedido)
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparacion', 'listo')),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- INSERCIÓN DE DATOS DE PRUEBA REALISTAS
INSERT INTO usuarios (nombre, username, password, rol) VALUES 
('Juan Admin', 'admin', '$2a$10$5qY4tFjR/iBQDpKRWTkP6.B270Ch550Z./XlxZQDXuoYJZDqMlnOu', 'admin'),
('María Mesera', 'maria', '$2a$10$Ozy0ReJjbgkSkX27h6QTPeiiRE4LHDzOSFVSixvNX0zrPw8qaAImy', 'mesero'),
('Carlos Chef', 'carlos', '$2a$10$9gL2mIySSVwVtnpaNnqIzum/zyIyluapY3MkV3YeVYFL0nelNWT/2', 'cocina'),
('Ana Cajera', 'ana', '$2a$10$esoAI8GPKztIEABmGlKfcuRmbQx.tgIDNGecCHrdhr6/h5Bl6msmK', 'cajero');

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
