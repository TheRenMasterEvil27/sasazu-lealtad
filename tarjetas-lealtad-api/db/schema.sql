-- Base de datos de tarjetas de lealtad - Sasazu Burger and Beer
CREATE DATABASE IF NOT EXISTS sasazu_lealtad
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sasazu_lealtad;

CREATE TABLE IF NOT EXISTS clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL UNIQUE,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cada visita/compra del cliente. El total gastado, los sellos y la barra
-- de progreso se CALCULAN a partir de esta tabla (no se guardan aparte),
-- así nunca se desincronizan y corregir un monto es corregir un consumo.
CREATE TABLE IF NOT EXISTS consumos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT UNSIGNED NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consumos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_consumos_cliente (cliente_id)
);
