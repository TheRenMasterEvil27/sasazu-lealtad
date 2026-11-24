-- Login del personal (instalación nueva). Ejecuta esto DESPUÉS de schema.sql
-- Si ya tenías la tabla usuarios con teléfono, usa db/migracion-usuario.sql en su lugar.
USE sasazu_lealtad;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(30) NOT NULL UNIQUE,       -- con esto inicia sesión (minúsculas)
  nombre VARCHAR(100) NOT NULL,              -- nombre para mostrar
  password_hash VARCHAR(255) NOT NULL,       -- nunca se guarda la contraseña, solo su hash
  activo TINYINT(1) NOT NULL DEFAULT 1,      -- 0 = ya no puede entrar (ex empleado)
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Una fila por sesión abierta. Se guarda el hash del token, no el token,
-- así que aunque alguien vea la base de datos no puede usar las sesiones.
CREATE TABLE IF NOT EXISTS sesiones (
  token_hash CHAR(64) PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  creada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira DATETIME NOT NULL,
  CONSTRAINT fk_sesiones_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_sesiones_expira (expira)
);
