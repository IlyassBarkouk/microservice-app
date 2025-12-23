INSERT INTO driver (vehicle_type, vehicle_number, available, current_latitude, current_longitude)
VALUES ('Scooter', 'AB-123-CD', true, 0.0, 0.0);

INSERT INTO driver (vehicle_type, vehicle_number, available, current_latitude, current_longitude)
VALUES ('Velo', 'VELO-01', true, 0.0, 0.0);

-- Update sequence
SELECT setval('driver_id_seq', (SELECT MAX(id) FROM driver));
