
-- create product table
CREATE TABLE product(
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	prod_id VARCHAR(16) UNIQUE NOT NULL,
	order_id VARCHAR(16) UNIQUE NOT NULL,
	material_cost INT,
	labor_cost INT
);

-- create module1 table
CREATE TABLE module1(
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	order_id VARCHAR(16) NOT NULL,
	material_cost INT,
	labor_cost INT,
	CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES product (order_id)
);

-- create other table
CREATE TABLE other(
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	order_id VARCHAR(16) NOT NULL,
	material_cost INT,
	labor_cost INT,
	CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES product (order_id)
);

-- insert data to product table
INSERT INTO
	product (prod_id, order_id, material_cost, labor_cost)
VALUES
	(
		'1110001',
		'M000000001',
		100,
		50
	),
	(
		'1110002',
		'M000000002',
		120,
		80
	);

-- insert data to module1 table
INSERT INTO
	module1 (order_id, material_cost, labor_cost)
VALUES
	(
		'M000000001',
		20,
		20
	),
	(
		'M000000002',
		50,
		40
	);

-- insert data to other table
INSERT INTO
	other (order_id, material_cost, labor_cost)
VALUES
	(
		'M000000001',
		80,
		30
	),
	(
		'M000000002',
		70,
		40
	);
