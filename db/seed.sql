-- Inserting values should follow below order because of Foreign key constraint:

-- Inserting values into dapartment table
INSERT INTO department (name) 
        VALUES ("Development"), ("Production"), ("Marketing"), ("Finance");

-- Inserting values into role table
INSERT INTO role (title, salary, department_id) 
        VALUES ("Manager", 5000, 1), ("Manager", 6000, 3), ("Manager", 5000, 4), ("Developer", 4000, 1), ("Engineer", 4000, 2);   

-- Inserting values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("K", "Menon", 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("David", "Hudson", 2, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kelly", "Martin", 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dugh", "Laroche", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Steve", "Kapoor", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Junior", 5, NULL);

-- Updating employee with their manager_id once created above
UPDATE employee SET manager_id = 1 WHERE emp_id = 4;
UPDATE employee SET manager_id = 1 WHERE emp_id = 5;
UPDATE employee SET manager_id = 2 WHERE emp_id = 6;