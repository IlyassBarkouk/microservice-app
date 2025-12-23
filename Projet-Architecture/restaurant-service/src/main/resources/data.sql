-- Insert Restaurants
INSERT INTO restaurant (id, name, address, phone, cuisine, available, opening_hours, image_url) VALUES
(1, 'PIZZA MAMA', '123 Rue Roma', '0601020304', 'Italien', true, '10:00-23:00', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65'),
(2, 'MIK BBQ', '123 Rue Roma', '0601020304', 'Korean', true, '12:00-23:00', 'https://images.unsplash.com/photo-1544025162-d76694265947');

-- Insert Menu Items
INSERT INTO menu_item (id, name, description, price, category, available, image_url, restaurant_id) VALUES
(4, 'Margherita', 'Tomate, Mozza', 12.50, 'Pizza', true, NULL, 1),
(5, 'Pasta Carbonara', 'Crème, Lardon', 14.00, 'Pasta', true, NULL, 1),
(6, 'Bibimbap', 'Riz, légumes, ouf, bouf', 15.00, 'Korean', true, NULL, 2),
(7, 'Kimchi Jjigae', 'Soupe épicée au kimchi', 13.50, 'Korean', true, NULL, 2),
(8, 'Korean Fried Chicken', 'Poulet frit sauce coréenne', 16.00, 'Korean', true, NULL, 2);
