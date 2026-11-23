-- Datos de prueba (opcional). Ejecuta esto DESPUÉS de schema.sql
USE sasazu_lealtad;

INSERT INTO clientes (nombre, telefono) VALUES
  ('María González', '5522334455'),
  ('Jorge Ramírez',  '5588772211'),
  ('Carla López',    '5599441020');

INSERT INTO consumos (cliente_id, monto, fecha) VALUES
  (1, 310, '2026-08-02 14:10:00'),
  (1, 180, '2026-08-14 20:30:00'),
  (1, 220, '2026-08-28 19:45:00'),
  (2, 200, '2026-08-05 21:00:00'),
  (2, 150, '2026-08-20 13:15:00'),
  (3, 200, '2026-08-18 18:20:00'),
  (3, 275, '2026-08-30 20:05:00');
