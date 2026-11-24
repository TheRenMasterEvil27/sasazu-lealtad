-- Para quien YA tiene la tabla usuarios con teléfono: agrega el nombre de usuario.
-- Ejecútalo UNA sola vez. No borra a nadie ni toca clientes ni consumos.
USE sasazu_lealtad;

ALTER TABLE usuarios ADD COLUMN usuario VARCHAR(30) NULL AFTER id;

-- Mientras eliges uno nuevo, tu usuario provisional es tu teléfono
UPDATE usuarios SET usuario = telefono WHERE usuario IS NULL;

ALTER TABLE usuarios
  MODIFY usuario VARCHAR(30) NOT NULL,
  ADD UNIQUE KEY uq_usuarios_usuario (usuario),
  MODIFY telefono VARCHAR(20) NULL;   -- ya no se usa para entrar
