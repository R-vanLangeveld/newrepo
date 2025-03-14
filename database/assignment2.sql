-- Data for table `account`
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Changing data where account_id = 1 in table `account`
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Deleting data from table `account` where account_id = 1
DELETE
FROM account
WHERE account_id = 1;

-- Replacing "the small interiors" with "a huge interior" 
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Using INNER JOIN to select inv_make, inv_model, and classification_name
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id;

-- Replacing "/images" with "/images/vehicles" 
UPDATE inventory 
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles'), 
inv_image = REPLACE(inv_thumbnail, '/images', '/images/vehicles');